const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../middleware/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { validate, schemas } = require('../utils/validators');
const { validatePhone } = require('../utils/phone');
const { hashPhone } = require('../utils/encryption');
const { sendTokenResponse } = require('../utils/jwt');
const {
  createAdmin,
  getAdminByEmail,
  getAdminByPhoneHash,
  updateAdmin,
  updateAdminPassword,
  updateLastLogin
} = require('../repositories/adminRepository');
const {
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  deleteOtpByPurpose,
  createOtp,
  findOtp,
  getOtpById,
  markOtpConsumed
} = require('../repositories/tokenRepository');
const { sendPasswordResetEmail, sendEmail } = require('../services/emailService');
const { sendOTP } = require('../services/smsService');
const config = require('../config');

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return `******${digits.slice(-4)}`;
};

const register = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.adminRegister, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const phoneValidation = validatePhone(value.phone);
  if (phoneValidation.error) {
    return next(new AppError(phoneValidation.error, 400));
  }

  const normalizedPhone = phoneValidation.value;

  const existingByEmail = await getAdminByEmail(value.email);
  if (existingByEmail) {
    return next(new AppError('Email already registered', 409));
  }

  const phoneHash = hashPhone(normalizedPhone);
  const existingByPhone = await getAdminByPhoneHash(phoneHash);
  if (existingByPhone) {
    return next(new AppError('Phone number already registered', 409));
  }

  const passwordHash = await bcrypt.hash(value.password, config.bcryptRounds);

  const admin = await createAdmin({
    full_name: value.full_name,
    phone: normalizedPhone,
    email: value.email,
    password_hash: passwordHash,
    role: value.role || 'admin'
  });

  sendTokenResponse(admin, false, res);
});

const login = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.adminLogin, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const { identifier, password, remember_me } = value;

  const isEmail = identifier.includes('@');

  let admin;
  if (isEmail) {
    admin = await getAdminByEmail(identifier);
  } else {
    const phoneValidation = validatePhone(identifier);
    if (phoneValidation.error) {
      return next(new AppError('Invalid phone number format', 400));
    }
    const phoneHash = hashPhone(phoneValidation.value);
    admin = await getAdminByPhoneHash(phoneHash);
  }

  if (!admin) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

  if (!isPasswordValid) {
    return next(new AppError('Invalid credentials', 401));
  }

  if (admin.two_factor_enabled) {
    if (!admin.phone) {
      return next(new AppError('Two-factor authentication enabled but phone number missing. Please contact support.', 400));
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + config.phone.otpExpiryMinutes * 60 * 1000).toISOString();
    const challengeId = uuidv4();
    const phoneHash = hashPhone(admin.phone);

    deleteOtpByPurpose(admin.id, 'two_factor_login');

    await createOtp({
      id: challengeId,
      adminId: admin.id,
      destinationHash: phoneHash,
      code: otpCode,
      purpose: 'two_factor_login',
      expiresAt
    });

    await sendOTP(admin.phone, `Your RBC Counselling verification code is ${otpCode}. It expires in ${config.phone.otpExpiryMinutes} minutes.`);

    await sendEmail({
      to: admin.email,
      subject: 'RBC Counselling Login Verification Code',
      text: `Your verification code is ${otpCode}. It expires in ${config.phone.otpExpiryMinutes} minutes.`,
      html: `<p>Your verification code is <strong>${otpCode}</strong>.</p><p>This code expires in ${config.phone.otpExpiryMinutes} minutes.</p>`
    });

    return res.status(200).json({
      success: true,
      requires_two_factor: true,
      challenge_id: challengeId,
      message: `Enter the verification code sent to ${maskPhoneNumber(admin.phone)}.`,
      expires_in: config.phone.otpExpiryMinutes * 60
    });
  }

  await updateLastLogin(admin.id);

  sendTokenResponse(admin, remember_me || false, res);
});

const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie(config.jwt.cookieName)
    .json({ success: true, message: 'Logged out successfully' });
});

const getCurrentAdmin = asyncHandler(async (req, res, next) => {
  const admin = { ...req.admin };
  delete admin.password_hash;
  delete admin.phone_encrypted;

  res.status(200).json({
    success: true,
    admin
  });
});

const requestPasswordReset = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.passwordReset, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const { identifier } = value;

  const isEmail = identifier.includes('@');

  let admin;
  if (isEmail) {
    admin = await getAdminByEmail(identifier);
  } else {
    const phoneValidation = validatePhone(identifier);
    if (phoneValidation.error) {
      return res.status(200).json({ 
        success: true, 
        message: 'If an account exists, a password reset link has been sent' 
      });
    }
    const phoneHash = hashPhone(phoneValidation.value);
    admin = await getAdminByPhoneHash(phoneHash);
  }

  if (!admin) {
    return res.status(200).json({ 
      success: true, 
      message: 'If an account exists, a password reset link has been sent' 
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + config.passwordResetExpiryMinutes * 60 * 1000).toISOString();

  await createPasswordResetToken(uuidv4(), resetToken, admin.id, expiresAt);

  await sendPasswordResetEmail(admin.email, resetToken);

  res.status(200).json({
    success: true,
    message: 'Password reset instructions sent to your email'
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { error, value } = validate(schemas.passwordChange, req.body);

  if (error) {
    return next(new AppError(error[0].message, 400));
  }

  const { token, new_password } = value;

  const resetTokenRecord = await findPasswordResetToken(token);

  if (!resetTokenRecord) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  const now = new Date();
  const expiresAt = new Date(resetTokenRecord.expires_at);

  if (now > expiresAt) {
    return next(new AppError('Reset token has expired', 400));
  }

  const passwordHash = await bcrypt.hash(new_password, config.bcryptRounds);

  await updateAdminPassword(resetTokenRecord.admin_id, passwordHash);
  await markPasswordResetTokenUsed(token);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});

module.exports = {
  register,
  login,
  logout,
  getCurrentAdmin,
  requestPasswordReset,
  resetPassword
};

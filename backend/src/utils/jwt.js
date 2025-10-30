const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (payload, rememberMe = false) => {
  const expiry = rememberMe ? config.jwt.rememberExpire : config.jwt.expire;
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiry
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

const sendTokenResponse = (admin, rememberMe, res) => {
  const token = generateToken(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role
    },
    rememberMe
  );

  const cookieExpiry = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiry),
    httpOnly: true,
    secure: config.cookies.secure,
    sameSite: config.cookies.sameSite
  };

  res
    .status(200)
    .cookie(config.jwt.cookieName, token, cookieOptions)
    .json({
      success: true,
      token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        phone_last4: admin.phone_last4,
        role: admin.role
      }
    });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse
};

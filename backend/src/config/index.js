const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  dotenv.config({ path: path.join(__dirname, '../../.env.example') });
}

const bool = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const number = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8000',
  databasePath: process.env.DATABASE_PATH
    ? path.resolve(path.join(__dirname, '../../', process.env.DATABASE_PATH))
    : path.join(__dirname, '../../database/rbc_counselling.db'),
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-now',
    expire: process.env.JWT_EXPIRE || '1d',
    rememberExpire: process.env.JWT_REMEMBER_ME_EXPIRE || '30d',
    cookieName: process.env.JWT_COOKIE_NAME || 'rbcc_auth'
  },
  bcryptRounds: number(process.env.BCRYPT_ROUNDS, 12),
  rateLimit: {
    windowMs: number(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: number(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    loginMax: number(process.env.LOGIN_RATE_LIMIT_MAX_REQUESTS, 10)
  },
  phone: {
    encryptionKey: process.env.PHONE_ENCRYPTION_KEY || '',
    otpExpiryMinutes: number(process.env.PHONE_OTP_EXPIRY_MINUTES, 10)
  },
  passwordResetExpiryMinutes: number(process.env.PASSWORD_RESET_EXPIRY_MINUTES, 30),
  email: {
    host: process.env.EMAIL_HOST,
    port: number(process.env.EMAIL_PORT, 587),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'RBC Counselling <noreply@rbccounselling.com>',
    adminNotification: process.env.ADMIN_NOTIFICATION_EMAIL
  },
  sms: {
    enabled: bool(process.env.SMS_ENABLED, false),
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_PHONE_NUMBER,
    adminPhone: process.env.ADMIN_NOTIFICATION_PHONE
  },
  csrf: {
    cookieName: process.env.CSRF_COOKIE_NAME || 'rbcc_csrf'
  },
  cookies: {
    secret: process.env.COOKIE_SECRET || 'change-cookie-secret',
    secure: bool(process.env.COOKIE_SECURE, false),
    sameSite: process.env.SAME_SITE || 'lax'
  }
};

config.isProduction = config.env === 'production';

module.exports = config;

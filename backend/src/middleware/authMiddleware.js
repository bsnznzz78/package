const config = require('../config');
const { verifyToken } = require('../utils/jwt');
const { AppError } = require('./errorHandler');
const { getAdminById } = require('../repositories/adminRepository');

const authenticate = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  let token = null;

  if (bearerToken && bearerToken.startsWith('Bearer ')) {
    token = bearerToken.split(' ')[1];
  }

  if (!token) {
    token = req.cookies[config.jwt.cookieName];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return next(new AppError('Invalid or expired token', 401));
  }

  const admin = await getAdminById(decoded.id);

  if (!admin) {
    return next(new AppError('The user belonging to this token no longer exists', 401));
  }

  req.admin = admin;
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};

module.exports = {
  authenticate,
  authorize
};

const { getDatabase } = require('../database');

const createPasswordResetToken = (id, token, adminId, expiresAt) => {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO password_reset_tokens (id, admin_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(id, adminId, token, expiresAt);
};

const findPasswordResetToken = (token) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0');
  return stmt.get(token);
};

const markPasswordResetTokenUsed = (token) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE token = ?');
  stmt.run(token);
};

const deleteExpiredPasswordResetTokens = () => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM password_reset_tokens WHERE expires_at < CURRENT_TIMESTAMP');
  stmt.run();
};

const deleteOtpByPurpose = (adminId, purpose) => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM otp_codes WHERE admin_id = ? AND purpose = ?');
  stmt.run(adminId, purpose);
};

const createOtp = ({ id, adminId, destinationHash, code, purpose, expiresAt }) => {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO otp_codes (id, admin_id, destination_hash, code, purpose, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, adminId, destinationHash, code, purpose, expiresAt);
};

const findOtp = (adminId, destinationHash, purpose) => {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM otp_codes
    WHERE admin_id = ?
      AND destination_hash = ?
      AND purpose = ?
      AND consumed = 0
      AND expires_at >= CURRENT_TIMESTAMP
    ORDER BY created_at DESC
    LIMIT 1
  `);

  return stmt.get(adminId, destinationHash, purpose);
};

const getOtpById = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM otp_codes WHERE id = ?');
  return stmt.get(id);
};

const markOtpConsumed = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE otp_codes SET consumed = 1 WHERE id = ?');
  stmt.run(id);
};

const deleteExpiredOtps = () => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM otp_codes WHERE expires_at < CURRENT_TIMESTAMP');
  stmt.run();
};

module.exports = {
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  deleteExpiredPasswordResetTokens,
  deleteOtpByPurpose,
  createOtp,
  findOtp,
  getOtpById,
  markOtpConsumed,
  deleteExpiredOtps
};

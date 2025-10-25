const { getDatabase } = require('../database');
const { encryptPhoneData, decryptPhone } = require('../utils/encryption');

const createAdmin = ({ full_name, phone, email, password_hash, role = 'admin' }) => {
  const db = getDatabase();
  const phoneData = encryptPhoneData(phone);

  const stmt = db.prepare(`
    INSERT INTO admins (full_name, phone_encrypted, phone_hash, phone_last4, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    full_name,
    phoneData.encrypted,
    phoneData.hash,
    phoneData.last4,
    email,
    password_hash,
    role
  );

  return getAdminById(result.lastInsertRowid);
};

const getAdminById = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM admins WHERE id = ?');
  const admin = stmt.get(id);

  if (admin && admin.phone_encrypted) {
    admin.phone = decryptPhone(admin.phone_encrypted);
    delete admin.phone_encrypted;
  }

  return admin;
};

const getAdminByEmail = (email) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM admins WHERE email = ?');
  const admin = stmt.get(email);

  if (admin && admin.phone_encrypted) {
    admin.phone = decryptPhone(admin.phone_encrypted);
    delete admin.phone_encrypted;
  }

  return admin;
};

const getAdminByPhoneHash = (phoneHash) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM admins WHERE phone_hash = ?');
  const admin = stmt.get(phoneHash);

  if (admin && admin.phone_encrypted) {
    admin.phone = decryptPhone(admin.phone_encrypted);
    delete admin.phone_encrypted;
  }

  return admin;
};

const updateAdmin = (id, updates) => {
  const db = getDatabase();
  const allowedFields = ['full_name', 'email', 'role', 'is_phone_verified', 'two_factor_enabled'];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const stmt = db.prepare(`UPDATE admins SET ${fields.join(', ')} WHERE id = ?`);
  const result = stmt.run(...values);

  return result.changes > 0;
};

const updateAdminPassword = (id, password_hash) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
  const result = stmt.run(password_hash, id);
  return result.changes > 0;
};

const updateLastLogin = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run(id);
};

const getAllAdmins = () => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, full_name, email, phone_last4, role, created_at, last_login_at FROM admins ORDER BY created_at DESC');
  return stmt.all();
};

const deleteAdmin = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM admins WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

module.exports = {
  createAdmin,
  getAdminById,
  getAdminByEmail,
  getAdminByPhoneHash,
  updateAdmin,
  updateAdminPassword,
  updateLastLogin,
  getAllAdmins,
  deleteAdmin
};

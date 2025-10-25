const { getDatabase } = require('../database');
const { encryptPhoneData, decryptPhone } = require('../utils/encryption');

const parseNotes = (notes) => {
  if (!notes) return [];
  try {
    const parsed = JSON.parse(notes);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const stringifyNotes = (notesArray) => JSON.stringify(notesArray || []);

const attachPhone = (record) => {
  if (!record) return null;
  if (record.phone_encrypted) {
    record.phone = decryptPhone(record.phone_encrypted);
    delete record.phone_encrypted;
  }
  if (record.notes) {
    record.notes = parseNotes(record.notes);
  }
  return record;
};

const attachPhoneToList = (records = []) => records.map((record) => attachPhone(record));

const createContactSubmission = ({ name, phone, email, message, state }) => {
  const db = getDatabase();
  const phoneData = encryptPhoneData(phone);

  const stmt = db.prepare(`
    INSERT INTO contact_submissions (name, phone_encrypted, phone_hash, phone_last4, email, message, state)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    phoneData.encrypted,
    phoneData.hash,
    phoneData.last4,
    email,
    message,
    state
  );

  return getContactSubmissionById(result.lastInsertRowid);
};

const getContactSubmissionById = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM contact_submissions WHERE id = ?');
  const submission = stmt.get(id);
  return attachPhone(submission);
};

const listContactSubmissions = (filters = {}) => {
  const db = getDatabase();
  const conditions = ['archived = 0'];
  const values = [];

  if (filters.status) {
    conditions.push('status = ?');
    values.push(filters.status);
  }

  if (filters.state) {
    conditions.push('state = ?');
    values.push(filters.state);
  }

  if (filters.phoneHash) {
    conditions.push('phone_hash = ?');
    values.push(filters.phoneHash);
  }

  if (filters.name) {
    conditions.push('LOWER(name) LIKE ?');
    values.push(`%${filters.name.toLowerCase()}%`);
  }

  if (filters.from_date) {
    conditions.push('date(created_at) >= date(?)');
    values.push(filters.from_date);
  }

  if (filters.to_date) {
    conditions.push('date(created_at) <= date(?)');
    values.push(filters.to_date);
  }

  const query = `SELECT * FROM contact_submissions WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
  const stmt = db.prepare(query);
  const submissions = stmt.all(...values);
  return attachPhoneToList(submissions);
};

const updateContactSubmissionStatus = (id, status, isRead) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE contact_submissions SET status = ?, is_read = COALESCE(?, is_read) WHERE id = ?');
  const result = stmt.run(status, isRead, id);
  return result.changes > 0;
};

const addContactSubmissionNote = (id, note) => {
  const db = getDatabase();
  const submission = getContactSubmissionById(id);
  if (!submission) return false;

  const notes = Array.isArray(submission.notes) ? submission.notes : [];
  notes.push(note);

  const stmt = db.prepare('UPDATE contact_submissions SET notes = ? WHERE id = ?');
  const result = stmt.run(stringifyNotes(notes), id);
  return result.changes > 0;
};

const archiveContactSubmission = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE contact_submissions SET archived = 1 WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

const deleteContactSubmission = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM contact_submissions WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

const createAppointmentBooking = ({
  name,
  phone,
  email,
  preferred_date,
  preferred_time,
  college_preference,
  state
}) => {
  const db = getDatabase();
  const phoneData = encryptPhoneData(phone);

  const stmt = db.prepare(`
    INSERT INTO appointment_bookings (
      name,
      phone_encrypted,
      phone_hash,
      phone_last4,
      email,
      preferred_date,
      preferred_time,
      college_preference,
      state
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    phoneData.encrypted,
    phoneData.hash,
    phoneData.last4,
    email,
    preferred_date,
    preferred_time,
    college_preference,
    state
  );

  return getAppointmentBookingById(result.lastInsertRowid);
};

const getAppointmentBookingById = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM appointment_bookings WHERE id = ?');
  const booking = stmt.get(id);
  return attachPhone(booking);
};

const listAppointmentBookings = (filters = {}) => {
  const db = getDatabase();
  const conditions = ['archived = 0'];
  const values = [];

  if (filters.status) {
    conditions.push('status = ?');
    values.push(filters.status);
  }

  if (filters.state) {
    conditions.push('state = ?');
    values.push(filters.state);
  }

  if (filters.phoneHash) {
    conditions.push('phone_hash = ?');
    values.push(filters.phoneHash);
  }

  if (filters.name) {
    conditions.push('LOWER(name) LIKE ?');
    values.push(`%${filters.name.toLowerCase()}%`);
  }

  if (filters.from_date) {
    conditions.push('date(created_at) >= date(?)');
    values.push(filters.from_date);
  }

  if (filters.to_date) {
    conditions.push('date(created_at) <= date(?)');
    values.push(filters.to_date);
  }

  const query = `SELECT * FROM appointment_bookings WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
  const stmt = db.prepare(query);
  const bookings = stmt.all(...values);
  return attachPhoneToList(bookings);
};

const updateAppointmentStatus = (id, status) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE appointment_bookings SET status = ? WHERE id = ?');
  const result = stmt.run(status, id);
  return result.changes > 0;
};

const addAppointmentNote = (id, note) => {
  const db = getDatabase();
  const booking = getAppointmentBookingById(id);
  if (!booking) return false;

  const notes = Array.isArray(booking.notes) ? booking.notes : [];
  notes.push(note);

  const stmt = db.prepare('UPDATE appointment_bookings SET notes = ? WHERE id = ?');
  const result = stmt.run(stringifyNotes(notes), id);
  return result.changes > 0;
};

const archiveAppointment = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE appointment_bookings SET archived = 1 WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

const deleteAppointment = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM appointment_bookings WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

const createNewsletterSubscription = ({ name, phone, email }) => {
  const db = getDatabase();
  const phoneData = phone ? encryptPhoneData(phone) : { encrypted: null, hash: null, last4: null };

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO newsletter_subscriptions (name, phone_encrypted, phone_hash, phone_last4, email)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(name, phoneData.encrypted, phoneData.hash, phoneData.last4, email);

  const selectStmt = db.prepare('SELECT * FROM newsletter_subscriptions WHERE email = ?');
  const subscription = selectStmt.get(email);
  return attachPhone(subscription);
};

const createCollegeInquiry = ({ name, phone, email, course, college_name, state, message }) => {
  const db = getDatabase();
  const phoneData = encryptPhoneData(phone);

  const stmt = db.prepare(`
    INSERT INTO college_inquiries (name, phone_encrypted, phone_hash, phone_last4, email, course, college_name, state, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    phoneData.encrypted,
    phoneData.hash,
    phoneData.last4,
    email,
    course,
    college_name,
    state,
    message
  );

  return getCollegeInquiryById(result.lastInsertRowid);
};

const getCollegeInquiryById = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM college_inquiries WHERE id = ?');
  const inquiry = stmt.get(id);
  return attachPhone(inquiry);
};

const listCollegeInquiries = (filters = {}) => {
  const db = getDatabase();
  const conditions = ['archived = 0'];
  const values = [];

  if (filters.status) {
    conditions.push('status = ?');
    values.push(filters.status);
  }

  if (filters.state) {
    conditions.push('state = ?');
    values.push(filters.state);
  }

  if (filters.phoneHash) {
    conditions.push('phone_hash = ?');
    values.push(filters.phoneHash);
  }

  if (filters.name) {
    conditions.push('LOWER(name) LIKE ?');
    values.push(`%${filters.name.toLowerCase()}%`);
  }

  if (filters.from_date) {
    conditions.push('date(created_at) >= date(?)');
    values.push(filters.from_date);
  }

  if (filters.to_date) {
    conditions.push('date(created_at) <= date(?)');
    values.push(filters.to_date);
  }

  const query = `SELECT * FROM college_inquiries WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
  const stmt = db.prepare(query);
  const inquiries = stmt.all(...values);
  return attachPhoneToList(inquiries);
};

const updateCollegeInquiryStatus = (id, status) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE college_inquiries SET status = ? WHERE id = ?');
  const result = stmt.run(status, id);
  return result.changes > 0;
};

const addCollegeInquiryNote = (id, note) => {
  const db = getDatabase();
  const inquiry = getCollegeInquiryById(id);
  if (!inquiry) return false;

  const notes = Array.isArray(inquiry.notes) ? inquiry.notes : [];
  notes.push(note);

  const stmt = db.prepare('UPDATE college_inquiries SET notes = ? WHERE id = ?');
  const result = stmt.run(stringifyNotes(notes), id);
  return result.changes > 0;
};

const archiveCollegeInquiry = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE college_inquiries SET archived = 1 WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

const deleteCollegeInquiry = (id) => {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM college_inquiries WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};

module.exports = {
  createContactSubmission,
  getContactSubmissionById,
  listContactSubmissions,
  updateContactSubmissionStatus,
  addContactSubmissionNote,
  archiveContactSubmission,
  deleteContactSubmission,
  createAppointmentBooking,
  getAppointmentBookingById,
  listAppointmentBookings,
  updateAppointmentStatus,
  addAppointmentNote,
  archiveAppointment,
  deleteAppointment,
  createNewsletterSubscription,
  createCollegeInquiry,
  getCollegeInquiryById,
  listCollegeInquiries,
  updateCollegeInquiryStatus,
  addCollegeInquiryNote,
  archiveCollegeInquiry,
  deleteCollegeInquiry
};

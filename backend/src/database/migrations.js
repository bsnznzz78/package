const { getDatabase } = require('./index');

const createTables = () => {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone_encrypted TEXT NOT NULL,
      phone_hash TEXT NOT NULL UNIQUE,
      phone_last4 TEXT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('super_admin', 'admin', 'viewer')),
      is_phone_verified INTEGER NOT NULL DEFAULT 0,
      two_factor_enabled INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    );

    CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
    CREATE INDEX IF NOT EXISTS idx_admins_phone_hash ON admins(phone_hash);
    CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      admin_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_password_reset_admin ON password_reset_tokens(admin_id);
    CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);

    CREATE TABLE IF NOT EXISTS otp_codes (
      id TEXT PRIMARY KEY,
      admin_id INTEGER NOT NULL,
      destination_hash TEXT NOT NULL,
      code TEXT NOT NULL,
      purpose TEXT NOT NULL CHECK(purpose IN ('phone_verification', 'two_factor_login')),
      expires_at DATETIME NOT NULL,
      consumed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_otp_admin ON otp_codes(admin_id);
    CREATE INDEX IF NOT EXISTS idx_otp_destination ON otp_codes(destination_hash);

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone_encrypted TEXT NOT NULL,
      phone_hash TEXT NOT NULL,
      phone_last4 TEXT,
      email TEXT NOT NULL,
      message TEXT,
      state TEXT,
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','unread','pending','contacted','completed')),
      notes TEXT DEFAULT '[]',
      is_read INTEGER NOT NULL DEFAULT 0,
      archived INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
    CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_contact_phone_hash ON contact_submissions(phone_hash);

    CREATE TABLE IF NOT EXISTS appointment_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone_encrypted TEXT NOT NULL,
      phone_hash TEXT NOT NULL,
      phone_last4 TEXT,
      email TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      college_preference TEXT,
      state TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','contacted','confirmed','completed','cancelled')),
      notes TEXT DEFAULT '[]',
      archived INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_appointment_status ON appointment_bookings(status);
    CREATE INDEX IF NOT EXISTS idx_appointment_created ON appointment_bookings(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_appointment_phone_hash ON appointment_bookings(phone_hash);

    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone_encrypted TEXT,
      phone_hash TEXT,
      phone_last4 TEXT,
      email TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'subscribed' CHECK(status IN ('subscribed','unsubscribed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
    CREATE INDEX IF NOT EXISTS idx_newsletter_phone_hash ON newsletter_subscriptions(phone_hash);

    CREATE TABLE IF NOT EXISTS college_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone_encrypted TEXT NOT NULL,
      phone_hash TEXT NOT NULL,
      phone_last4 TEXT,
      email TEXT NOT NULL,
      course TEXT,
      college_name TEXT,
      state TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','pending','contacted','completed','closed')),
      notes TEXT DEFAULT '[]',
      archived INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_college_status ON college_inquiries(status);
    CREATE INDEX IF NOT EXISTS idx_college_created ON college_inquiries(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_college_phone_hash ON college_inquiries(phone_hash);

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id INTEGER,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_audit_admin ON audit_logs(admin_id);
    CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS trg_admins_updated
    AFTER UPDATE ON admins
    BEGIN
      UPDATE admins SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_contact_updated
    AFTER UPDATE ON contact_submissions
    BEGIN
      UPDATE contact_submissions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_appointment_updated
    AFTER UPDATE ON appointment_bookings
    BEGIN
      UPDATE appointment_bookings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_newsletter_updated
    AFTER UPDATE ON newsletter_subscriptions
    BEGIN
      UPDATE newsletter_subscriptions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_college_updated
    AFTER UPDATE ON college_inquiries
    BEGIN
      UPDATE college_inquiries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
};

module.exports = { createTables };

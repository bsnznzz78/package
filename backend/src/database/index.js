const Database = require('better-sqlite3');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const dbDir = path.dirname(config.databasePath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

const getDatabase = () => {
  if (!db) {
    db = new Database(config.databasePath, {
      verbose: config.env === 'development' ? console.log : null
    });
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
};

const closeDatabase = () => {
  if (db) {
    db.close();
    db = null;
  }
};

process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

module.exports = {
  getDatabase,
  closeDatabase
};

const path = require('path');
const fs = require('fs');
const { createTables } = require('../database/migrations');
const config = require('../config');
const { getDatabase } = require('../database');

const dbDir = path.dirname(config.databasePath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

createTables();
getDatabase().close();

console.log('✅ Database initialized successfully!');
console.log('📍 Database location:', config.databasePath);

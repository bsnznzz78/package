const crypto = require('crypto');
const config = require('../config');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

const getEncryptionKey = () => {
  let key = config.phone.encryptionKey;
  
  if (!key) {
    console.warn('PHONE_ENCRYPTION_KEY not set. Using fallback key (not secure for production).');
    key = crypto.randomBytes(KEY_LENGTH).toString('base64');
  }
  
  const buffer = Buffer.from(key, 'base64');
  
  if (buffer.length !== KEY_LENGTH) {
    throw new Error(`Encryption key must be exactly ${KEY_LENGTH} bytes when base64 decoded`);
  }
  
  return buffer;
};

const encryptPhone = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(phoneNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

const decryptPhone = (encryptedData) => {
  if (!encryptedData) return null;
  
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error decrypting phone:', error.message);
    return null;
  }
};

const hashPhone = (phoneNumber) => {
  if (!phoneNumber) return null;
  return crypto.createHash('sha256').update(phoneNumber).digest('hex');
};

const getPhoneLast4 = (phoneNumber) => {
  if (!phoneNumber) return null;
  return phoneNumber.slice(-4);
};

const encryptPhoneData = (phoneNumber) => {
  if (!phoneNumber) return { encrypted: null, hash: null, last4: null };
  
  return {
    encrypted: encryptPhone(phoneNumber),
    hash: hashPhone(phoneNumber),
    last4: getPhoneLast4(phoneNumber)
  };
};

module.exports = {
  encryptPhone,
  decryptPhone,
  hashPhone,
  getPhoneLast4,
  encryptPhoneData
};

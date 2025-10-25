const Joi = require('joi');

const phoneSchema = Joi.string()
  .pattern(/^\+?91[-\s]?\d{10}$/)
  .messages({
    'string.pattern.base': 'Phone number must be an Indian number with country code +91 followed by 10 digits'
  });

const normalizeIndianPhone = (phone) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  return `+${digits}`;
};

const validatePhone = (phone) => {
  if (!phone) {
    return { error: 'Phone number is required' };
  }

  const normalized = normalizeIndianPhone(phone);
  const { error } = phoneSchema.validate(normalized);

  if (error) {
    return { error: error.message };
  }

  return { value: normalized };
};

module.exports = {
  validatePhone,
  normalizeIndianPhone
};

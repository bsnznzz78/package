const Joi = require('joi');
const xss = require('xss');

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input.trim());
  }
  return input;
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const schemas = {
  adminRegister: Joi.object({
    full_name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name must be less than 100 characters'
    }),
    phone: Joi.string().required(),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'string.empty': 'Password is required'
    }),
    role: Joi.string().valid('super_admin', 'admin', 'viewer').optional()
  }),

  adminLogin: Joi.object({
    identifier: Joi.string().required().messages({
      'string.empty': 'Email or phone number is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    }),
    remember_me: Joi.boolean().optional()
  }),

  passwordReset: Joi.object({
    identifier: Joi.string().required().messages({
      'string.empty': 'Email or phone number is required'
    })
  }),

  passwordChange: Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
  }),

  contactForm: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters'
    }),
    phone: Joi.string().required(),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address'
    }),
    message: Joi.string().min(10).max(2000).required().messages({
      'string.min': 'Message must be at least 10 characters',
      'string.max': 'Message must be less than 2000 characters'
    }),
    state: Joi.string().max(100).optional().allow('', null)
  }),

  appointmentBooking: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    preferred_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
      'string.pattern.base': 'Date must be in format YYYY-MM-DD'
    }),
    preferred_time: Joi.string().required(),
    college_preference: Joi.string().max(200).optional().allow('', null),
    state: Joi.string().max(100).optional().allow('', null)
  }),

  collegeInquiry: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    course: Joi.string().max(200).optional().allow('', null),
    college_name: Joi.string().max(200).optional().allow('', null),
    state: Joi.string().max(100).optional().allow('', null),
    message: Joi.string().max(2000).optional().allow('', null)
  }),

  newsletterSubscription: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().max(100).optional().allow('', null),
    phone: Joi.string().optional().allow('', null)
  }),

  updateSubmissionStatus: Joi.object({
    status: Joi.string().valid('new', 'unread', 'pending', 'contacted', 'completed', 'confirmed', 'cancelled', 'closed').required()
  }),

  addNote: Joi.object({
    note: Joi.string().min(1).max(1000).required().messages({
      'string.empty': 'Note cannot be empty',
      'string.max': 'Note must be less than 1000 characters'
    })
  })
};

const validate = (schema, data) => {
  const sanitized = sanitizeObject(data);
  const result = schema.validate(sanitized, { abortEarly: false });

  if (result.error) {
    const errors = result.error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { error: errors, value: null };
  }

  return { error: null, value: result.value };
};

module.exports = {
  schemas,
  validate,
  sanitizeInput,
  sanitizeObject
};

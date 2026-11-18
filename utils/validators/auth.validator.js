const Joi = require('joi');
const ApiError = require('../../utils/ApiError');

const email = Joi.string().trim().lowercase().email().required();
// bcrypt only uses the first 72 bytes, so longer passwords are rejected
const newPassword = Joi.string().min(8).max(72).required();

// Shared by patient and doctor registration. The role is fixed by the route.
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email,
  password: newPassword,
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({ 'string.pattern.base': 'phone must be 7-15 digits, optionally starting with +' })
});

const loginSchema = Joi.object({
  email,
  password: Joi.string().required()
});

const twoFactorSchema = Joi.object({
  token: Joi.string().trim().pattern(/^\d{6}$/).required().messages({
    'string.pattern.base': 'token must be a 6-digit code'
  })
});

const refreshSchema = Joi.object({
  refresh_token: Joi.string()
});

const forgotPasswordSchema = Joi.object({
  email
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().hex().length(64).required(),
  new_password: newPassword
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: newPassword
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().trim().hex().length(64).required()
});

// Validates req.body, replaces it with the cleaned value, and drops unknown fields
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body || {}, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const message = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
    return next(new ApiError(message, 400));
  }

  req.body = value;
  return next();
};

module.exports = {
  registerSchema,
  loginSchema,
  twoFactorSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  validate
};

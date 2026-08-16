const { body, validationResult } = require('express-validator');

// Reusable password validation rule
const passwordRule = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character');

// Same rules for new password (update password)
const newPasswordRule = body('newPassword')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character');

const validateRegister = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').optional().isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  passwordRule,
  handleValidationErrors
];

const validateLogin = [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateUpdatePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  newPasswordRule,
  handleValidationErrors
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return field-level errors as requested
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdatePassword
};

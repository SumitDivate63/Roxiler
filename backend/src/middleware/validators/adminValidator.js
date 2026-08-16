const { body, validationResult, query } = require('express-validator');

// Reusable password validation rule
const passwordRule = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character');

const validateCreateUser = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').optional({ checkFalsy: true }).isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('role').isIn(['user', 'admin', 'store_owner']).withMessage('Invalid role specified'),
  passwordRule,
  handleValidationErrors
];

const validateCreateStore = [
  body('name').notEmpty().withMessage('Store name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').optional({ checkFalsy: true }).isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('ownerId').optional({ nullable: true }).isInt().withMessage('ownerId must be an integer'),
  handleValidationErrors
];

const validateListQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('sort').optional().isIn(['asc', 'desc']).withMessage('sort must be asc or desc'),
  handleValidationErrors
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

module.exports = {
  validateCreateUser,
  validateCreateStore,
  validateListQuery
};

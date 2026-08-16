const { body, query, validationResult } = require('express-validator');

const validateListQuery = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('sort').optional().isIn(['asc', 'desc']).withMessage('sort must be asc or desc'),
  handleValidationErrors
];

const validateRating = [
  body('storeId').notEmpty().withMessage('storeId is required').isInt().withMessage('storeId must be an integer').toInt(),
  body('value')
    .notEmpty().withMessage('value is required')
    .isInt({ min: 1, max: 5 }).withMessage('value must be an integer between 1 and 5')
    .toInt(),
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
  validateListQuery,
  validateRating
};

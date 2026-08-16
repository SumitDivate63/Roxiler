const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateRating } = require('../middleware/validators/userValidator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Normal User: Submit or update rating
router.post('/', authenticate, authorize('user'), validateRating, userController.submitRating);

module.exports = router;

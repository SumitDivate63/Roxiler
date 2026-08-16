const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateListQuery, validateRating } = require('../middleware/validators/userValidator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Require authentication and 'user' role for all endpoints
router.use(authenticate, authorize('user'));

router.get('/stores', validateListQuery, userController.listStores);
router.post('/ratings', validateRating, userController.submitRating);

module.exports = router;

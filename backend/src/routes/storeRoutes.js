const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { validateListQuery } = require('../middleware/validators/userValidator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Normal User: View stores
router.get('/', authenticate, authorize('user'), validateListQuery, userController.listStores);

module.exports = router;

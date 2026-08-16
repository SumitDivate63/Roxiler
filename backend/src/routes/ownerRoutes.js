const express = require('express');
const router = express.Router();

const ownerController = require('../controllers/ownerController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Require authentication and 'store_owner' role for all endpoints
router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', ownerController.dashboard);

module.exports = router;

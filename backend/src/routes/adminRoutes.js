const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { validateCreateUser, validateCreateStore, validateListQuery } = require('../middleware/validators/adminValidator');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Require authentication and admin role for all routes in this file
router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.dashboard);
router.post('/users', validateCreateUser, adminController.createUser);
router.post('/stores', validateCreateStore, adminController.createStore);
router.get('/stores', validateListQuery, adminController.listStores);
router.get('/users', validateListQuery, adminController.listUsers);
router.get('/users/:id', adminController.getUser);

module.exports = router;

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validateUpdatePassword } = require('../middleware/validators/authValidator');
const authenticate = require('../middleware/authenticate');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.put('/update-password', authenticate, validateUpdatePassword, authController.updatePassword);

module.exports = router;

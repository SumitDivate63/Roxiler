const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    // Passes to the centralized error handler
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.updateUserPassword(req.user.id, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  updatePassword
};

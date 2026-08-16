const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function registerUser({ name, email, address, password }) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 400; // Important for centralized error handler
    throw error;
  }

  // Role is strictly enforced as 'user' here, ignoring any role sent by the client
  const user = await User.create({
    name,
    email,
    address,
    password,
    role: 'user'
  });

  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });
  
  // Use generic invalid message for security (don't reveal if email exists)
  const genericError = new Error('Invalid email or password');
  genericError.statusCode = 401;

  if (!user) {
    throw genericError;
  }

  const isMatch = await user.validPassword(password);
  if (!isMatch) {
    throw genericError;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

async function updateUserPassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.validPassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Invalid current password');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();
}

module.exports = {
  registerUser,
  loginUser,
  updateUserPassword
};

const express = require('express');
const router = express.Router();

const { getHealthStatus } = require('../controllers/healthController');

const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const storeRoutes = require('./storeRoutes');
const ratingRoutes = require('./ratingRoutes');
const ownerRoutes = require('./ownerRoutes');

// Health endpoint
router.get('/health', getHealthStatus);

// API Routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/owner', ownerRoutes);

module.exports = router;

const express = require('express');
const cors = require('cors');

const requestLogger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routes
app.use('/api', apiRoutes);

// Unknown routes (404)
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;

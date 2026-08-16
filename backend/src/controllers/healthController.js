const sequelize = require('../config/database');

async function getHealthStatus(req, res, next) {
  try {
    // Verify database connectivity using the existing Sequelize instance
    await sequelize.authenticate();
    
    return res.status(200).json({
      success: true,
      message: 'API is healthy',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check database error:', error);
    return res.status(503).json({
      success: false,
      message: 'API is healthy, but database is disconnected',
      database: 'disconnected'
    });
  }
}

module.exports = {
  getHealthStatus
};

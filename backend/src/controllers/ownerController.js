const ownerService = require('../services/ownerService');

async function dashboard(req, res, next) {
  try {
    const ownerId = req.user.id; // Securely identifies owner
    const dashboardData = await ownerService.getDashboard(ownerId);

    // If no store is assigned, add a custom message gracefully
    if (!dashboardData.store) {
      return res.status(200).json({
        success: true,
        data: dashboardData,
        message: 'No store is assigned to this account'
      });
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  dashboard
};

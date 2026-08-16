const userService = require('../services/userService');

async function listStores(req, res, next) {
  try {
    const result = await userService.listStores(req.query, req.user.id);
    res.status(200).json({
      success: true,
      data: result.stores,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

async function submitRating(req, res, next) {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id; // Strictly from token

    const result = await userService.submitRating(userId, storeId, value);
    
    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listStores,
  submitRating
};

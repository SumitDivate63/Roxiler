const adminService = require('../services/adminService');

async function dashboard(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

async function createStore(req, res, next) {
  try {
    const store = await adminService.createStore(req.body);
    res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
}

async function listStores(req, res, next) {
  try {
    const result = await adminService.listStores(req.query);
    res.status(200).json({
      success: true,
      data: result.stores,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const result = await adminService.listUsers(req.query);
    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await adminService.getUserDetails(req.params.id);
    
    // Format response slightly: If not a store_owner, we shouldn't have a store object
    let responseData = user.toJSON();
    if (responseData.role !== 'store_owner' || !responseData.store) {
      responseData.store = null;
    }
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  dashboard,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUser
};

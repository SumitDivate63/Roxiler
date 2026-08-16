const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

async function getDashboardStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count()
  ]);

  return {
    totalUsers,
    totalStores,
    totalRatings
  };
}

async function createUser(data) {
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password, // bcrypt hashing is handled by User model hook
    address: data.address,
    role: data.role // Admin is allowed to specify the role
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role
  };
}

async function createStore(data) {
  if (data.ownerId) {
    const owner = await User.findByPk(data.ownerId);
    if (!owner) {
      const error = new Error('Owner user does not exist');
      error.statusCode = 404;
      throw error;
    }
    if (owner.role !== 'store_owner') {
      const error = new Error('Assigned user must have the store_owner role');
      error.statusCode = 403; // Using 403 or 400
      throw error;
    }
  }

  const store = await Store.create({
    name: data.name,
    email: data.email,
    address: data.address,
    ownerId: data.ownerId || null
  });

  return store;
}

async function listStores(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  // Whitelisted sort fields
  const allowedSortFields = ['name', 'email', 'address', 'averageRating'];
  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'name';
  const sortOrder = (query.sort === 'desc') ? 'DESC' : 'ASC';

  const where = {};
  if (query.name) where.name = { [Op.like]: `%${query.name}%` };
  if (query.email) where.email = { [Op.like]: `%${query.email}%` };
  if (query.address) where.address = { [Op.like]: `%${query.address}%` };

  // Determine order clause: averageRating uses the alias, others use standard column names
  const orderClause = (sortBy === 'averageRating') 
    ? [[sequelize.col('averageRating'), sortOrder]]
    : [[sortBy, sortOrder]];

  const { count, rows } = await Store.findAndCountAll({
    where,
    attributes: {
      include: [
        [
          sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('ratings.rating')), 0),
          'averageRating'
        ]
      ]
    },
    include: [{
      model: Rating,
      as: 'ratings',
      attributes: [],
      required: false
    }],
    group: ['Store.id'],
    subQuery: false, // Prevents LIMIT from being applied before GROUP BY when joining
    order: orderClause,
    limit,
    offset
  });

  // Since we use GROUP BY, count is returned as an array of objects. We need its length for total count.
  const total = Array.isArray(count) ? count.length : count;
  const totalPages = Math.ceil(total / limit);

  return {
    stores: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

async function listUsers(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const allowedSortFields = ['name', 'email', 'address', 'role'];
  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'name';
  const sortOrder = (query.sort === 'desc') ? 'DESC' : 'ASC';

  const where = {};
  if (query.name) where.name = { [Op.like]: `%${query.name}%` };
  if (query.email) where.email = { [Op.like]: `%${query.email}%` };
  if (query.address) where.address = { [Op.like]: `%${query.address}%` };
  if (query.role) {
    if (['admin', 'user', 'store_owner'].includes(query.role)) {
      where.role = query.role;
    }
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [[sortBy, sortOrder]],
    limit,
    offset
  });

  return {
    users: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
}

async function getUserDetails(id) {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: Store,
      as: 'store',
      attributes: {
        include: [
          [
            sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('store->ratings.rating')), 0),
            'averageRating'
          ]
        ]
      },
      include: [{
        model: Rating,
        as: 'ratings',
        attributes: []
      }],
      required: false
    }],
    group: ['User.id', 'store.id'] // Grouping needed for aggregation
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  listStores,
  listUsers,
  getUserDetails
};

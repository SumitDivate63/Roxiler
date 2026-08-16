const { Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

async function listStores(query, userId) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  // Search logic (name OR address)
  const where = {};
  if (query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { address: { [Op.like]: `%${query.search}%` } }
    ];
  }

  // Sorting logic
  const allowedSortFields = ['name', 'address', 'averageRating'];
  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'name';
  const sortOrder = (query.sort === 'desc' || query.order === 'desc') ? 'DESC' : 'ASC'; // Some API tests use 'order' param

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
    subQuery: false,
    order: orderClause,
    limit,
    offset
  });

  const total = Array.isArray(count) ? count.length : count;
  const totalPages = Math.ceil(total / limit);

  // Map to JSON and fetch the current user's ratings for these specific stores efficiently
  const stores = rows.map(row => {
    const store = row.toJSON();
    // Format averageRating to a standard Number to match test requirements
    store.averageRating = parseFloat(store.averageRating);
    store.userRating = null; // default
    return store;
  });

  if (stores.length > 0) {
    const storeIds = stores.map(s => s.id);
    const userRatings = await Rating.findAll({
      where: {
        userId,
        storeId: storeIds
      },
      attributes: ['storeId', 'rating']
    });

    const ratingMap = {};
    for (const r of userRatings) {
      ratingMap[r.storeId] = r.rating;
    }

    for (const store of stores) {
      if (ratingMap[store.id] !== undefined) {
        store.userRating = ratingMap[store.id];
      }
    }
  }

  return {
    stores,
    pagination: { page, limit, total, totalPages }
  };
}

async function submitRating(userId, storeId, value) {
  // Check if store exists
  const store = await Store.findByPk(storeId);
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  // UPSERT behavior preserving unique constraint (userId, storeId)
  let ratingRecord = await Rating.findOne({ where: { userId, storeId } });
  
  if (ratingRecord) {
    // Update existing
    ratingRecord.rating = value;
    await ratingRecord.save();
  } else {
    // Create new
    ratingRecord = await Rating.create({
      userId,
      storeId,
      rating: value
    });
  }

  // Recalculate average directly from DB as source of truth
  const result = await Rating.findOne({
    where: { storeId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
    ],
    raw: true
  });

  // Ensure parsing from Decimal to Float
  const averageRating = result && result.averageRating !== null 
    ? parseFloat(result.averageRating) 
    : 0;

  return {
    rating: {
      id: ratingRecord.id,
      storeId: ratingRecord.storeId,
      value: ratingRecord.rating // Map back to requested 'value' key
    },
    averageRating
  };
}

module.exports = {
  listStores,
  submitRating
};

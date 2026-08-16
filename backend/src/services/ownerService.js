const { Store, Rating, User, sequelize } = require('../models');

async function getDashboard(ownerId) {
  // Find the store assigned to this owner
  const storeData = await Store.findOne({
    where: { ownerId },
    attributes: [
      'id', 'name',
      [
        sequelize.fn('COALESCE', 
          sequelize.literal(`(SELECT AVG(rating) FROM Ratings WHERE storeId = Store.id)`), 
        0),
        'averageRating'
      ]
    ]
  });

  if (!storeData) {
    return {
      store: null,
      raters: []
    };
  }

  // Parse average rating to float
  const storeObj = storeData.toJSON();
  storeObj.averageRating = parseFloat(storeObj.averageRating);

  // Fetch the raters for this store
  const ratingRecords = await Rating.findAll({
    where: { storeId: storeObj.id },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'email'] // Protect password, address, etc.
    }],
    order: [['createdAt', 'DESC']]
  });

  // Map to the requested output structure
  const raters = ratingRecords.map(r => ({
    userId: r.user.id,
    name: r.user.name,
    email: r.user.email,
    rating: r.rating,
    ratedAt: r.createdAt
  }));

  return {
    store: storeObj,
    raters
  };
}

module.exports = {
  getDashboard
};

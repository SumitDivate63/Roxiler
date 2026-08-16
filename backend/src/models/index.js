const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Define Relationships
// User has many Ratings
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store has many Ratings
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// User has one Store (as owner)
User.hasOne(Store, { foreignKey: 'ownerId', as: 'store' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating
};

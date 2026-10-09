import sequelize from '../config/database.js';
import User from './User.js';
import Store from './Store.js';
import Rating from './Rating.js';

// User <-> Rating
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store <-> Rating
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Store <-> User (Store Owner)
User.hasOne(Store, { foreignKey: 'ownerId', as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

export {
  sequelize,
  User,
  Store,
  Rating,
};

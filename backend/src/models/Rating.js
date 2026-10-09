import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Rating must be at least 1',
      },
      max: {
        args: [5],
        msg: 'Rating cannot exceed 5',
      },
    },
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'storeId'],
    },
  ],
});

export default Rating;

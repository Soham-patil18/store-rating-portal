import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Store name is required',
      },
      len: {
        args: [1, 60],
        msg: 'Store name cannot exceed 60 characters',
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address',
      },
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: {
        args: [1, 400],
        msg: 'Address cannot exceed 400 characters',
      },
    },
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Store;

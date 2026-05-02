const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Resource = require('./resource.model');

const Favorite = sequelize.define('Favorite', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id_user',
    },
  },
  id_resource: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'resources',
      key: 'id_resource',
    },
  },
}, {
  tableName: 'favorites',
  underscored: true,
  timestamps: false,
});

// Relaciones N:M
User.belongsToMany(Resource, { through: Favorite, foreignKey: 'id_user' });
Resource.belongsToMany(User, { through: Favorite, foreignKey: 'id_resource' });

module.exports = Favorite;

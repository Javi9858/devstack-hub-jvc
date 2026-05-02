const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Resource = sequelize.define('Resource', {
  id_resource: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  url_enlace: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  dificultad: {
    type: DataTypes.STRING(50),
    validate: {
      isIn: [['Principiante', 'Intermedio', 'Avanzado']],
    },
  },
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id_user',
    },
  },
}, {
  tableName: 'resources',
  underscored: true,
  timestamps: true,
  updatedAt: false,
});

// Relación
User.hasMany(Resource, { foreignKey: 'id_user' });
Resource.belongsTo(User, { foreignKey: 'id_user' });

module.exports = Resource;

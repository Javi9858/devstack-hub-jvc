const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Resource = require('./resource.model');

const Comment = sequelize.define('Comment', {
  id_comment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  valoracion: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id_user',
    },
  },
  id_resource: {
    type: DataTypes.INTEGER,
    references: {
      model: 'resources',
      key: 'id_resource',
    },
  },
}, {
  tableName: 'comments',
  underscored: true,
  timestamps: false, // El SQL usa 'fecha' en lugar de timestamps de Sequelize
});

// Relaciones
User.hasMany(Comment, { foreignKey: 'id_user' });
Comment.belongsTo(User, { foreignKey: 'id_user' });
Resource.hasMany(Comment, { foreignKey: 'id_resource' });
Comment.belongsTo(Resource, { foreignKey: 'id_resource' });

module.exports = Comment;

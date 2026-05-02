const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', {
  id_tag: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'tags',
  underscored: true,
  timestamps: false,
});

module.exports = Tag;

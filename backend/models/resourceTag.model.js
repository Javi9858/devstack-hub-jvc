const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Resource = require('./resource.model');
const Tag = require('./tag.model');

const ResourceTag = sequelize.define('ResourceTag', {
  id_resource: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'resources',
      key: 'id_resource',
    },
  },
  id_tag: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'tags',
      key: 'id_tag',
    },
  },
}, {
  tableName: 'resource_tags',
  underscored: true,
  timestamps: false,
});

// Relaciones N:M
Resource.belongsToMany(Tag, { through: ResourceTag, foreignKey: 'id_resource' });
Tag.belongsToMany(Resource, { through: ResourceTag, foreignKey: 'id_tag' });

module.exports = ResourceTag;

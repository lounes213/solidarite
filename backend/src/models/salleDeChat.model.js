const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const SalleDeChat = sequelize.define('SalleDeChat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('individuel', 'groupe'),
    allowNull: false,
    defaultValue: 'individuel',
  },
  dernierMessage: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true
});

module.exports = SalleDeChat;
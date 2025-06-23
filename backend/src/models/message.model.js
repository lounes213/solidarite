const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  idSalle: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'SalleDeChats',
      key: 'id'
    }
  },
  idEmetteur: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dateEnvoi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define associations
Message.associate = (models) => {
  // A message belongs to a chat room
  Message.belongsTo(models.SalleDeChat, {
    foreignKey: 'idSalle',
    as: 'salle'
  });

  // A message belongs to a sender (user)
  Message.belongsTo(models.Utilisateur, {
    foreignKey: 'idEmetteur',
    as: 'emetteur'
  });
};

module.exports = Message;
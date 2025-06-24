const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  idUtilisateur: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('reservation', 'confirmation', 'annulation', 'avis', 'message', 'systeme'),
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  donnees: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Données supplémentaires liées à la notification'
  },
  lue: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  dateLecture: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: (notification) => {
      if (notification.changed('lue') && notification.lue) {
        notification.dateLecture = new Date();
      }
    }
  }
});

// Define associations
Notification.associate = (models) => {
  // A notification belongs to a user
  Notification.belongsTo(models.Utilisateur, {
    foreignKey: 'idUtilisateur',
    as: 'utilisateur'
  });
};

module.exports = Notification;
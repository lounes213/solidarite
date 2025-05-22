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
    type: DataTypes.ENUM(
      'message',
      'reservation',
      'avis',
      'atelier',
      'badge',
      'system'
    ),
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  idCible: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID de l\'élément concerné (message, réservation, etc.)'
  },
  typeCible: {
    type: DataTypes.ENUM('message', 'reservation', 'avis', 'atelier', 'badge'),
    allowNull: true
  },
  estLu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dateLecture: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
Notification.associate = (models) => {
  Notification.belongsTo(models.Utilisateur, {
    foreignKey: 'idUtilisateur',
    as: 'utilisateur'
  });
};

module.exports = Notification; 
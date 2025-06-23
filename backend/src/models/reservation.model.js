const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  idOffre: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Offres',
      key: 'id'
    }
  },
  idEtudiant: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  prix_convenu: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  timestamps: true
});

// Define associations
Reservation.associate = (models) => {
  // A reservation belongs to an offer
  Reservation.belongsTo(models.Offre, {
    foreignKey: 'idOffre',
    as: 'offre'
  });

  // A reservation belongs to a student (user)
  Reservation.belongsTo(models.Utilisateur, {
    foreignKey: 'idEtudiant',
    as: 'etudiant'
  });

  // A reservation can have many reviews
  Reservation.hasMany(models.Avis, {
    foreignKey: 'reservationId',
    as: 'avis'
  });
};

module.exports = Reservation;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Avis = sequelize.define('Avis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  idReservation: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Reservations',
      key: 'id'
    }
  },
  auteurId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  cibleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  note_globale: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  note_repas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  note_ponctualite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  note_convivialite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
Avis.associate = (models) => {
  // A review belongs to a reservation
  Avis.belongsTo(models.Reservation, {
    foreignKey: 'idReservation',
    as: 'reservation'
  });

  // A review belongs to an author (user who writes the review)
  Avis.belongsTo(models.Utilisateur, {
    foreignKey: 'auteurId',
    as: 'auteur'
  });

  // A review belongs to a target (user who receives the review)
  Avis.belongsTo(models.Utilisateur, {
    foreignKey: 'cibleId',
    as: 'cible'
  });
};

module.exports = Avis;
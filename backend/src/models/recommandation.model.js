const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PreferenceUtilisateur = sequelize.define('PreferenceUtilisateur', {
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
  typeCuisine: {
    type: DataTypes.STRING,
    allowNull: false
  },
  niveau: {
    type: DataTypes.ENUM('debutant', 'intermediaire', 'avance'),
    allowNull: false
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  localisation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Préférences spécifiques (allergies, régimes, etc.)'
  }
}, {
  timestamps: true
});

const HistoriqueUtilisateur = sequelize.define('HistoriqueUtilisateur', {
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
  typeAction: {
    type: DataTypes.ENUM('consultation', 'reservation', 'participation', 'evaluation'),
    allowNull: false
  },
  idCible: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID de l\'offre, atelier ou utilisateur concerné'
  },
  typeCible: {
    type: DataTypes.ENUM('offre', 'atelier', 'utilisateur'),
    allowNull: false
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

// Define associations
PreferenceUtilisateur.associate = (models) => {
  PreferenceUtilisateur.belongsTo(models.Utilisateur, {
    foreignKey: 'idUtilisateur',
    as: 'utilisateur'
  });
};

HistoriqueUtilisateur.associate = (models) => {
  HistoriqueUtilisateur.belongsTo(models.Utilisateur, {
    foreignKey: 'idUtilisateur',
    as: 'utilisateur'
  });
};

module.exports = {
  PreferenceUtilisateur,
  HistoriqueUtilisateur
}; 
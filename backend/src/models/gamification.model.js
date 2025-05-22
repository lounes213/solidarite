const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL de l\'icône du badge'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  categorie: {
    type: DataTypes.ENUM('cuisine', 'social', 'participation', 'special'),
    allowNull: false
  }
}, {
  timestamps: true
});

const PointsUtilisateur = sequelize.define('PointsUtilisateur', {
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
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  niveau: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true
});

// Define associations
Badge.associate = (models) => {
  // Un badge peut être attribué à plusieurs utilisateurs
  Badge.belongsToMany(models.Utilisateur, {
    through: 'BadgesUtilisateurs',
    foreignKey: 'idBadge',
    as: 'utilisateurs'
  });
};

PointsUtilisateur.associate = (models) => {
  // Les points appartiennent à un utilisateur
  PointsUtilisateur.belongsTo(models.Utilisateur, {
    foreignKey: 'idUtilisateur',
    as: 'utilisateur'
  });
};

module.exports = {
  Badge,
  PointsUtilisateur
}; 
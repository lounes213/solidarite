const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Atelier = sequelize.define('Atelier', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  idHote: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dateDebut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dateFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  capaciteMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  localisation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  niveau: {
    type: DataTypes.ENUM('debutant', 'intermediaire', 'avance'),
    allowNull: false
  },
  typeCuisine: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Liste des ingrédients nécessaires'
  },
  materiel: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Liste du matériel nécessaire'
  },
  photos: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URLs des photos séparées par des virgules',
    get() {
      const photosString = this.getDataValue('photos');
      return photosString ? photosString.split(',') : [];
    },
    set(val) {
      if (Array.isArray(val)) {
        this.setDataValue('photos', val.join(','));
      } else {
        this.setDataValue('photos', val);
      }
    }
  },
  statut: {
    type: DataTypes.ENUM('planifie', 'en_cours', 'termine', 'annule'),
    defaultValue: 'planifie',
    allowNull: false
  }
}, {
  timestamps: true
});

// Define associations
Atelier.associate = (models) => {
  // Un atelier appartient à un hôte
  Atelier.belongsTo(models.Utilisateur, {
    foreignKey: 'idHote',
    as: 'hote'
  });

  // Un atelier peut avoir plusieurs participants
  Atelier.belongsToMany(models.Utilisateur, {
    through: 'ParticipantsAtelier',
    foreignKey: 'idAtelier',
    as: 'participants'
  });
};

module.exports = Atelier; 
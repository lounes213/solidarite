const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Offre = sequelize.define('Offre', {
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
  type: {
    type: DataTypes.ENUM('invitation', 'panier'),
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prix_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  prix_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  prix_fixe: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  prix_defini_par_app: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  localisation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coordonneesGPS: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Format: "latitude,longitude"',
  },
  disponible_depuis: {
    type: DataTypes.DATE,
    allowNull: false
  },
  date_expiration: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date limite de validité de l\'offre',
  },
  capacite_max: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Nombre maximum de personnes pouvant accepter l\'offre',
  },
  est_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Indique si l\'offre est toujours active',
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
    },
  },
}, {
  timestamps: true
});

module.exports = Offre;
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Offre extends Model {
    /**
     * Méthode pour définir les associations avec d'autres modèles
     * @param {Object} models - Les modèles importés
     */
    static associate(models) {
      // Une offre appartient à un utilisateur (hôte)
      Offre.belongsTo(models.Utilisateur, {
        foreignKey: 'idHote',
        as: 'hote',
      });

      // Une offre peut avoir plusieurs réservations
      Offre.hasMany(models.Reservation, {
        foreignKey: 'idOffre',
        as: 'reservations',
      });
    }
  }

  Offre.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      idHote: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'utilisateurs',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('invitation', 'panier'),
        allowNull: false,
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prix_min: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      prix_max: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      prix_fixe: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      prix_defini_par_app: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      localisation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coordonneesGPS: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Format: "latitude,longitude"',
      },
      disponible_depuis: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // Champs supplémentaires utiles
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
    },
    {
      sequelize,
      modelName: 'Offre',
      tableName: 'offres',
    }
  );

  return Offre;
};
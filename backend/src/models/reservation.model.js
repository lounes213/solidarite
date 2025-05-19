const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Méthode pour définir les associations avec d'autres modèles
     * @param {Object} models - Les modèles importés
     */
    static associate(models) {
      // Une réservation appartient à un utilisateur (étudiant)
      Reservation.belongsTo(models.Utilisateur, {
        foreignKey: 'idEtudiant',
        as: 'etudiant',
      });

      // Une réservation appartient à une offre
      Reservation.belongsTo(models.Offre, {
        foreignKey: 'idOffre',
        as: 'offre',
      });
    }
  }

  Reservation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      idEtudiant: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'utilisateurs',
          key: 'id',
        },
      },
      idOffre: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'offres',
          key: 'id',
        },
      },
      statut: {
        type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee', 'terminee'),
        allowNull: false,
        defaultValue: 'en_attente',
      },
      date_reservation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      date_debut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_fin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nombre_personnes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      prix_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      commentaire: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Reservation',
      tableName: 'reservations',
    }
  );

  return Reservation;
};
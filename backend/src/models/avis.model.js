const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Avis extends Model {
    /**
     * Méthode pour définir les associations avec d'autres modèles
     * @param {Object} models - Les modèles importés
     */
    static associate(models) {
      // Un avis est écrit par un utilisateur
      Avis.belongsTo(models.Utilisateur, {
        foreignKey: 'auteurId',
        as: 'auteur',
      });

      // Un avis est destiné à un utilisateur
      Avis.belongsTo(models.Utilisateur, {
        foreignKey: 'cibleId',
        as: 'cible',
      });
    }
  }

  Avis.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      auteurId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'utilisateurs',
          key: 'id',
        },
      },
      cibleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'utilisateurs',
          key: 'id',
        },
      },
      note: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      commentaire: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Avis',
      tableName: 'avis',
    }
  );

  return Avis;
};
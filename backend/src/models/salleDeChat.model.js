const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class SalleDeChat extends Model {
    /**
     * Méthode pour définir les associations avec d'autres modèles
     * @param {Object} models - Les modèles importés
     */
    static associate(models) {
      // Une salle de chat peut avoir plusieurs participants
      SalleDeChat.belongsToMany(models.Utilisateur, {
        through: 'ParticipantsChat',
        foreignKey: 'idSalleDeChat',
        as: 'participants',
      });

      // Une salle de chat peut contenir plusieurs messages
      SalleDeChat.hasMany(models.Message, {
        foreignKey: 'idSalleDeChat',
        as: 'messages',
      });
    }
  }

  SalleDeChat.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('individuel', 'groupe'),
        allowNull: false,
        defaultValue: 'individuel',
      },
      dernierMessage: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SalleDeChat',
      tableName: 'salles_de_chat',
    }
  );

  return SalleDeChat;
};
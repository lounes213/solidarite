const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Méthode pour définir les associations avec d'autres modèles
     * @param {Object} models - Les modèles importés
     */
    static associate(models) {
      // Un message appartient à un utilisateur (émetteur)
      Message.belongsTo(models.Utilisateur, {
        foreignKey: 'idEmetteur',
        as: 'emetteur',
      });

      // Un message appartient à une salle de chat
      Message.belongsTo(models.SalleDeChat, {
        foreignKey: 'idSalleDeChat',
        as: 'salleDeChat',
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      idEmetteur: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'utilisateurs',
          key: 'id',
        },
      },
      idSalleDeChat: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'salles_de_chat',
          key: 'id',
        },
      },
      contenu: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
    }
  );

  return Message;
};
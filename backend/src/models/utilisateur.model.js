
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Méthode pour définir les associations avec d'autres modèles
     * @param {Object} models - Les modèles importés
     */
    static associate(models) {
      // Un utilisateur peut proposer plusieurs offres (en tant qu'hôte)
      Utilisateur.hasMany(models.Offre, {
        foreignKey: 'idHote',
        as: 'offres',
      });

      // Un utilisateur peut effectuer plusieurs réservations (en tant qu'étudiant)
      Utilisateur.hasMany(models.Reservation, {
        foreignKey: 'idEtudiant',
        as: 'reservations',
      });

      // Un utilisateur peut écrire plusieurs avis
      Utilisateur.hasMany(models.Avis, {
        foreignKey: 'auteurId',
        as: 'avisEcrits',
      });

      // Un utilisateur peut recevoir plusieurs avis
      Utilisateur.hasMany(models.Avis, {
        foreignKey: 'cibleId',
        as: 'avisRecus',
      });

      // Un utilisateur peut participer à plusieurs salles de chat
      Utilisateur.belongsToMany(models.SalleDeChat, {
        through: 'ParticipantsChat',
        foreignKey: 'idUtilisateur',
        as: 'sallesDeChat',
      });

      // Un utilisateur peut envoyer plusieurs messages
      Utilisateur.hasMany(models.Message, {
        foreignKey: 'idEmetteur',
        as: 'messages',
      });
    }

    /**
     * Vérifie si le mot de passe fourni correspond au mot de passe hashé de l'utilisateur
     * @param {string} motDePasse - Mot de passe non hashé à vérifier
     * @returns {Promise<boolean>} - True si le mot de passe correspond, false sinon
     */
    async verifierMotDePasse(motDePasse) {
      return await bcrypt.compare(motDePasse, this.motDePasse);
    }

    /**
     * Renvoie une version "sécurisée" de l'utilisateur (sans mot de passe)
     * @returns {Object} - Utilisateur sans le mot de passe
     */
    toSafeJSON() {
      const utilisateur = { ...this.get() };
      delete utilisateur.motDePasse;
      return utilisateur;
    }
  }

  Utilisateur.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "L'email doit être une adresse email valide",
          },
        },
      },
      motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('etudiant', 'hote'),
        allowNull: false,
      },
      // Champs supplémentaires utiles
      adresse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ville: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      codePostal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      coordonneesGPS: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Format: "latitude,longitude"',
      },
      photoProfil: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL de la photo de profil',
      },
      biographie: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estVerifie: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indique si le compte a été vérifié',
      },
    },
    {
      sequelize,
      modelName: 'Utilisateur',
      tableName: 'utilisateurs',
      hooks: {
        // Hash du mot de passe avant la création ou la mise à jour
        beforeCreate: async (utilisateur) => {
          if (utilisateur.motDePasse) {
            const salt = await bcrypt.genSalt(10);
            utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, salt);
          }
        },
        beforeUpdate: async (utilisateur) => {
          if (utilisateur.changed('motDePasse')) {
            const salt = await bcrypt.genSalt(10);
            utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, salt);
          }
        },
      },
    }
  );

  return Utilisateur;
};
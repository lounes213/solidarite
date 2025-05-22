const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const Utilisateur = sequelize.define('Utilisateur', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('etudiant', 'hote'),
    allowNull: false
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
}, {
  timestamps: true,
  hooks: {
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
  }
});

// Define associations
Utilisateur.associate = (models) => {
  // A user can have many offers (as a host)
  Utilisateur.hasMany(models.Offre, {
    foreignKey: 'idHote',
    as: 'offres'
  });

  // A user can have many reservations (as a student)
  Utilisateur.hasMany(models.Reservation, {
    foreignKey: 'idEtudiant',
    as: 'reservations'
  });

  // A user can write many reviews
  Utilisateur.hasMany(models.Avis, {
    foreignKey: 'auteurId',
    as: 'avisEcrits'
  });

  // A user can receive many reviews
  Utilisateur.hasMany(models.Avis, {
    foreignKey: 'cibleId',
    as: 'avisRecus'
  });

  // A user can participate in many chat rooms
  Utilisateur.belongsToMany(models.SalleDeChat, {
    through: 'ParticipantsChat',
    foreignKey: 'idUtilisateur',
    as: 'sallesDeChat'
  });

  // A user can send many messages
  Utilisateur.hasMany(models.Message, {
    foreignKey: 'idEmetteur',
    as: 'messages'
  });
};

module.exports = Utilisateur;
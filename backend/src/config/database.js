require('dotenv').config();

// Configuration pour Sequelize
const databaseConfig = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'application_solidaire',
    dialect: process.env.DB_DIALECT || 'mariadb',
    logging: console.log,
    dialectOptions: {
      timezone: 'local',
    },
    define: {
      timestamps: true, // Ajoute automatiquement createdAt et updatedAt
      underscored: true, // Utilise des underscores plutôt que du camelCase pour les noms de colonnes
    },
    pool: {
      max: 5, // Nombre maximum de connexions dans le pool
      min: 0, // Nombre minimum de connexions dans le pool
      acquire: 30000, // Temps maximum en ms qu'une requête peut attendre pour une connexion
      idle: 10000, // Temps maximum en ms qu'une connexion peut rester inactive avant d'être libérée
    },
  },
  test: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 3306,
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || '',
    database: process.env.TEST_DB_NAME || 'test_db',
    dialect: process.env.TEST_DB_DIALECT || 'mariadb',
    logging: false, // Désactive les logs en environnement de test
    dialectOptions: {
      timezone: 'Europe/Paris',
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  production: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'application_solidaire',
    dialect: process.env.DB_DIALECT || 'mariadb',
    logging: false, // Désactive les logs en production
    dialectOptions: {
      timezone: 'Europe/Paris',
      ssl: {
        require: true, // Utilise SSL en production
        rejectUnauthorized: false, // Nécessaire si le certificat n'est pas signé par une autorité reconnue
      },
    },
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 20, // Plus de connexions en production
      min: 5,
      acquire: 60000,
      idle: 30000,
    },
  },
};

// Exporte la configuration pour l'environnement actuel
module.exports = databaseConfig[process.env.NODE_ENV || 'development'];
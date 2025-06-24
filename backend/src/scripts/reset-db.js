require('dotenv').config();
const { sequelize } = require('../models');
const { seedDemoData } = require('../seeders/demo-data');

const resetDatabase = async () => {
  try {
    console.log('🔄 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion établie');

    console.log('⚠️  Suppression et recréation des tables...');
    await sequelize.sync({ force: true }); // Supprime et recrée toutes les tables
    console.log('✅ Tables recréées');

    console.log('🔄 Insertion des données de démonstration...');
    await seedDemoData();
    console.log('✅ Données de démonstration insérées');

    console.log('🎉 Base de données réinitialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  }
};

resetDatabase();
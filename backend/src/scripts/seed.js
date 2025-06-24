require('dotenv').config();
const { sequelize } = require('../models');
const { seedDemoData } = require('../seeders/demo-data');

const runSeeder = async () => {
  try {
    console.log('🔄 Connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion établie');

    console.log('🔄 Synchronisation des modèles...');
    await sequelize.sync({ force: false }); // Ne pas supprimer les données existantes
    console.log('✅ Modèles synchronisés');

    console.log('🔄 Exécution du seeding...');
    await seedDemoData();
    console.log('✅ Seeding terminé');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

runSeeder();
require('dotenv').config();

// Importation des dépendances
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

// Importation des routes
const routesUtilisateur = require('./routes/utilisateur.routes');
const routesOffre = require('./routes/offre.routes');
const routesReservation = require('./routes/reservation.routes');
const routesAvis = require('./routes/avis.routes');
const routesChat = require('./routes/chat.routes');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des middlewares globaux
app.use(cors()); // Permet les requêtes cross-origin
app.use(helmet()); // Ajoute des en-têtes de sécurité
app.use(express.json()); // Permet de parser le JSON dans les requêtes
app.use(express.urlencoded({ extended: true })); // Parse les URL encodées

// Routes de base pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de l\'application solidaire!' });
});

// Connexion des routes
app.use('/api/utilisateurs', routesUtilisateur);
app.use('/api/offres', routesOffre);
app.use('/api/reservations', routesReservation);
app.use('/api/avis', routesAvis);
app.use('/api/chat', routesChat);

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const demarrerServeur = async () => {
  try {
    // Synchronisation avec la base de données
    // Note: en production, utilisez plutôt les migrations
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    // Démarrage du serveur HTTP
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    process.exit(1);
  }
};

// Lancement du serveur
demarrerServeur();

// Export pour les tests
module.exports = app;
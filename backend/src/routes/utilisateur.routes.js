const express = require('express');
const router = express.Router();
const {
  creerUtilisateur,
  listerUtilisateurs,
  recupererUtilisateurParId,
  mettreAJourUtilisateur,
  supprimerUtilisateur,
  connecterUtilisateur
} = require('../controllers/utilisateur.controller');

const {
  authentifierToken,
  authentificationOptionnelle
} = require('../middlewares/auth.middleware');

const {
  validerCreationUtilisateur,
  validerConnexion,
  validerIdParam,
  validerPagination
} = require('../middlewares/validation.middleware');

// Routes publiques
// POST /api/utilisateurs - Créer un nouvel utilisateur (inscription)
router.post('/', validerCreationUtilisateur, creerUtilisateur);

// POST /api/utilisateurs/login - Connexion utilisateur
router.post('/login', validerConnexion, connecterUtilisateur);

// Routes protégées
// GET /api/utilisateurs - Lister tous les utilisateurs (avec pagination et filtres)
router.get('/', authentificationOptionnelle, validerPagination, listerUtilisateurs);

// GET /api/utilisateurs/:id - Récupérer un utilisateur par son ID
router.get('/:id', authentificationOptionnelle, validerIdParam, recupererUtilisateurParId);

// PUT /api/utilisateurs/:id - Mettre à jour un utilisateur
router.put('/:id', authentifierToken, validerIdParam, mettreAJourUtilisateur);

// DELETE /api/utilisateurs/:id - Supprimer un utilisateur
router.delete('/:id', authentifierToken, validerIdParam, supprimerUtilisateur);

module.exports = router;
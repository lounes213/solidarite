const express = require('express');
const router = express.Router();
const {
  creerAvis,
  listerAvis,
  recupererAvisParId,
  mettreAJourAvis,
  supprimerAvis,
  obtenirStatistiquesAvis
} = require('../controllers/avis.controller');

const {
  authentifierToken,
  authentificationOptionnelle
} = require('../middlewares/auth.middleware');

const {
  validerCreationAvis,
  validerIdParam,
  validerPagination
} = require('../middlewares/validation.middleware');

// Routes publiques
// GET /api/avis - Lister tous les avis (avec pagination et filtres)
router.get('/', authentificationOptionnelle, validerPagination, listerAvis);

// GET /api/avis/:id - Récupérer un avis par son ID
router.get('/:id', authentificationOptionnelle, validerIdParam, recupererAvisParId);

// GET /api/avis/stats/:userId - Obtenir les statistiques d'avis d'un utilisateur
router.get('/stats/:userId', authentificationOptionnelle, validerIdParam, obtenirStatistiquesAvis);

// Routes protégées
// POST /api/avis - Créer un nouvel avis
router.post('/', authentifierToken, validerCreationAvis, creerAvis);

// PUT /api/avis/:id - Mettre à jour un avis
router.put('/:id', authentifierToken, validerIdParam, mettreAJourAvis);

// DELETE /api/avis/:id - Supprimer un avis
router.delete('/:id', authentifierToken, validerIdParam, supprimerAvis);

module.exports = router;
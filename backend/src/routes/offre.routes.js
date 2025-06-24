const express = require('express');
const router = express.Router();
const {
  creerOffre,
  listerOffres,
  recupererOffreParId,
  mettreAJourOffre,
  supprimerOffre
} = require('../controllers/offre.controller');

const {
  authentifierToken,
  verifierHote,
  authentificationOptionnelle
} = require('../middlewares/auth.middleware');

const {
  validerCreationOffre,
  validerIdParam,
  validerPagination
} = require('../middlewares/validation.middleware');

// Routes publiques
// GET /api/offres - Lister toutes les offres (avec pagination et filtres)
router.get('/', authentificationOptionnelle, validerPagination, listerOffres);

// GET /api/offres/:id - Récupérer une offre par son ID
router.get('/:id', authentificationOptionnelle, validerIdParam, recupererOffreParId);

// Routes protégées (hôtes uniquement)
// POST /api/offres - Créer une nouvelle offre
router.post('/', authentifierToken, verifierHote, validerCreationOffre, creerOffre);

// PUT /api/offres/:id - Mettre à jour une offre
router.put('/:id', authentifierToken, verifierHote, validerIdParam, mettreAJourOffre);

// DELETE /api/offres/:id - Supprimer une offre
router.delete('/:id', authentifierToken, verifierHote, validerIdParam, supprimerOffre);

module.exports = router;
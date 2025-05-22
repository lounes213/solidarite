const express = require('express');
const router = express.Router();
const {
  creerOffre,
  listerOffres,
  recupererOffreParId,
  mettreAJourOffre,
  supprimerOffre
} = require('../controllers/offre.controller');

// GET /api/offres - Lister toutes les offres
router.get('/', listerOffres);

// POST /api/offres - Créer une nouvelle offre
router.post('/', creerOffre);

// GET /api/offres/:id - Récupérer une offre par son ID
router.get('/:id', recupererOffreParId);

// PUT /api/offres/:id - Mettre à jour une offre
router.put('/:id', mettreAJourOffre);

// DELETE /api/offres/:id - Supprimer une offre
router.delete('/:id', supprimerOffre);

module.exports = router;
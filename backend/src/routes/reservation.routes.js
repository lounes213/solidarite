const express = require('express');
const router = express.Router();
const {
  creerReservation,
  listerReservations,
  recupererReservationParId,
  mettreAJourReservation,
  supprimerReservation
} = require('../controllers/reservation.controller');

const {
  authentifierToken,
  verifierEtudiant
} = require('../middlewares/auth.middleware');

const {
  validerCreationReservation,
  validerIdParam,
  validerPagination
} = require('../middlewares/validation.middleware');

// Toutes les routes nécessitent une authentification
router.use(authentifierToken);

// GET /api/reservations - Lister toutes les réservations (avec pagination et filtres)
router.get('/', validerPagination, listerReservations);

// POST /api/reservations - Créer une nouvelle réservation (étudiants uniquement)
router.post('/', verifierEtudiant, validerCreationReservation, creerReservation);

// GET /api/reservations/:id - Récupérer une réservation par son ID
router.get('/:id', validerIdParam, recupererReservationParId);

// PUT /api/reservations/:id - Mettre à jour une réservation
router.put('/:id', validerIdParam, mettreAJourReservation);

// DELETE /api/reservations/:id - Supprimer une réservation
router.delete('/:id', validerIdParam, supprimerReservation);

module.exports = router;
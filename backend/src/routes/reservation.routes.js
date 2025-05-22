const express = require('express');
const router = express.Router();
const {creerReservation, listerReservations, recupererReservationParId, mettreAJourReservation, supprimerReservation} = require('../controllers/reservation.controller');

router.post('/', creerReservation);

router.get('/', listerReservations);


router.get('/:id', recupererReservationParId);

router.put('/:id', mettreAJourReservation);

router.delete('/:id', supprimerReservation);

module.exports = router;
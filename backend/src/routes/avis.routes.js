const express = require('express');
const router = express.Router();
const {creerAvis, listerAvis, recupererAvisParId, mettreAJourAvis, supprimerAvis} = require('../controllers/avis.controller');

router.post('/', creerAvis);

router.get('/', listerAvis);

router.get('/:id', recupererAvisParId);

router.put('/:id', mettreAJourAvis);


router.delete('/:id', supprimerAvis);

module.exports = router;
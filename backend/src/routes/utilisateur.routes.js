const express = require('express');
const router = express.Router();
const {creerUtilisateur, listerUtilisateurs, recupererUtilisateurParId, mettreAJourUtilisateur, supprimerUtilisateur} = require('../controllers/utilisateur.controller');

router.post('/', creerUtilisateur);

router.get('/', listerUtilisateurs);

router.get('/:id', recupererUtilisateurParId);

router.put('/:id', mettreAJourUtilisateur);

router.delete('/:id', supprimerUtilisateur);

module.exports = router;
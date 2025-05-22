const express = require('express');
const router = express.Router();
const {creerMessage, listerMessages, recupererMessageParId, mettreAJourMessage, supprimerMessage} = require('../controllers/chat.controller');

router.post('/', creerMessage);

router.get('/', listerMessages);

router.get('/:id', recupererMessageParId);

router.put('/:id', mettreAJourMessage);

router.delete('/:id', supprimerMessage);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  creerSalleDeChat,
  listerSallesDeChat,
  creerMessage,
  listerMessages,
  supprimerMessage,
  recupererSalleParId
} = require('../controllers/chat.controller');

const {
  authentifierToken
} = require('../middlewares/auth.middleware');

const {
  validerCreationMessage,
  validerIdParam,
  validerPagination
} = require('../middlewares/validation.middleware');

// Toutes les routes nécessitent une authentification
router.use(authentifierToken);

// Routes pour les salles de chat
// GET /api/chat/salles - Lister les salles de chat de l'utilisateur
router.get('/salles', validerPagination, listerSallesDeChat);

// POST /api/chat/salles - Créer une nouvelle salle de chat
router.post('/salles', creerSalleDeChat);

// GET /api/chat/salles/:id - Récupérer une salle de chat par son ID
router.get('/salles/:id', validerIdParam, recupererSalleParId);

// Routes pour les messages
// GET /api/chat/salles/:idSalle/messages - Lister les messages d'une salle
router.get('/salles/:idSalle/messages', validerIdParam, validerPagination, listerMessages);

// POST /api/chat/messages - Créer un nouveau message
router.post('/messages', validerCreationMessage, creerMessage);

// DELETE /api/chat/messages/:id - Supprimer un message
router.delete('/messages/:id', validerIdParam, supprimerMessage);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  obtenirNotifications,
  marquerCommeLue,
  marquerToutesCommeLues,
  compterNotificationsNonLues
} = require('../controllers/notification.controller');

const {
  authentifierToken
} = require('../middlewares/auth.middleware');

const {
  validerIdParam,
  validerPagination
} = require('../middlewares/validation.middleware');

// Toutes les routes nécessitent une authentification
router.use(authentifierToken);

// GET /api/notifications - Récupérer les notifications de l'utilisateur
router.get('/', validerPagination, obtenirNotifications);

// GET /api/notifications/count - Compter les notifications non lues
router.get('/count', compterNotificationsNonLues);

// PUT /api/notifications/mark-all-read - Marquer toutes les notifications comme lues
router.put('/mark-all-read', marquerToutesCommeLues);

// PUT /api/notifications/:id/read - Marquer une notification comme lue
router.put('/:id/read', validerIdParam, marquerCommeLue);

module.exports = router;
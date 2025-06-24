const notificationService = require('../services/notification.service');

const obtenirNotifications = async (req, res) => {
  try {
    const userId = req.utilisateur.id;
    const { page = 1, limit = 20, nonLuesUniquement } = req.query;

    const result = await notificationService.obtenirNotifications(userId, {
      page,
      limit,
      nonLuesUniquement: nonLuesUniquement === 'true'
    });

    res.status(200).json({
      success: true,
      message: 'Notifications récupérées avec succès!',
      data: result
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const marquerCommeLue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.utilisateur.id;

    const notification = await notificationService.marquerCommeLue(id, userId);

    res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue!',
      data: notification
    });

  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const marquerToutesCommeLues = async (req, res) => {
  try {
    const userId = req.utilisateur.id;

    await notificationService.marquerToutesCommeLues(userId);

    res.status(200).json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues!'
    });

  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de toutes les notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const compterNotificationsNonLues = async (req, res) => {
  try {
    const userId = req.utilisateur.id;

    const count = await notificationService.compterNotificationsNonLues(userId);

    res.status(200).json({
      success: true,
      message: 'Nombre de notifications non lues récupéré!',
      data: { count }
    });

  } catch (error) {
    console.error('Erreur lors du comptage des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  obtenirNotifications,
  marquerCommeLue,
  marquerToutesCommeLues,
  compterNotificationsNonLues
};
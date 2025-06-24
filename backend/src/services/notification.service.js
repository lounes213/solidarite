const { Notification } = require('../models');

class NotificationService {
  /**
   * Créer une notification
   */
  async creerNotification(data) {
    try {
      const notification = await Notification.create({
        idUtilisateur: data.idUtilisateur,
        type: data.type,
        titre: data.titre,
        message: data.message,
        donnees: data.donnees || null,
        lue: false
      });

      return notification;
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  /**
   * Notification pour nouvelle réservation (hôte)
   */
  async notifierNouvelleReservation(reservation, hote) {
    return await this.creerNotification({
      idUtilisateur: hote.id,
      type: 'reservation',
      titre: 'Nouvelle réservation',
      message: `${reservation.etudiant.nom} a fait une réservation pour "${reservation.offre.titre}"`,
      donnees: {
        reservationId: reservation.id,
        offreId: reservation.idOffre,
        etudiantId: reservation.idEtudiant
      }
    });
  }

  /**
   * Notification pour confirmation de réservation (étudiant)
   */
  async notifierConfirmationReservation(reservation, etudiant) {
    return await this.creerNotification({
      idUtilisateur: etudiant.id,
      type: 'confirmation',
      titre: 'Réservation confirmée',
      message: `Votre réservation pour "${reservation.offre.titre}" a été confirmée`,
      donnees: {
        reservationId: reservation.id,
        offreId: reservation.idOffre
      }
    });
  }

  /**
   * Notification pour annulation de réservation
   */
  async notifierAnnulationReservation(reservation, utilisateur) {
    return await this.creerNotification({
      idUtilisateur: utilisateur.id,
      type: 'annulation',
      titre: 'Réservation annulée',
      message: `La réservation pour "${reservation.offre.titre}" a été annulée`,
      donnees: {
        reservationId: reservation.id,
        offreId: reservation.idOffre
      }
    });
  }

  /**
   * Notification pour nouvel avis reçu
   */
  async notifierNouvelAvis(avis, cible) {
    return await this.creerNotification({
      idUtilisateur: cible.id,
      type: 'avis',
      titre: 'Nouvel avis reçu',
      message: `${avis.auteur.nom} vous a laissé un avis (${avis.note_globale}/5 étoiles)`,
      donnees: {
        avisId: avis.id,
        auteurId: avis.auteurId,
        note: avis.note_globale
      }
    });
  }

  /**
   * Notification pour nouveau message
   */
  async notifierNouveauMessage(message, destinataire) {
    return await this.creerNotification({
      idUtilisateur: destinataire.id,
      type: 'message',
      titre: 'Nouveau message',
      message: `${message.emetteur.nom} vous a envoyé un message`,
      donnees: {
        messageId: message.id,
        salleId: message.idSalle,
        emetteurId: message.idEmetteur
      }
    });
  }

  /**
   * Marquer une notification comme lue
   */
  async marquerCommeLue(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          idUtilisateur: userId
        }
      });

      if (!notification) {
        throw new Error('Notification non trouvée');
      }

      await notification.update({ lue: true });
      return notification;
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  async marquerToutesCommeLues(userId) {
    try {
      await Notification.update(
        { lue: true },
        {
          where: {
            idUtilisateur: userId,
            lue: false
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  async obtenirNotifications(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        nonLuesUniquement = false
      } = options;

      const whereConditions = { idUtilisateur: userId };
      if (nonLuesUniquement) {
        whereConditions.lue = false;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: notifications } = await Notification.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Compter les notifications non lues
   */
  async compterNotificationsNonLues(userId) {
    try {
      const count = await Notification.count({
        where: {
          idUtilisateur: userId,
          lue: false
        }
      });

      return count;
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      throw error;
    }
  }

  /**
   * Supprimer les anciennes notifications (plus de 30 jours)
   */
  async nettoyerAnciennesNotifications() {
    try {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 30);

      const result = await Notification.destroy({
        where: {
          createdAt: {
            [Op.lt]: dateLimit
          }
        }
      });

      console.log(`${result} anciennes notifications supprimées`);
      return result;
    } catch (error) {
      console.error('Erreur lors du nettoyage des notifications:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
const { Reservation, Offre, Utilisateur } = require('../models');
const { Op } = require('sequelize');

const creerReservation = async (req, res) => {
  try {
    const {
      idOffre,
      idEtudiant,
      prix_convenu
    } = req.body;

    // Validation des champs requis
    if (!idOffre || !idEtudiant || !prix_convenu) {
      return res.status(400).json({
        success: false,
        message: "Les champs idOffre, idEtudiant et prix_convenu sont requis."
      });
    }

    // Vérifier que l'offre existe et est active
    const offre = await Offre.findByPk(idOffre);
    if (!offre) {
      return res.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    if (!offre.est_active) {
      return res.status(400).json({
        success: false,
        message: 'Cette offre n\'est plus active'
      });
    }

    // Vérifier que l'étudiant existe
    const etudiant = await Utilisateur.findByPk(idEtudiant);
    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Vérifier que l'utilisateur est bien un étudiant
    if (etudiant.role !== 'etudiant') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les étudiants peuvent faire des réservations'
      });
    }

    // Vérifier que l'étudiant ne réserve pas sa propre offre
    if (offre.idHote === idEtudiant) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas réserver votre propre offre'
      });
    }

    // Vérifier s'il y a déjà une réservation active pour cette offre par cet étudiant
    const reservationExistante = await Reservation.findOne({
      where: {
        idOffre,
        idEtudiant,
        statut: ['pending', 'confirmed']
      }
    });

    if (reservationExistante) {
      return res.status(409).json({
        success: false,
        message: 'Vous avez déjà une réservation active pour cette offre'
      });
    }

    // Vérifier la capacité maximale si définie
    if (offre.capacite_max) {
      const reservationsConfirmees = await Reservation.count({
        where: {
          idOffre,
          statut: 'confirmed'
        }
      });

      if (reservationsConfirmees >= offre.capacite_max) {
        return res.status(400).json({
          success: false,
          message: 'Cette offre a atteint sa capacité maximale'
        });
      }
    }

    // Créer la réservation
    const nouvelleReservation = await Reservation.create({
      idOffre,
      idEtudiant,
      prix_convenu
    });

    // Récupérer la réservation avec les relations
    const reservationComplete = await Reservation.findByPk(nouvelleReservation.id, {
      include: [
        {
          model: Offre,
          as: 'offre',
          attributes: ['id', 'titre', 'type', 'localisation']
        },
        {
          model: Utilisateur,
          as: 'etudiant',
          attributes: ['id', 'nom', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès!',
      data: reservationComplete
    });

  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listerReservations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      statut,
      idEtudiant,
      idOffre
    } = req.query;

    // Construire les conditions de filtrage
    const whereConditions = {};

    if (statut) {
      whereConditions.statut = statut;
    }

    if (idEtudiant) {
      whereConditions.idEtudiant = idEtudiant;
    }

    if (idOffre) {
      whereConditions.idOffre = idOffre;
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les réservations avec pagination
    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Offre,
          as: 'offre',
          attributes: ['id', 'titre', 'type', 'localisation', 'prix_fixe', 'prix_min', 'prix_max'],
          include: [
            {
              model: Utilisateur,
              as: 'hote',
              attributes: ['id', 'nom', 'email', 'telephone']
            }
          ]
        },
        {
          model: Utilisateur,
          as: 'etudiant',
          attributes: ['id', 'nom', 'email', 'telephone']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Liste des réservations récupérée avec succès!',
      data: {
        reservations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const recupererReservationParId = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            {
              model: Utilisateur,
              as: 'hote',
              attributes: ['id', 'nom', 'email', 'telephone', 'photoProfil']
            }
          ]
        },
        {
          model: Utilisateur,
          as: 'etudiant',
          attributes: ['id', 'nom', 'email', 'telephone', 'photoProfil']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation récupérée avec succès!',
      data: reservation
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const mettreAJourReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, prix_convenu } = req.body;

    // Vérifier que la réservation existe
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Validation du statut si fourni
    if (statut && !['pending', 'confirmed', 'cancelled'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide. Les valeurs autorisées sont: pending, confirmed, cancelled'
      });
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (statut) updateData.statut = statut;
    if (prix_convenu !== undefined) updateData.prix_convenu = prix_convenu;

    // Mettre à jour la réservation
    const reservationUpdated = await reservation.update(updateData);

    // Récupérer la réservation mise à jour avec les relations
    const reservationComplete = await Reservation.findByPk(id, {
      include: [
        {
          model: Offre,
          as: 'offre',
          attributes: ['id', 'titre', 'type', 'localisation']
        },
        {
          model: Utilisateur,
          as: 'etudiant',
          attributes: ['id', 'nom', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Réservation mise à jour avec succès!',
      data: reservationComplete
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const supprimerReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la réservation existe
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Supprimer la réservation
    await reservation.destroy();

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée avec succès!'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la réservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  creerReservation,
  listerReservations,
  recupererReservationParId,
  mettreAJourReservation,
  supprimerReservation
};
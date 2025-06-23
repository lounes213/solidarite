const { Avis, Reservation, Utilisateur, Offre } = require('../models');
const { Op } = require('sequelize');

const creerAvis = async (req, res) => {
  try {
    const {
      idReservation,
      auteurId,
      cibleId,
      note_globale,
      note_repas,
      note_ponctualite,
      note_convivialite,
      commentaire
    } = req.body;

    // Validation des champs requis
    if (!idReservation || !auteurId || !cibleId || !note_globale || !note_repas || !note_ponctualite || !note_convivialite) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs de notation sont requis."
      });
    }

    // Validation des notes (entre 1 et 5)
    const notes = [note_globale, note_repas, note_ponctualite, note_convivialite];
    for (const note of notes) {
      if (note < 1 || note > 5) {
        return res.status(400).json({
          success: false,
          message: "Les notes doivent être comprises entre 1 et 5."
        });
      }
    }

    // Vérifier que la réservation existe et est confirmée
    const reservation = await Reservation.findByPk(idReservation, {
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            {
              model: Utilisateur,
              as: 'hote'
            }
          ]
        },
        {
          model: Utilisateur,
          as: 'etudiant'
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    if (reservation.statut !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Seules les réservations confirmées peuvent être évaluées'
      });
    }

    // Vérifier que l'auteur fait partie de la réservation
    const isEtudiant = reservation.idEtudiant === auteurId;
    const isHote = reservation.offre.idHote === auteurId;

    if (!isEtudiant && !isHote) {
      return res.status(403).json({
        success: false,
        message: 'Seuls les participants à la réservation peuvent laisser un avis'
      });
    }

    // Vérifier que la cible est l'autre participant
    let cibleAttendue;
    if (isEtudiant) {
      cibleAttendue = reservation.offre.idHote;
    } else {
      cibleAttendue = reservation.idEtudiant;
    }

    if (cibleId !== cibleAttendue) {
      return res.status(400).json({
        success: false,
        message: 'La cible de l\'avis doit être l\'autre participant à la réservation'
      });
    }

    // Vérifier qu'un avis n'existe pas déjà pour cette réservation par cet auteur
    const avisExistant = await Avis.findOne({
      where: {
        idReservation,
        auteurId
      }
    });

    if (avisExistant) {
      return res.status(409).json({
        success: false,
        message: 'Vous avez déjà laissé un avis pour cette réservation'
      });
    }

    // Créer l'avis
    const nouvelAvis = await Avis.create({
      idReservation,
      auteurId,
      cibleId,
      note_globale,
      note_repas,
      note_ponctualite,
      note_convivialite,
      commentaire
    });

    // Récupérer l'avis avec les relations
    const avisComplet = await Avis.findByPk(nouvelAvis.id, {
      include: [
        {
          model: Utilisateur,
          as: 'auteur',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Utilisateur,
          as: 'cible',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Reservation,
          as: 'reservation',
          include: [
            {
              model: Offre,
              as: 'offre',
              attributes: ['id', 'titre']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Avis créé avec succès!',
      data: avisComplet
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'avis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listerAvis = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      cibleId,
      auteurId,
      note_min
    } = req.query;

    // Construire les conditions de filtrage
    const whereConditions = {};

    if (cibleId) {
      whereConditions.cibleId = cibleId;
    }

    if (auteurId) {
      whereConditions.auteurId = auteurId;
    }

    if (note_min) {
      whereConditions.note_globale = {
        [Op.gte]: parseInt(note_min)
      };
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les avis avec pagination
    const { count, rows: avis } = await Avis.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Utilisateur,
          as: 'auteur',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Utilisateur,
          as: 'cible',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Reservation,
          as: 'reservation',
          include: [
            {
              model: Offre,
              as: 'offre',
              attributes: ['id', 'titre', 'type']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Liste des avis récupérée avec succès!',
      data: {
        avis,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des avis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const recupererAvisParId = async (req, res) => {
  try {
    const { id } = req.params;

    const avis = await Avis.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: 'auteur',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Utilisateur,
          as: 'cible',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Reservation,
          as: 'reservation',
          include: [
            {
              model: Offre,
              as: 'offre',
              attributes: ['id', 'titre', 'type']
            },
            {
              model: Utilisateur,
              as: 'etudiant',
              attributes: ['id', 'nom']
            }
          ]
        }
      ]
    });

    if (!avis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avis récupéré avec succès!',
      data: avis
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'avis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const mettreAJourAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      note_globale,
      note_repas,
      note_ponctualite,
      note_convivialite,
      commentaire
    } = req.body;

    // Vérifier que l'avis existe
    const avis = await Avis.findByPk(id);
    if (!avis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Validation des notes si fournies
    const notes = [note_globale, note_repas, note_ponctualite, note_convivialite].filter(n => n !== undefined);
    for (const note of notes) {
      if (note < 1 || note > 5) {
        return res.status(400).json({
          success: false,
          message: "Les notes doivent être comprises entre 1 et 5."
        });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (note_globale !== undefined) updateData.note_globale = note_globale;
    if (note_repas !== undefined) updateData.note_repas = note_repas;
    if (note_ponctualite !== undefined) updateData.note_ponctualite = note_ponctualite;
    if (note_convivialite !== undefined) updateData.note_convivialite = note_convivialite;
    if (commentaire !== undefined) updateData.commentaire = commentaire;

    // Mettre à jour l'avis
    await avis.update(updateData);

    // Récupérer l'avis mis à jour avec les relations
    const avisUpdated = await Avis.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: 'auteur',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Utilisateur,
          as: 'cible',
          attributes: ['id', 'nom', 'photoProfil']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Avis mis à jour avec succès!',
      data: avisUpdated
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'avis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const supprimerAvis = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'avis existe
    const avis = await Avis.findByPk(id);
    if (!avis) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    // Supprimer l'avis
    await avis.destroy();

    res.status(200).json({
      success: true,
      message: 'Avis supprimé avec succès!'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'avis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonction pour obtenir les statistiques d'avis d'un utilisateur
const obtenirStatistiquesAvis = async (req, res) => {
  try {
    const { userId } = req.params;

    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findByPk(userId);
    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Calculer les statistiques
    const avisRecus = await Avis.findAll({
      where: { cibleId: userId },
      attributes: ['note_globale', 'note_repas', 'note_ponctualite', 'note_convivialite']
    });

    if (avisRecus.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Statistiques des avis récupérées avec succès!',
        data: {
          nombreAvis: 0,
          moyenneGlobale: 0,
          moyenneRepas: 0,
          moyennePonctualite: 0,
          moyenneConvivialite: 0
        }
      });
    }

    const stats = {
      nombreAvis: avisRecus.length,
      moyenneGlobale: avisRecus.reduce((sum, avis) => sum + avis.note_globale, 0) / avisRecus.length,
      moyenneRepas: avisRecus.reduce((sum, avis) => sum + avis.note_repas, 0) / avisRecus.length,
      moyennePonctualite: avisRecus.reduce((sum, avis) => sum + avis.note_ponctualite, 0) / avisRecus.length,
      moyenneConvivialite: avisRecus.reduce((sum, avis) => sum + avis.note_convivialite, 0) / avisRecus.length
    };

    // Arrondir les moyennes à 2 décimales
    Object.keys(stats).forEach(key => {
      if (key !== 'nombreAvis') {
        stats[key] = Math.round(stats[key] * 100) / 100;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Statistiques des avis récupérées avec succès!',
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  creerAvis,
  listerAvis,
  recupererAvisParId,
  mettreAJourAvis,
  supprimerAvis,
  obtenirStatistiquesAvis
};
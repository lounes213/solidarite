const { Offre, Utilisateur } = require('../models');
const { Op } = require('sequelize');

const creerOffre = async (request, response) => {
  try {
    const {
      idHote,
      type,
      titre,
      prix_min,
      prix_max,
      prix_fixe,
      prix_defini_par_app,
      description,
      localisation,
      coordonneesGPS,
      disponible_depuis,
      date_expiration,
      capacite_max,
      photos
    } = request.body;

    // Validation des champs requis
    if (!idHote || !type || !titre || !description || !localisation || !disponible_depuis) {
      return response.status(400).json({
        success: false,
        message: 'Les champs idHote, type, titre, description, localisation et disponible_depuis sont requis'
      });
    }

    // Vérifier que l'hôte existe
    const hote = await Utilisateur.findByPk(idHote);
    if (!hote) {
      return response.status(404).json({
        success: false,
        message: 'Hôte non trouvé'
      });
    }

    // Vérifier que l'hôte a le bon rôle
    if (hote.role !== 'hote') {
      return response.status(403).json({
        success: false,
        message: 'Seuls les hôtes peuvent créer des offres'
      });
    }

    // Créer l'offre
    const nouvelleOffre = await Offre.create({
      idHote,
      type,
      titre,
      prix_min,
      prix_max,
      prix_fixe,
      prix_defini_par_app: prix_defini_par_app || false,
      description,
      localisation,
      coordonneesGPS,
      disponible_depuis,
      date_expiration,
      capacite_max,
      photos
    });

    response.status(201).json({
      success: true,
      message: 'Offre créée avec succès!',
      data: nouvelleOffre
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre:', error);
    response.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'offre',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listerOffres = async (request, response) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      localisation,
      prix_min,
      prix_max,
      est_active = true
    } = request.query;

    // Construire les conditions de filtrage
    const whereConditions = {
      est_active: est_active === 'true'
    };

    if (type) {
      whereConditions.type = type;
    }

    if (localisation) {
      whereConditions.localisation = {
        [Op.iLike]: `%${localisation}%`
      };
    }

    if (prix_min || prix_max) {
      whereConditions[Op.or] = [];
      
      if (prix_min && prix_max) {
        whereConditions[Op.or].push(
          {
            prix_fixe: {
              [Op.between]: [parseFloat(prix_min), parseFloat(prix_max)]
            }
          },
          {
            prix_min: {
              [Op.gte]: parseFloat(prix_min)
            },
            prix_max: {
              [Op.lte]: parseFloat(prix_max)
            }
          }
        );
      } else if (prix_min) {
        whereConditions[Op.or].push(
          {
            prix_fixe: {
              [Op.gte]: parseFloat(prix_min)
            }
          },
          {
            prix_min: {
              [Op.gte]: parseFloat(prix_min)
            }
          }
        );
      } else if (prix_max) {
        whereConditions[Op.or].push(
          {
            prix_fixe: {
              [Op.lte]: parseFloat(prix_max)
            }
          },
          {
            prix_max: {
              [Op.lte]: parseFloat(prix_max)
            }
          }
        );
      }
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les offres avec pagination
    const { count, rows: offres } = await Offre.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Utilisateur,
          as: 'hote',
          attributes: ['id', 'nom', 'email', 'photoProfil', 'ville']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    response.status(200).json({
      success: true,
      message: 'Liste des offres récupérée avec succès!',
      data: {
        offres,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres:', error);
    response.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const recupererOffreParId = async (request, response) => {
  try {
    const { id } = request.params;

    const offre = await Offre.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: 'hote',
          attributes: ['id', 'nom', 'email', 'telephone', 'photoProfil', 'ville', 'biographie']
        }
      ]
    });

    if (!offre) {
      return response.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    response.status(200).json({
      success: true,
      message: `Offre avec l'ID ${id} récupérée avec succès`,
      data: offre
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'offre:', error);
    response.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'offre',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const mettreAJourOffre = async (request, response) => {
  try {
    const { id } = request.params;
    const {
      type,
      titre,
      prix_min,
      prix_max,
      prix_fixe,
      prix_defini_par_app,
      description,
      localisation,
      coordonneesGPS,
      disponible_depuis,
      date_expiration,
      capacite_max,
      est_active,
      photos
    } = request.body;

    // Vérifier que l'offre existe
    const offre = await Offre.findByPk(id);
    if (!offre) {
      return response.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    // Mettre à jour l'offre
    const offreUpdated = await offre.update({
      type: type || offre.type,
      titre: titre || offre.titre,
      prix_min: prix_min !== undefined ? prix_min : offre.prix_min,
      prix_max: prix_max !== undefined ? prix_max : offre.prix_max,
      prix_fixe: prix_fixe !== undefined ? prix_fixe : offre.prix_fixe,
      prix_defini_par_app: prix_defini_par_app !== undefined ? prix_defini_par_app : offre.prix_defini_par_app,
      description: description || offre.description,
      localisation: localisation || offre.localisation,
      coordonneesGPS: coordonneesGPS || offre.coordonneesGPS,
      disponible_depuis: disponible_depuis || offre.disponible_depuis,
      date_expiration: date_expiration !== undefined ? date_expiration : offre.date_expiration,
      capacite_max: capacite_max !== undefined ? capacite_max : offre.capacite_max,
      est_active: est_active !== undefined ? est_active : offre.est_active,
      photos: photos || offre.photos
    });

    response.status(200).json({
      success: true,
      message: `Offre avec l'ID ${id} mise à jour avec succès`,
      data: offreUpdated
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre:', error);
    response.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'offre',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const supprimerOffre = async (request, response) => {
  try {
    const { id } = request.params;

    // Vérifier que l'offre existe
    const offre = await Offre.findByPk(id);
    if (!offre) {
      return response.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    // Supprimer l'offre
    await offre.destroy();

    response.status(200).json({
      success: true,
      message: `Offre avec l'ID ${id} supprimée avec succès`
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre:', error);
    response.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'offre',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  creerOffre,
  listerOffres,
  recupererOffreParId,
  mettreAJourOffre,
  supprimerOffre
};
const { Utilisateur, Offre, Reservation, Avis } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const creerUtilisateur = async (req, res) => {
  try {
    const {
      nom,
      email,
      telephone,
      role,
      motDePasse,
      adresse,
      ville,
      codePostal,
      coordonneesGPS,
      photoProfil,
      biographie
    } = req.body;

    // Validation des champs requis
    if (!nom || !email || !telephone || !role || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: "Les champs nom, email, téléphone, rôle et mot de passe sont requis."
      });
    }

    // Validation du rôle
    if (!['etudiant', 'hote'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Le rôle doit être 'etudiant' ou 'hote'."
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({
      where: { email }
    });

    if (utilisateurExistant) {
      return res.status(409).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà."
      });
    }

    // Créer le nouvel utilisateur
    const nouvelUtilisateur = await Utilisateur.create({
      nom,
      email,
      telephone,
      role,
      motDePasse,
      adresse,
      ville,
      codePostal,
      coordonneesGPS,
      photoProfil,
      biographie
    });

    // Retourner l'utilisateur sans le mot de passe
    const utilisateurResponse = nouvelUtilisateur.toJSON();
    delete utilisateurResponse.motDePasse;

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès!',
      data: utilisateurResponse
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listerUtilisateurs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      ville,
      estVerifie
    } = req.query;

    // Construire les conditions de filtrage
    const whereConditions = {};

    if (role) {
      whereConditions.role = role;
    }

    if (ville) {
      whereConditions.ville = {
        [Op.iLike]: `%${ville}%`
      };
    }

    if (estVerifie !== undefined) {
      whereConditions.estVerifie = estVerifie === 'true';
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les utilisateurs avec pagination
    const { count, rows: utilisateurs } = await Utilisateur.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ['motDePasse'] }, // Exclure le mot de passe
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Liste des utilisateurs récupérée avec succès!',
      data: {
        utilisateurs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const recupererUtilisateurParId = async (req, res) => {
  try {
    const { id } = req.params;

    const utilisateur = await Utilisateur.findByPk(id, {
      attributes: { exclude: ['motDePasse'] }, // Exclure le mot de passe
      include: [
        {
          model: Offre,
          as: 'offres',
          where: { est_active: true },
          required: false
        },
        {
          model: Reservation,
          as: 'reservations',
          required: false
        },
        {
          model: Avis,
          as: 'avisRecus',
          required: false
        }
      ]
    });

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur récupéré avec succès!',
      data: utilisateur
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const mettreAJourUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom,
      email,
      telephone,
      motDePasse,
      adresse,
      ville,
      codePostal,
      coordonneesGPS,
      photoProfil,
      biographie,
      estVerifie
    } = req.body;

    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (email && email !== utilisateur.email) {
      const emailExistant = await Utilisateur.findOne({
        where: { 
          email,
          id: { [Op.ne]: id }
        }
      });

      if (emailExistant) {
        return res.status(409).json({
          success: false,
          message: "Un utilisateur avec cet email existe déjà."
        });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (nom) updateData.nom = nom;
    if (email) updateData.email = email;
    if (telephone) updateData.telephone = telephone;
    if (motDePasse) updateData.motDePasse = motDePasse;
    if (adresse !== undefined) updateData.adresse = adresse;
    if (ville !== undefined) updateData.ville = ville;
    if (codePostal !== undefined) updateData.codePostal = codePostal;
    if (coordonneesGPS !== undefined) updateData.coordonneesGPS = coordonneesGPS;
    if (photoProfil !== undefined) updateData.photoProfil = photoProfil;
    if (biographie !== undefined) updateData.biographie = biographie;
    if (estVerifie !== undefined) updateData.estVerifie = estVerifie;

    // Mettre à jour l'utilisateur
    const utilisateurUpdated = await utilisateur.update(updateData);

    // Retourner l'utilisateur sans le mot de passe
    const utilisateurResponse = utilisateurUpdated.toJSON();
    delete utilisateurResponse.motDePasse;

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès!',
      data: utilisateurResponse
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const supprimerUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Supprimer l'utilisateur
    await utilisateur.destroy();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès!'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonction de connexion (login)
const connecterUtilisateur = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Validation des champs requis
    if (!email || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe sont requis."
      });
    }

    // Trouver l'utilisateur par email
    const utilisateur = await Utilisateur.findOne({
      where: { email }
    });

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect."
      });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect."
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: utilisateur.id, 
        email: utilisateur.email, 
        role: utilisateur.role 
      },
      process.env.JWT_SECRET || 'votre_secret_jwt',
      { expiresIn: '24h' }
    );

    // Retourner l'utilisateur sans le mot de passe et le token
    const utilisateurResponse = utilisateur.toJSON();
    delete utilisateurResponse.motDePasse;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie!',
      data: {
        utilisateur: utilisateurResponse,
        token
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  creerUtilisateur,
  listerUtilisateurs,
  recupererUtilisateurParId,
  mettreAJourUtilisateur,
  supprimerUtilisateur,
  connecterUtilisateur
};
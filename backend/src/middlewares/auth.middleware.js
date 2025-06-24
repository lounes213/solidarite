const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

/**
 * Middleware d'authentification JWT
 * Vérifie la validité du token et ajoute l'utilisateur à la requête
 */
const authentifierToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');

    // Récupérer l'utilisateur depuis la base de données
    const utilisateur = await Utilisateur.findByPk(decoded.id, {
      attributes: { exclude: ['motDePasse'] }
    });

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide - utilisateur non trouvé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.utilisateur = utilisateur;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification'
    });
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {string|Array} roles - Rôle(s) autorisé(s)
 */
const verifierRole = (roles) => {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const rolesAutorises = Array.isArray(roles) ? roles : [roles];

    if (!rolesAutorises.includes(req.utilisateur.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé - rôle insuffisant'
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est un hôte
 */
const verifierHote = verifierRole('hote');

/**
 * Middleware pour vérifier que l'utilisateur est un étudiant
 */
const verifierEtudiant = verifierRole('etudiant');

/**
 * Middleware optionnel d'authentification
 * N'échoue pas si aucun token n'est fourni, mais ajoute l'utilisateur si le token est valide
 */
const authentificationOptionnelle = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Pas de token, continuer sans utilisateur
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
    const utilisateur = await Utilisateur.findByPk(decoded.id, {
      attributes: { exclude: ['motDePasse'] }
    });

    if (utilisateur) {
      req.utilisateur = utilisateur;
    }

    next();

  } catch (error) {
    // En cas d'erreur, continuer sans utilisateur
    next();
  }
};

module.exports = {
  authentifierToken,
  verifierRole,
  verifierHote,
  verifierEtudiant,
  authentificationOptionnelle
};
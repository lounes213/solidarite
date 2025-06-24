const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
const gererErreursValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * Validations pour les utilisateurs
 */
const validerCreationUtilisateur = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('telephone')
    .notEmpty()
    .withMessage('Le téléphone est requis')
    .matches(/^(\+33|0)[1-9](\d{8})$/)
    .withMessage('Format de téléphone invalide'),
  
  body('role')
    .isIn(['etudiant', 'hote'])
    .withMessage('Le rôle doit être "etudiant" ou "hote"'),
  
  body('motDePasse')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  gererErreursValidation
];

const validerConnexion = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('motDePasse')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  
  gererErreursValidation
];

/**
 * Validations pour les offres
 */
const validerCreationOffre = [
  body('idHote')
    .isUUID()
    .withMessage('ID hôte invalide'),
  
  body('type')
    .isIn(['invitation', 'panier'])
    .withMessage('Le type doit être "invitation" ou "panier"'),
  
  body('titre')
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 5, max: 100 })
    .withMessage('Le titre doit contenir entre 5 et 100 caractères'),
  
  body('description')
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 20, max: 1000 })
    .withMessage('La description doit contenir entre 20 et 1000 caractères'),
  
  body('localisation')
    .notEmpty()
    .withMessage('La localisation est requise'),
  
  body('disponible_depuis')
    .isISO8601()
    .withMessage('Date de disponibilité invalide')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('La date de disponibilité ne peut pas être dans le passé');
      }
      return true;
    }),
  
  body('prix_fixe')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix fixe doit être un nombre positif'),
  
  body('prix_min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix minimum doit être un nombre positif'),
  
  body('prix_max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix maximum doit être un nombre positif')
    .custom((value, { req }) => {
      if (req.body.prix_min && value < req.body.prix_min) {
        throw new Error('Le prix maximum doit être supérieur au prix minimum');
      }
      return true;
    }),
  
  body('capacite_max')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La capacité maximale doit être un entier positif'),
  
  gererErreursValidation
];

/**
 * Validations pour les réservations
 */
const validerCreationReservation = [
  body('idOffre')
    .isUUID()
    .withMessage('ID offre invalide'),
  
  body('idEtudiant')
    .isUUID()
    .withMessage('ID étudiant invalide'),
  
  body('prix_convenu')
    .isFloat({ min: 0 })
    .withMessage('Le prix convenu doit être un nombre positif'),
  
  gererErreursValidation
];

/**
 * Validations pour les avis
 */
const validerCreationAvis = [
  body('idReservation')
    .isUUID()
    .withMessage('ID réservation invalide'),
  
  body('auteurId')
    .isUUID()
    .withMessage('ID auteur invalide'),
  
  body('cibleId')
    .isUUID()
    .withMessage('ID cible invalide'),
  
  body('note_globale')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note globale doit être entre 1 et 5'),
  
  body('note_repas')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note repas doit être entre 1 et 5'),
  
  body('note_ponctualite')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note ponctualité doit être entre 1 et 5'),
  
  body('note_convivialite')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note convivialité doit être entre 1 et 5'),
  
  body('commentaire')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Le commentaire ne peut pas dépasser 500 caractères'),
  
  gererErreursValidation
];

/**
 * Validations pour les messages
 */
const validerCreationMessage = [
  body('idSalle')
    .isUUID()
    .withMessage('ID salle invalide'),
  
  body('idEmetteur')
    .isUUID()
    .withMessage('ID émetteur invalide'),
  
  body('contenu')
    .notEmpty()
    .withMessage('Le contenu du message est requis')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Le contenu doit contenir entre 1 et 1000 caractères'),
  
  gererErreursValidation
];

/**
 * Validations pour les paramètres d'URL
 */
const validerIdParam = [
  param('id')
    .isUUID()
    .withMessage('ID invalide'),
  
  gererErreursValidation
];

/**
 * Validations pour la pagination
 */
const validerPagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  
  gererErreursValidation
];

module.exports = {
  gererErreursValidation,
  validerCreationUtilisateur,
  validerConnexion,
  validerCreationOffre,
  validerCreationReservation,
  validerCreationAvis,
  validerCreationMessage,
  validerIdParam,
  validerPagination
};
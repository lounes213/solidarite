const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const { validerMessage } = require('../validators/chat.validator');
const { emettreMessageAuxUtilisateurs } = require('../socket/chat.socket');

/**
 * Créer un nouveau message dans une conversation
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
const creerMessage = async (req, res) => {
    try {
        // Validation du corps de la requête
        const { error } = validerMessage(req.body);
        if (error) {
            return res.status(400).json({ erreur: error.details[0].message });
        }

        const { conversationId, expediteurId, contenu } = req.body;

        // Vérifier si la conversation existe
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ erreur: 'Conversation non trouvée' });
        }

        // Vérifier que l'expéditeur fait partie de la conversation
        if (!conversation.participants.includes(expediteurId)) {
            return res.status(403).json({ erreur: "L'utilisateur ne fait pas partie de cette conversation" });
        }

        // Créer et sauvegarder le message
        const nouveauMessage = new Message({
            conversationId,
            expediteurId,
            contenu,
            dateEnvoi: new Date()
        });

        const messageSauvegarde = await nouveauMessage.save();

        // Mettre à jour la date du dernier message dans la conversation
        conversation.dernierMessage = new Date();
        await conversation.save();

        // Émettre l'événement en temps réel aux participants
        emettreMessageAuxUtilisateurs(conversation.participants, messageSauvegarde);

        res.status(201).json({
            message: 'Message créé avec succès !',
            donnees: messageSauvegarde
        });
    } catch (erreur) {
        console.error('Erreur lors de la création du message :', erreur);
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
};

/**
 * Lister tous les messages d'une conversation
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
const listerMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limite = 20 } = req.query;

        // Vérifier si la conversation existe
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ erreur: 'Conversation non trouvée' });
        }

        // Vérifier que l'utilisateur fait partie de la conversation
        if (!conversation.participants.includes(req.utilisateur._id)) {
            return res.status(403).json({ erreur: 'Non autorisé à voir ces messages' });
        }

        // Récupérer les messages paginés
        const messages = await Message.find({ conversationId })
            .sort({ dateEnvoi: -1 })
            .skip((page - 1) * limite)
            .limit(parseInt(limite))
            .populate('expediteurId', 'prenom nom avatar');

        res.json({
            message: 'Messages récupérés avec succès !',
            donnees: messages,
            pagination: {
                page: parseInt(page),
                limite: parseInt(limite),
                total: await Message.countDocuments({ conversationId })
            }
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération des messages :', erreur);
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
};

/**
 * Récupérer un message spécifique par son ID
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
const recupererMessageParId = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId)
            .populate('expediteurId', 'prenom nom avatar');

        if (!message) {
            return res.status(404).json({ erreur: 'Message non trouvé' });
        }

        // Vérifier que l'utilisateur fait partie de la conversation
        const conversation = await Conversation.findById(message.conversationId);
        if (!conversation.participants.includes(req.utilisateur._id)) {
            return res.status(403).json({ erreur: 'Non autorisé à voir ce message' });
        }

        res.json({
            message: 'Message récupéré avec succès !',
            donnees: message
        });
    } catch (erreur) {
        console.error('Erreur lors de la récupération du message :', erreur);
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
};

/**
 * Mettre à jour un message
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
const mettreAJourMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { contenu } = req.body;

        // Valider le contenu
        if (!contenu || contenu.trim() === '') {
            return res.status(400).json({ erreur: 'Le contenu du message est requis' });
        }

        // Trouver et mettre à jour le message
        const message = await Message.findByIdAndUpdate(
            messageId,
            { contenu, estModifie: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ erreur: 'Message non trouvé' });
        }

        // Vérifier que l'utilisateur est l'expéditeur
        if (message.expediteurId.toString() !== req.utilisateur._id.toString()) {
            return res.status(403).json({ erreur: 'Non autorisé à modifier ce message' });
        }

        // Émettre la mise à jour aux participants
        const conversation = await Conversation.findById(message.conversationId);
        emettreMessageAuxUtilisateurs(conversation.participants, {
            action: 'miseAJour',
            message: message
        });

        res.json({
            message: 'Message mis à jour avec succès !',
            donnees: message
        });
    } catch (erreur) {
        console.error('Erreur lors de la mise à jour du message :', erreur);
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
};

/**
 * Supprimer un message (suppression douce)
 * @param {Object} req - Objet requête Express
 * @param {Object} res - Objet réponse Express
 */
const supprimerMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // Trouver et "soft delete" le message
        const message = await Message.findByIdAndUpdate(
            messageId,
            { estSupprime: true, dateSuppression: new Date() },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ erreur: 'Message non trouvé' });
        }

        // Vérifier que l'utilisateur est l'expéditeur ou un admin
        if (message.expediteurId.toString() !== req.utilisateur._id.toString() && !req.utilisateur.estAdmin) {
            return res.status(403).json({ erreur: 'Non autorisé à supprimer ce message' });
        }

        // Émettre la suppression aux participants
        const conversation = await Conversation.findById(message.conversationId);
        emettreMessageAuxUtilisateurs(conversation.participants, {
            action: 'suppression',
            messageId: message._id
        });

        res.json({
            message: 'Message supprimé avec succès !',
            donnees: message
        });
    } catch (erreur) {
        console.error('Erreur lors de la suppression du message :', erreur);
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
};

module.exports = {
    creerMessage,
    listerMessages,
    recupererMessageParId,
    mettreAJourMessage,
    supprimerMessage
};
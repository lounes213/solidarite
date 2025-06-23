const { SalleDeChat, Message, Utilisateur } = require('../models');
const { Op } = require('sequelize');

const creerSalleDeChat = async (req, res) => {
  try {
    const { nom, type = 'individuel', participantIds } = req.body;

    // Validation des champs requis
    if (!nom || !participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Le nom et la liste des participants sont requis."
      });
    }

    // Validation du type
    if (!['individuel', 'groupe'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Le type doit être 'individuel' ou 'groupe'."
      });
    }

    // Vérifier que tous les participants existent
    const participants = await Utilisateur.findAll({
      where: {
        id: {
          [Op.in]: participantIds
        }
      }
    });

    if (participants.length !== participantIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Un ou plusieurs participants n\'existent pas'
      });
    }

    // Pour les chats individuels, vérifier qu'il n'y a que 2 participants
    if (type === 'individuel' && participantIds.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Un chat individuel doit avoir exactement 2 participants'
      });
    }

    // Vérifier si une salle de chat individuelle existe déjà entre ces utilisateurs
    if (type === 'individuel') {
      const salleExistante = await SalleDeChat.findOne({
        where: { type: 'individuel' },
        include: [
          {
            model: Utilisateur,
            as: 'participants',
            where: {
              id: {
                [Op.in]: participantIds
              }
            }
          }
        ]
      });

      if (salleExistante) {
        return res.status(409).json({
          success: false,
          message: 'Une conversation individuelle existe déjà entre ces utilisateurs'
        });
      }
    }

    // Créer la salle de chat
    const nouvelleSalle = await SalleDeChat.create({
      nom,
      type
    });

    // Ajouter les participants
    await nouvelleSalle.setParticipants(participantIds);

    // Récupérer la salle avec les participants
    const salleComplete = await SalleDeChat.findByPk(nouvelleSalle.id, {
      include: [
        {
          model: Utilisateur,
          as: 'participants',
          attributes: ['id', 'nom', 'email', 'photoProfil']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Salle de chat créée avec succès!',
      data: salleComplete
    });

  } catch (error) {
    console.error('Erreur lors de la création de la salle de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la salle de chat',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listerSallesDeChat = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID utilisateur est requis'
      });
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les salles de chat de l'utilisateur
    const { count, rows: salles } = await SalleDeChat.findAndCountAll({
      include: [
        {
          model: Utilisateur,
          as: 'participants',
          where: { id: userId },
          attributes: []
        },
        {
          model: Utilisateur,
          as: 'participants',
          attributes: ['id', 'nom', 'photoProfil']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['dateEnvoi', 'DESC']],
          required: false,
          include: [
            {
              model: Utilisateur,
              as: 'emetteur',
              attributes: ['id', 'nom']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['dernierMessage', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Salles de chat récupérées avec succès!',
      data: {
        salles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des salles de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des salles de chat',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const creerMessage = async (req, res) => {
  try {
    const { idSalle, idEmetteur, contenu } = req.body;

    // Validation des champs requis
    if (!idSalle || !idEmetteur || !contenu) {
      return res.status(400).json({
        success: false,
        message: "L'ID de la salle, l'ID de l'émetteur et le contenu sont requis."
      });
    }

    // Vérifier que la salle de chat existe
    const salle = await SalleDeChat.findByPk(idSalle, {
      include: [
        {
          model: Utilisateur,
          as: 'participants'
        }
      ]
    });

    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle de chat non trouvée'
      });
    }

    // Vérifier que l'émetteur fait partie de la salle
    const estParticipant = salle.participants.some(p => p.id === idEmetteur);
    if (!estParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne faites pas partie de cette conversation'
      });
    }

    // Créer le message
    const nouveauMessage = await Message.create({
      idSalle,
      idEmetteur,
      contenu
    });

    // Mettre à jour la date du dernier message dans la salle
    await salle.update({
      dernierMessage: new Date()
    });

    // Récupérer le message avec l'émetteur
    const messageComplet = await Message.findByPk(nouveauMessage.id, {
      include: [
        {
          model: Utilisateur,
          as: 'emetteur',
          attributes: ['id', 'nom', 'photoProfil']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès!',
      data: messageComplet
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listerMessages = async (req, res) => {
  try {
    const { idSalle } = req.params;
    const { page = 1, limit = 50, userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID utilisateur est requis'
      });
    }

    // Vérifier que la salle existe et que l'utilisateur en fait partie
    const salle = await SalleDeChat.findByPk(idSalle, {
      include: [
        {
          model: Utilisateur,
          as: 'participants',
          where: { id: userId },
          attributes: []
        }
      ]
    });

    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle de chat non trouvée ou accès non autorisé'
      });
    }

    // Calculer l'offset pour la pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les messages
    const { count, rows: messages } = await Message.findAndCountAll({
      where: { idSalle },
      include: [
        {
          model: Utilisateur,
          as: 'emetteur',
          attributes: ['id', 'nom', 'photoProfil']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['dateEnvoi', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Messages récupérés avec succès!',
      data: {
        messages: messages.reverse(), // Inverser pour avoir les plus anciens en premier
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const supprimerMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID utilisateur est requis'
      });
    }

    // Vérifier que le message existe
    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'émetteur du message
    if (message.idEmetteur !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez supprimer que vos propres messages'
      });
    }

    // Supprimer le message
    await message.destroy();

    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès!'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const recupererSalleParId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID utilisateur est requis'
      });
    }

    // Récupérer la salle avec vérification d'accès
    const salle = await SalleDeChat.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: 'participants',
          attributes: ['id', 'nom', 'email', 'photoProfil']
        }
      ]
    });

    if (!salle) {
      return res.status(404).json({
        success: false,
        message: 'Salle de chat non trouvée'
      });
    }

    // Vérifier que l'utilisateur fait partie de la salle
    const estParticipant = salle.participants.some(p => p.id === userId);
    if (!estParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette conversation'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salle de chat récupérée avec succès!',
      data: salle
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la salle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  creerSalleDeChat,
  listerSallesDeChat,
  creerMessage,
  listerMessages,
  supprimerMessage,
  recupererSalleParId
};
const creerMessage = (req, res)=>{
    res.json({message: 'Message créé avec succès!'});
};

const listerMessages = (req, res)=>{
    res.json({message: 'Messages lister avec succès!'});
};

const recupererMessageParId = (req, res)=>{
    res.json({message: 'Message récupéré avec succès!'});
};

const mettreAJourMessage = (req, res)=>{
    res.json({message: 'Message mis à jour avec succès!'});
};

const supprimerMessage = (req, res)=>{
    res.json({message: 'Message supprimé avec succès!'});
};

module.exports = {
    creerMessage,
    listerMessages,
    recupererMessageParId,
    mettreAJourMessage,
    supprimerMessage
    
}

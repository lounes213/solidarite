const creerAvis = (req, res)=>{
    res.json({message: 'Avis créé avec succès!'});
};

const listerAvis = (req, res)=>{
    res.json({message: 'Avis lister avec succès!'});
};

const recupererAvisParId = (req, res)=>{
    res.json({message: 'Avis récupéré avec succès!'});
};

const mettreAJourAvis = (req, res)=>{
    res.json({message: 'Avis mis à jour avec succès!'});
};

const supprimerAvis = (req, res)=>{
    res.json({message: 'Avis supprimé avec succès!'});
};

module.exports = {
    creerAvis,
    listerAvis,
    recupererAvisParId,
    mettreAJourAvis,
    supprimerAvis
    
}

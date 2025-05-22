const creerUtilisateur = (req, res)=>{
    res.json({message: 'Utilisateur créé avec succès!'});
};

const listerUtilisateurs = (req, res)=>{
    res.json({message: 'Utilisateurs lister avec succès!'});
};

const recupererUtilisateurParId = (req, res)=>{
    res.json({message: 'Utilisateur récupéré avec succès!'});
};

const mettreAJourUtilisateur = (req, res)=>{
    res.json({message: 'Utilisateur mis à jour avec succès!'});
};

const supprimerUtilisateur = (req, res)=>{
    res.json({message: 'Utilisateur supprimé avec succès!'});
};

module.exports = {
    creerUtilisateur,
    listerUtilisateurs,
    recupererUtilisateurParId,
    mettreAJourUtilisateur,
    supprimerUtilisateur
}

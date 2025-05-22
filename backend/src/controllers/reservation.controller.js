const creerReservation = (req, res)=>{
    res.json({message: 'Reservation créée avec succès!'});
};

const listerReservations = (req, res)=>{
    res.json({message: 'Reservations lister avec succès!'});
};

const recupererReservationParId = (req, res)=>{
    res.json({message: 'Reservation récupérée avec succès!'});
};

const mettreAJourReservation = (req, res)=>{
    res.json({message: 'Reservation mise à jour avec succès!'});
};

const supprimerReservation = (req, res)=>{
    res.json({message: 'Reservation supprimée avec succès!'});
};

module.exports = {
    creerReservation,
    listerReservations,
    recupererReservationParId,
    mettreAJourReservation,
    supprimerReservation
    
}

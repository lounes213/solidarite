const creerOffre = (request, response) => {
  try {
    response.status(201).json({ message: 'Offre créée avec succès!' });
  } catch (error) {
    response.status(500).json({ message: 'Erreur lors de la création de l\'offre', error: error.message });
  }
};

const listerOffres = (request, response) => {
  try {
    response.status(200).json({ message: 'Liste des offres récupérée avec succès!' });
  } catch (error) {
    response.status(500).json({ message: 'Erreur lors de la récupération des offres', error: error.message });
  }
};

const recupererOffreParId = (request, response) => {
  try {
    const { id } = request.params;
    response.status(200).json({ message: `Offre avec l'ID ${id} récupérée avec succès` });
  } catch (error) {
    response.status(500).json({ message: 'Erreur lors de la récupération de l\'offre', error: error.message });
  }
};

const mettreAJourOffre = (request, response) => {
  try {
    const { id } = request.params;
    response.status(200).json({ message: `Offre avec l'ID ${id} mise à jour avec succès` });
  } catch (error) {
    response.status(500).json({ message: 'Erreur lors de la mise à jour de l\'offre', error: error.message });
  }
};

const supprimerOffre = (request, response) => {
  try {
    const { id } = request.params;
    response.status(200).json({ message: `Offre avec l'ID ${id} supprimée avec succès` });
  } catch (error) {
    response.status(500).json({ message: 'Erreur lors de la suppression de l\'offre', error: error.message });
  }
};

module.exports = {
  creerOffre,
  listerOffres,
  recupererOffreParId,
  mettreAJourOffre,
  supprimerOffre
}; 
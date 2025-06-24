const { Utilisateur, Offre, Reservation, Avis } = require('../models');
const bcrypt = require('bcrypt');

const seedDemoData = async () => {
  try {
    console.log('🌱 Début du seeding des données de démonstration...');

    // Créer des utilisateurs de démonstration
    const hotePassword = await bcrypt.hash('password123', 10);
    const etudiantPassword = await bcrypt.hash('password123', 10);

    const hote = await Utilisateur.create({
      id: '11111111-1111-1111-1111-111111111111',
      nom: 'Marie Dupont',
      email: 'marie.dupont@example.com',
      telephone: '0612345678',
      role: 'hote',
      motDePasse: hotePassword,
      adresse: '15 rue de la Paix',
      ville: 'Paris',
      codePostal: '75005',
      biographie: 'Passionnée de cuisine, j\'aime partager mes repas avec des étudiants.',
      estVerifie: true
    });

    const etudiant = await Utilisateur.create({
      id: '22222222-2222-2222-2222-222222222222',
      nom: 'Paul Martin',
      email: 'paul.martin@example.com',
      telephone: '0698765432',
      role: 'etudiant',
      motDePasse: etudiantPassword,
      adresse: '25 boulevard Saint-Michel',
      ville: 'Paris',
      codePostal: '75005',
      biographie: 'Étudiant en informatique, toujours à la recherche de bons repas !',
      estVerifie: true
    });

    const hote2 = await Utilisateur.create({
      nom: 'Sophie Leroy',
      email: 'sophie.leroy@example.com',
      telephone: '0687654321',
      role: 'hote',
      motDePasse: hotePassword,
      adresse: '8 avenue des Gobelins',
      ville: 'Paris',
      codePostal: '75013',
      biographie: 'Retraitée, j\'adore cuisiner pour les jeunes.',
      estVerifie: true
    });

    const etudiant2 = await Utilisateur.create({
      nom: 'Emma Dubois',
      email: 'emma.dubois@example.com',
      telephone: '0634567890',
      role: 'etudiant',
      motDePasse: etudiantPassword,
      adresse: '12 rue Mouffetard',
      ville: 'Paris',
      codePostal: '75005',
      biographie: 'Étudiante en médecine, j\'apprécie les moments conviviaux.',
      estVerifie: true
    });

    console.log('✅ Utilisateurs créés');

    // Créer des offres de démonstration
    const offre1 = await Offre.create({
      id: '33333333-3333-3333-3333-333333333333',
      idHote: hote.id,
      type: 'invitation',
      titre: 'Dîner convivial chez Marie',
      description: 'Invitation à dîner pour casser la solitude. Menu traditionnel français avec entrée, plat et dessert. Ambiance chaleureuse garantie !',
      localisation: 'Paris 5e - Quartier Latin',
      coordonneesGPS: '48.8534,2.3488',
      disponible_depuis: new Date(),
      date_expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      capacite_max: 4,
      est_active: true
    });

    const offre2 = await Offre.create({
      id: '44444444-4444-4444-4444-444444444444',
      idHote: hote.id,
      type: 'panier',
      titre: 'Panier anti-gaspi du mercredi',
      prix_min: 1.00,
      prix_max: 3.00,
      prix_defini_par_app: true,
      description: 'Panier anti-gaspi du mercredi soir. Légumes de saison, fruits et parfois des restes de bons petits plats maison.',
      localisation: 'Paris 5e - Quartier Latin',
      coordonneesGPS: '48.8534,2.3488',
      disponible_depuis: new Date(),
      capacite_max: 2,
      est_active: true
    });

    const offre3 = await Offre.create({
      idHote: hote2.id,
      type: 'invitation',
      titre: 'Brunch du dimanche chez Sophie',
      description: 'Brunch dominical dans une ambiance familiale. Viennoiseries maison, confitures, œufs brouillés et bonne humeur !',
      localisation: 'Paris 13e - Gobelins',
      coordonneesGPS: '48.8356,2.3539',
      disponible_depuis: new Date(),
      date_expiration: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 jours
      capacite_max: 6,
      est_active: true
    });

    const offre4 = await Offre.create({
      idHote: hote2.id,
      type: 'panier',
      titre: 'Panier de légumes bio',
      prix_fixe: 5.00,
      description: 'Panier de légumes bio de saison. Parfait pour les étudiants qui veulent manger sainement sans se ruiner.',
      localisation: 'Paris 13e - Gobelins',
      coordonneesGPS: '48.8356,2.3539',
      disponible_depuis: new Date(),
      capacite_max: 3,
      est_active: true
    });

    console.log('✅ Offres créées');

    // Créer des réservations de démonstration
    const reservation1 = await Reservation.create({
      id: '55555555-5555-5555-5555-555555555555',
      idOffre: offre2.id,
      idEtudiant: etudiant.id,
      prix_convenu: 2.00,
      statut: 'confirmed'
    });

    const reservation2 = await Reservation.create({
      idOffre: offre3.id,
      idEtudiant: etudiant2.id,
      prix_convenu: 0.00,
      statut: 'confirmed'
    });

    const reservation3 = await Reservation.create({
      idOffre: offre1.id,
      idEtudiant: etudiant2.id,
      prix_convenu: 0.00,
      statut: 'pending'
    });

    console.log('✅ Réservations créées');

    // Créer des avis de démonstration
    const avis1 = await Avis.create({
      id: '66666666-6666-6666-6666-666666666666',
      idReservation: reservation1.id,
      auteurId: etudiant.id,
      cibleId: hote.id,
      note_globale: 5,
      note_repas: 5,
      note_ponctualite: 5,
      note_convivialite: 5,
      commentaire: 'Super repas et très bonne ambiance ! Marie est une hôte formidable, je recommande vivement.'
    });

    const avis2 = await Avis.create({
      idReservation: reservation2.id,
      auteurId: etudiant2.id,
      cibleId: hote2.id,
      note_globale: 4,
      note_repas: 5,
      note_ponctualite: 4,
      note_convivialite: 4,
      commentaire: 'Excellent brunch ! Sophie cuisine très bien et l\'ambiance était très conviviale.'
    });

    // Avis de l'hôte vers l'étudiant
    const avis3 = await Avis.create({
      idReservation: reservation1.id,
      auteurId: hote.id,
      cibleId: etudiant.id,
      note_globale: 5,
      note_repas: 5,
      note_ponctualite: 5,
      note_convivialite: 5,
      commentaire: 'Paul est un invité parfait ! Ponctuel, poli et très agréable. J\'espère le revoir bientôt.'
    });

    console.log('✅ Avis créés');

    console.log('🎉 Seeding terminé avec succès !');
    console.log('\n📧 Comptes de démonstration créés :');
    console.log('Hôte 1: marie.dupont@example.com / password123');
    console.log('Hôte 2: sophie.leroy@example.com / password123');
    console.log('Étudiant 1: paul.martin@example.com / password123');
    console.log('Étudiant 2: emma.dubois@example.com / password123');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
};

module.exports = { seedDemoData };
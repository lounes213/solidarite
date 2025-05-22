INSERT INTO UTILISATEURS (id, nom, email, telephone, role, createdAt) VALUES
('11111111-1111-1111-1111-111111111111', 'Dupont Marie', 
'marie.dupont@example.com', '0612345678', 'hote', NOW()),
('22222222-2222-2222-2222-222222222222', 'Martin Paul', 'paul.martin@example.com', 
'0698765432', 'etudiant', NOW());
INSERT INTO OFFRES (id, idHote, type, prix_min, prix_max, prix_fixe, 
prix_defini_par_app, description, localisation, disponible_depuis) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-
111111111111', 'invitation', NULL, NULL, NULL, FALSE, 'Invitation à dîner pour casser la 
solitude.', 'Paris 5e', NOW()),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-
111111111111', 'panier', 1.00, 3.00, NULL, TRUE, 'Panier anti-gaspi du mercredi soir.', 
'Paris 5e', NOW());
INSERT INTO RESERVATIONS (id, idOffre, idEtudiant, prix_convenu, statut, createdAt) 
VALUES
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-
444444444444', '22222222-2222-2222-2222-222222222222', 2.00, 'pending', NOW());
INSERT INTO AVIS (id, idReservation, auteurId, cibleId, note_globale, note_repas, 
note_ponctualite, note_convivialite, commentaire, createdAt) VALUES
('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-
555555555555', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-
1111-111111111111', 5, 5, 5, 5, 'Super repas et très bonne ambiance !', NOW());
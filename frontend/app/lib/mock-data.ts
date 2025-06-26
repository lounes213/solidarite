import type { Offre, Utilisateur } from './api';

// Mock data for testing the UI
export const mockUtilisateurs: Utilisateur[] = [
  {
    id: '1',
    nom: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    telephone: '0612345678',
    role: 'hote',
    adresse: '123 Rue de Paris',
    ville: 'Paris',
    codePostal: '75001',
    coordonneesGPS: '48.8566,2.3522',
    photoProfil: 'https://randomuser.me/api/portraits/men/1.jpg',
    biographie: 'Hôte passionné par le partage et l\'entraide.',
    estVerifie: true,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z'
  },
  {
    id: '2',
    nom: 'Marie Martin',
    email: 'marie.martin@example.com',
    telephone: '0687654321',
    role: 'hote',
    adresse: '456 Avenue des Champs-Élysées',
    ville: 'Paris',
    codePostal: '75008',
    coordonneesGPS: '48.8738,2.2950',
    photoProfil: 'https://randomuser.me/api/portraits/women/2.jpg',
    biographie: 'Passionnée de cuisine, j\'aime partager mes repas avec des étudiants.',
    estVerifie: true,
    createdAt: '2023-02-20T14:45:00Z',
    updatedAt: '2023-02-20T14:45:00Z'
  },
  {
    id: '3',
    nom: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    telephone: '0698765432',
    role: 'etudiant',
    ville: 'Lyon',
    codePostal: '69001',
    photoProfil: 'https://randomuser.me/api/portraits/men/3.jpg',
    biographie: 'Étudiant en informatique à la recherche de bons plans.',
    estVerifie: false,
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z'
  }
];

export const mockOffres: Offre[] = [
  {
    id: '1',
    idHote: '1',
    type: 'invitation',
    titre: 'Dîner convivial chez l\'habitant',
    prix_fixe: 15,
    prix_defini_par_app: false,
    description: 'Je vous invite à partager un dîner fait maison dans une ambiance chaleureuse. Menu: entrée, plat, dessert et boisson. Idéal pour les étudiants qui souhaitent un repas équilibré et une bonne compagnie.',
    localisation: 'Paris 1er',
    coordonneesGPS: '48.8566,2.3522',
    disponible_depuis: '2023-04-01T18:00:00Z',
    date_expiration: '2023-12-31T23:59:59Z',
    capacite_max: 4,
    est_active: true,
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    ],
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2023-03-15T10:00:00Z',
    hote: mockUtilisateurs[0]
  },
  {
    id: '2',
    idHote: '2',
    type: 'panier',
    titre: 'Panier de légumes bio de saison',
    prix_min: 10,
    prix_max: 20,
    prix_defini_par_app: true,
    description: 'Panier de légumes frais et bio cultivés dans mon jardin. Contenu variable selon la saison. Parfait pour les étudiants qui veulent manger sainement à petit prix.',
    localisation: 'Paris 8ème',
    coordonneesGPS: '48.8738,2.2950',
    disponible_depuis: '2023-04-05T09:00:00Z',
    capacite_max: 10,
    est_active: true,
    photos: [
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1567306226408-c302e9a70be7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    ],
    createdAt: '2023-04-01T14:30:00Z',
    updatedAt: '2023-04-01T14:30:00Z',
    hote: mockUtilisateurs[1]
  },
  {
    id: '3',
    idHote: '1',
    type: 'invitation',
    titre: 'Brunch du dimanche',
    prix_fixe: 12,
    prix_defini_par_app: false,
    description: 'Venez profiter d\'un brunch copieux tous les dimanches: viennoiseries, œufs, fruits frais, jus pressés, café/thé. Ambiance détendue et conviviale.',
    localisation: 'Paris 1er',
    coordonneesGPS: '48.8566,2.3522',
    disponible_depuis: '2023-04-02T10:00:00Z',
    date_expiration: '2023-12-31T23:59:59Z',
    capacite_max: 6,
    est_active: true,
    photos: [
      'https://images.unsplash.com/photo-1533920379810-6bedac9e31e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    ],
    createdAt: '2023-03-20T11:45:00Z',
    updatedAt: '2023-03-20T11:45:00Z',
    hote: mockUtilisateurs[0]
  },
  {
    id: '4',
    idHote: '2',
    type: 'panier',
    titre: 'Panier repas complet',
    prix_fixe: 8,
    prix_defini_par_app: false,
    description: 'Panier repas équilibré préparé avec soin: sandwich maison, salade, fruit et dessert fait maison. Idéal pour les étudiants pressés qui veulent bien manger.',
    localisation: 'Paris 8ème',
    coordonneesGPS: '48.8738,2.2950',
    disponible_depuis: '2023-04-10T11:30:00Z',
    date_expiration: '2023-05-10T23:59:59Z',
    capacite_max: 15,
    est_active: true,
    photos: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    ],
    createdAt: '2023-04-05T16:20:00Z',
    updatedAt: '2023-04-05T16:20:00Z',
    hote: mockUtilisateurs[1]
  },
  {
    id: '5',
    idHote: '1',
    type: 'invitation',
    titre: 'Soirée pizza maison',
    prix_fixe: 10,
    prix_defini_par_app: false,
    description: 'Soirée conviviale autour de pizzas faites maison. Plusieurs choix de garnitures disponibles. Boissons incluses. Venez passer un bon moment et rencontrer d\'autres étudiants!',
    localisation: 'Paris 1er',
    coordonneesGPS: '48.8566,2.3522',
    disponible_depuis: '2023-04-15T19:00:00Z',
    date_expiration: '2023-12-31T23:59:59Z',
    capacite_max: 8,
    est_active: true,
    photos: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    ],
    createdAt: '2023-04-10T09:30:00Z',
    updatedAt: '2023-04-10T09:30:00Z',
    hote: mockUtilisateurs[0]
  },
  {
    id: '6',
    idHote: '2',
    type: 'panier',
    titre: 'Panier petit-déjeuner',
    prix_fixe: 6,
    prix_defini_par_app: false,
    description: 'Panier petit-déjeuner avec viennoiseries fraîches, confiture maison, jus de fruits frais et thermos de café ou thé. Parfait pour bien commencer la journée!',
    localisation: 'Paris 8ème',
    coordonneesGPS: '48.8738,2.2950',
    disponible_depuis: '2023-04-20T07:00:00Z',
    date_expiration: '2023-05-20T23:59:59Z',
    capacite_max: 20,
    est_active: true,
    photos: [
      'https://images.unsplash.com/photo-1533089860892-a9b969df67a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    ],
    createdAt: '2023-04-15T15:10:00Z',
    updatedAt: '2023-04-15T15:10:00Z',
    hote: mockUtilisateurs[1]
  }
];
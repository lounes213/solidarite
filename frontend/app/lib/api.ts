// API service for fetching data from the backend

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3000/api';

// Interface for Offre (Offer) data
export interface Offre {
  id: string;
  idHote: string;
  type: 'invitation' | 'panier';
  titre: string;
  prix_min?: number;
  prix_max?: number;
  prix_fixe?: number;
  prix_defini_par_app: boolean;
  description: string;
  localisation: string;
  coordonneesGPS?: string;
  disponible_depuis: string;
  date_expiration?: string;
  capacite_max?: number;
  est_active: boolean;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  hote?: Utilisateur;
}

// Interface for Utilisateur (User) data
export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: 'etudiant' | 'hote';
  adresse?: string;
  ville?: string;
  codePostal?: string;
  coordonneesGPS?: string;
  photoProfil?: string;
  biographie?: string;
  estVerifie: boolean;
  createdAt: string;
  updatedAt: string;
}

// Import mock data for development
import { mockOffres, mockUtilisateurs } from './mock-data';

// Flag to determine whether to use mock data or real API
const USE_MOCK_DATA = true;

// Fetch all offers
export async function fetchOffres(): Promise<Offre[]> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockOffres;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/offres`);
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

// Fetch a single offer by ID
export async function fetchOffreById(id: string): Promise<Offre | null> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const offer = mockOffres.find(o => o.id === id);
    return offer || null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/offres/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch offer');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching offer with ID ${id}:`, error);
    return null;
  }
}

// Fetch all users
export async function fetchUtilisateurs(): Promise<Utilisateur[]> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockUtilisateurs;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/utilisateurs`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Fetch a single user by ID
export async function fetchUtilisateurById(id: string): Promise<Utilisateur | null> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUtilisateurs.find(u => u.id === id);
    return user || null;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/utilisateurs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
}
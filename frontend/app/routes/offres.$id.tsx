import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Route } from "./+types/offres.$id";
import { Navbar } from "../components/ui/navbar";
import { Button } from "../components/ui/button";
import { OfferDetailSkeleton } from "../components/offer-detail-skeleton";
import { fetchOffreById, fetchUtilisateurById, type Offre, type Utilisateur } from "../lib/api";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Solidaire - Détails de l'offre ${params.id}` },
    { name: "description", content: "Détails de l'offre sur Solidaire" },
  ];
}

export default function OffreDetail() {
  const { id } = useParams();
  const [offer, setOffer] = useState<Offre | null>(null);
  const [host, setHost] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOfferDetails() {
      if (!id) {
        setError("ID de l'offre non spécifié");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const offerData = await fetchOffreById(id);
        
        if (!offerData) {
          setError("Offre non trouvée");
          setLoading(false);
          return;
        }
        
        setOffer(offerData);
        
        // If the offer doesn't include the host data, fetch it separately
        if (!offerData.hote && offerData.idHote) {
          const hostData = await fetchUtilisateurById(offerData.idHote);
          setHost(hostData);
        }
        
        setError(null);
      } catch (err) {
        setError("Impossible de charger les détails de l'offre. Veuillez réessayer plus tard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadOfferDetails();
  }, [id]);

  // Format the price display based on available price data
  const formatPrice = () => {
    if (!offer) return "";
    
    if (offer.prix_fixe) {
      return `${offer.prix_fixe} €`;
    } else if (offer.prix_min && offer.prix_max) {
      return `${offer.prix_min} € - ${offer.prix_max} €`;
    } else if (offer.prix_min) {
      return `À partir de ${offer.prix_min} €`;
    } else if (offer.prix_max) {
      return `Jusqu'à ${offer.prix_max} €`;
    } else {
      return "Prix non défini";
    }
  };

  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const hostInfo = offer?.hote || host;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {loading ? (
          <OfferDetailSkeleton />
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              asChild
            >
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        ) : offer ? (
          <div>
            <div className="mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">← Retour aux offres</Link>
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image gallery */}
              <div className="relative h-80 bg-gray-200">
                {offer.photos && offer.photos.length > 0 ? (
                  <img
                    src={offer.photos[0]}
                    alt={offer.titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Aucune image disponible
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                  {offer.type === 'invitation' ? 'Invitation' : 'Panier'}
                </div>
              </div>
              
              {/* Thumbnails if there are multiple photos */}
              {offer.photos && offer.photos.length > 1 && (
                <div className="flex overflow-x-auto p-2 gap-2">
                  {offer.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${offer.titre} - photo ${index + 1}`}
                      className="h-20 w-20 object-cover rounded cursor-pointer"
                    />
                  ))}
                </div>
              )}
              
              {/* Offer details */}
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{offer.titre}</h1>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600">{offer.localisation}</p>
                  <p className="text-2xl font-semibold text-blue-600">{formatPrice()}</p>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{offer.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Détails de l'offre</h2>
                    <ul className="space-y-2 text-gray-700">
                      <li><span className="font-medium">Disponible depuis:</span> {formatDate(offer.disponible_depuis)}</li>
                      {offer.date_expiration && (
                        <li><span className="font-medium">Expire le:</span> {formatDate(offer.date_expiration)}</li>
                      )}
                      {offer.capacite_max && (
                        <li><span className="font-medium">Capacité maximale:</span> {offer.capacite_max} personnes</li>
                      )}
                      <li><span className="font-medium">Statut:</span> {offer.est_active ? 'Active' : 'Inactive'}</li>
                    </ul>
                  </div>
                  
                  {hostInfo && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">À propos de l'hôte</h2>
                      <div className="flex items-center mb-3">
                        <img
                          src={hostInfo.photoProfil || "https://via.placeholder.com/50?text=?"}
                          alt={hostInfo.nom}
                          className="w-12 h-12 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <p className="font-medium">{hostInfo.nom}</p>
                          <p className="text-sm text-gray-600">{hostInfo.ville || ''}</p>
                        </div>
                        {hostInfo.estVerifie && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vérifié</span>
                        )}
                      </div>
                      {hostInfo.biographie && (
                        <p className="text-gray-700 text-sm">{hostInfo.biographie}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <Button className="w-full" size="lg">
                    Réserver cette offre
                  </Button>
                  <div className="text-center mt-4 text-sm text-gray-500">
                    <p>Vous ne serez débité qu'après confirmation de l'hôte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Solidaire. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
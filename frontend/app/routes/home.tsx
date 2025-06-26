import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { Navbar } from "../components/ui/navbar";
import { OfferCard } from "../components/offer-card";
import { OfferCardSkeleton } from "../components/offer-card-skeleton";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { fetchOffres, type Offre } from "../lib/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Solidaire - Accueil" },
    { name: "description", content: "Plateforme de solidarité pour les étudiants et hôtes" },
  ];
}

export default function Home() {
  const [offers, setOffers] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'invitation' | 'panier'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadOffers() {
      try {
        setLoading(true);
        const data = await fetchOffres();
        setOffers(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les offres. Veuillez réessayer plus tard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  // Filter offers based on the active filter and search query
  const filteredOffers = offers
    .filter(offer => activeFilter === 'all' || offer.type === activeFilter)
    .filter(offer => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        offer.titre.toLowerCase().includes(query) ||
        offer.description.toLowerCase().includes(query) ||
        offer.localisation.toLowerCase().includes(query)
      );
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur Solidaire</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez des offres solidaires entre étudiants et hôtes
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher des offres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              Toutes les offres
            </Button>
            <Button 
              variant={activeFilter === 'invitation' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('invitation')}
            >
              Invitations
            </Button>
            <Button 
              variant={activeFilter === 'panier' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('panier')}
            >
              Paniers
            </Button>
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <OfferCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              {searchQuery ? (
                `Aucun résultat trouvé pour "${searchQuery}"`
              ) : activeFilter === 'all' ? (
                "Aucune offre disponible pour le moment."
              ) : (
                `Aucune offre de type "${activeFilter === 'invitation' ? 'invitation' : 'panier'}" disponible pour le moment.`
              )}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {searchQuery && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Effacer la recherche
                </Button>
              )}
              {activeFilter !== 'all' && (
                <Button 
                  variant="outline"
                  onClick={() => setActiveFilter('all')}
                >
                  Voir toutes les offres
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {filteredOffers.length} {filteredOffers.length > 1 ? 'offres trouvées' : 'offre trouvée'}
              {searchQuery && <span> pour "{searchQuery}"</span>}
              {activeFilter !== 'all' && <span> de type {activeFilter}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Solidaire. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

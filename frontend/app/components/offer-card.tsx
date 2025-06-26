import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import type { Offre } from "../lib/api";

interface OfferCardProps {
  offer: Offre;
}

export function OfferCard({ offer }: OfferCardProps) {
  // Format the price display based on available price data
  const formatPrice = () => {
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

  // Get the first photo or use a placeholder
  const mainPhoto = offer.photos && offer.photos.length > 0
    ? offer.photos[0]
    : "https://via.placeholder.com/300x200?text=Pas+d'image";

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={mainPhoto}
          alt={offer.titre}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
          {offer.type === 'invitation' ? 'Invitation' : 'Panier'}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{offer.titre}</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>{offer.localisation}</span>
          <span className="font-semibold text-blue-600">{formatPrice()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3">{offer.description}</p>
        <div className="mt-4 text-xs text-gray-500">
          <p>Disponible depuis: {formatDate(offer.disponible_depuis)}</p>
          {offer.date_expiration && (
            <p>Expire le: {formatDate(offer.date_expiration)}</p>
          )}
          {offer.capacite_max && (
            <p>Capacité max: {offer.capacite_max} personnes</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild className="w-full">
          <Link to={`/offres/${offer.id}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
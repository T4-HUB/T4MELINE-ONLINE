
import "./pioche.css"; // Import CSS for styling
import Carte from "./carte";
import React, { useState, useEffect } from 'react';
import './pioche.css'; // Import CSS for styling
import { Card } from "../utils/types";

const Cartes: Card[] = [
  { thematic: "historique", titre: "Carte 1", type: "type1", detail: "Détails de la carte 1", date: new Date("2023-01-01") },
  { thematic: "historique", titre: "Carte 2", type: "type2", detail: "Détails de la carte 2", date: new Date("2023-02-01") },
  { thematic: "historique", titre: "Carte 3", type: "type3", detail: "Détails de la carte 3", date: new Date("2023-03-01") },
];


export default function Pioche() {
  const [pioche, setPioche] = useState<Card[]>(Cartes);
  const [carteSelectionnee, setCarteSelectionnee] = useState<Card | null>(null);
  const [carteProposee, setCarteProposee] = useState<Card | null>(null);

  // Propose une carte aléatoire dès le montage du composant
  useEffect(() => {
    if (pioche.length > 0) {
      const randomIndex = Math.floor(Math.random() * pioche.length);
      setCarteProposee(pioche[randomIndex]);
    }
  }, [pioche]);

  function drawCard() {
    if (pioche.length === 0) {
      alert("No more cards in the deck!");
      return;
    }

    // Randomly select a card from the pioche

    // Utilise la carte proposée comme carte sélectionnée
    const selectedCard = carteProposee;
    setCarteSelectionnee(selectedCard);

    // Retire la carte sélectionnée de la pioche
    const newPioche = pioche.filter(card => card !== selectedCard);
    setPioche(newPioche);

    // Propose une nouvelle carte aléatoire
    if (newPioche.length > 0) {
      const randomIndex = Math.floor(Math.random() * newPioche.length);
      setCarteProposee(newPioche[randomIndex]);
    } else {
      setCarteProposee(null); // Si la pioche est vide, aucune carte n'est proposée
    }
  }

  return (
    <div className="pioche">
      <h2>Pioche</h2>
      <div className="pioche-layout">
        <div className="pioche-liste">
          <div className="card-back" onClick={drawCard}>
            <Carte carte={carteProposee} isVisible={false} />
          </div>
        </div>

        <div className="selection">
          <h3>Carte sélectionnée</h3>
          <div className="selected-card">
            <Carte carte={carteSelectionnee} isVisible={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

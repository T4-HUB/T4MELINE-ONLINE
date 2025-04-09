import "./pioche.css";
import Carte from "./carte";
import React, { useState, useEffect } from "react";
import { Card } from "../utils/types";

const Cartes: Card[] = [
  {
    id: 1,
    thematic: "historique",
    titre: "Carte 1",
    type: "type1",
    detail: "Détails de la carte 1",
    date: 1945,
  },
  {
    id: 2,
    thematic: "historique",
    titre: "Carte 2",
    type: "type2",
    detail: "Détails de la carte 2",
    date: 1945,
  },
  {
    id: 3,
    thematic: "historique",
    titre: "Carte 3",
    type: "type3",
    detail: "Détails de la carte 3",
    date: 1954,
  },
];

export default function Pioche({
  onAddCarte,
}: {
  onAddCarte: (index: number) => void;
}) {
  const [pioche, setPioche] = useState<Card[]>(Cartes);
  const [carteSelectionnee, setCarteSelectionnee] = useState<Card | null>(null);
  const [carteProposee, setCarteProposee] = useState<Card | null>(null);

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

    const selectedCard = carteProposee;
    setCarteSelectionnee(selectedCard);

    const newPioche = pioche.filter((card) => card !== selectedCard);
    setPioche(newPioche);

    if (newPioche.length > 0) {
      const randomIndex = Math.floor(Math.random() * newPioche.length);
      setCarteProposee(newPioche[randomIndex]);
    } else {
      setCarteProposee(null);
    }

    // Appelle la fonction onAddCarte pour ajouter une carte à la frise
    onAddCarte(0); // Ajoute la carte au début de la frise
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

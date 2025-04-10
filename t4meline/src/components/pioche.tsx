import "./pioche.css";
import Carte from "./carte";
import React, { useState, useEffect } from "react";
import { Card } from "../utils/types";
import { loadCards } from "../utils/loadCards";

export default function Pioche({
  onAddCarte,
  onSelectCarte,
  carteSelectionnee,
}: {
  onAddCarte: (carte: Card) => void;
  onSelectCarte: (carte: Card) => void;
  carteSelectionnee: Card | null;
}) {
  const [pioche, setPioche] = useState<Card[]>([]);

  useEffect(() => {
    async function fetchCards() {
      const loadedCards = await loadCards();
      setPioche(loadedCards);
    }
    fetchCards();
  }, []);

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
    onSelectCarte(selectedCard!);

    const newPioche = pioche.filter((card) => card !== selectedCard);
    setPioche(newPioche);

    if (newPioche.length > 0) {
      const randomIndex = Math.floor(Math.random() * newPioche.length);
      setCarteProposee(newPioche[randomIndex]);
    } else {
      setCarteProposee(null);
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
            {carteSelectionnee ? (
              <Carte carte={carteSelectionnee} isVisible={false} />
            ) : (
              <p>Aucune carte sélectionnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
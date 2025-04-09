
import "./pioche.css"; // Import CSS for styling
import Carte from "./carte";
import React, { useState, useEffect } from 'react';
import './pioche.css'; // Import CSS for styling


export default function Pioche() {
  const [pioche, setPioche] = useState<string[]>(["carte1", "carte2", "carte3", "carte4", "carte5", "carte6", "carte7", "carte8", "carte9", "carte10"]);
  const [carteSelectionnee, setCarteSelectionnee] = useState<string>("");
  const [carteProposee, setCarteProposee] = useState<string>("");

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
      setCarteProposee(""); // Si la pioche est vide, aucune carte n'est proposée
    }
  }

  return (
    <div className="pioche">
      <h2>Pioche</h2>
      <div className="pioche-layout">
        <div className="pioche-liste">
          <div className="card-back" onClick={drawCard}>
            <Carte nom={carteProposee} /> {/* Affiche la carte proposée */}
          </div>
        </div>

        <div className="selection">
          <h3>Carte sélectionnée</h3>
          <div className="selected-card">
            <Carte nom={carteSelectionnee || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}

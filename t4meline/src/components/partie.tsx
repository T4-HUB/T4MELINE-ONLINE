import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Frise from "./frise";
import Pioche from "./pioche";
import Leaderboard from "./players";
import { Card, Player } from "../utils/types";

function Partie() {
  const location = useLocation();
  const { players } = location.state || { players: [] };
  // Initialisez l'état avec une carte par défaut
  const [cartes, setCartes] = useState<Card[]>([
    {
      id: 1,
      titre: "Carte Initiale",
      date: 1900,
      type: "historique",
      thematic: "Thématique Initiale",
      detail: "Ceci est une carte par défaut.",
    },
  ]);

  // État pour la carte sélectionnée
  const [carteSelectionnee, setCarteSelectionnee] = useState<Card | null>(null);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * players.length);
    setCurrentPlayerIndex(randomIndex);
  }, [players]);

  function nextPlayer() {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  }


  function handleAddCarte(carte: Card, index: number, isBefore: boolean) {
    setCartes((oldCartes) => {
      const newCartes = [...oldCartes];
      const insertionIndex = isBefore ? index : index + 1;
      newCartes.splice(insertionIndex, 0, carte); // Insère la carte à l'index spécifié
      return newCartes;
    });
    nextPlayer();
  }

  return (
    <>
      <Leaderboard players={players} />
      <div>
        <h2>Joueur actuel : {players[currentPlayerIndex].name}</h2>
      </div>
      <Frise
        cartes={cartes}
        onAddCarte={(index, isBefore) =>
          carteSelectionnee &&
          handleAddCarte(carteSelectionnee, index, isBefore)
        }
      />
      <Pioche
        onAddCarte={(carte) => handleAddCarte(carte, cartes.length - 1, false)}
        onSelectCarte={setCarteSelectionnee} // Passe la carte sélectionnée à App
      />
    </>
  );
}

export default Partie;

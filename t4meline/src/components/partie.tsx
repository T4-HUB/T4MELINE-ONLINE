import React, { useState } from "react";
import Frise from "./frise";
import Pioche from "./pioche";
import Leaderboard from "./players";
import { Card } from "../utils/types";

function Partie() {
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

  function handleAddCarte(carte: Card, index: number, isBefore: boolean) {
    setCartes((oldCartes) => {
      const newCartes = [...oldCartes];
      const insertionIndex = isBefore ? index : index + 1;
      newCartes.splice(insertionIndex, 0, carte); // Insère la carte à l'index spécifié
      return newCartes;
    });
  }

  return (
    <>
      <Leaderboard players={[]} />
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

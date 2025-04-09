import React, { useState } from "react";
import Frise from "./frise";
import Pioche from "./pioche";
import Leaderboard from "./players";
import { Card } from "../utils/types";

function Partie() {
  const [cartes, setCartes] = useState<Card[]>([]);
  const [nbCartes, setNbCartes] = useState(0);

  function handleAddCarte(index: number) {
    const newCarte: Card = {
      id: nbCartes,
      titre: `Carte ${nbCartes + 1}`,
      date: 1945,
      type: "historique",
      thematic: "thématique",
      detail: "Description de la carte",
    };

    setCartes((oldCartes) => {
      const updated = [...oldCartes];
      updated.splice(index, 0, newCarte); // insertion à l'index voulu
      return updated;
    });

    setNbCartes((old) => old + 1);
  }

  return (
    <>
      <Leaderboard players={[]} />
      <Frise cartes={cartes} onAddCarte={handleAddCarte} />  
      <Pioche onAddCarte={handleAddCarte} />
    </>
  );
}

export default Partie;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Frise from "./frise";
import Pioche from "./pioche";
import Leaderboard from "./players";
import { Card, Player } from "../utils/types";

function Partie() {
  const location = useLocation();
  const { players } = location.state || { players: [] };
  const [playersState, setPlayersState] = useState<Player[]>(players);
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



  function nextPlayer() {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playersState.length);
  }

  function compareDates(date1: string, date2: string): number {
    const parsedDate1 = new Date(date1).getTime();
    const parsedDate2 = new Date(date2).getTime();

    if (isNaN(parsedDate1) || isNaN(parsedDate2)) {
      console.warn(`Impossible de comparer les dates : ${date1}, ${date2}`);
      return 0; // Considérer comme égales si les dates sont invalides
    }

    return parsedDate1 - parsedDate2;
  }

  function isChronological(cards: Card[]): boolean {
    console.log("Vérification des cartes :", cards);
    for (let i = 1; i < cards.length; i++) {
      if (compareDates(cards[i - 1].date.toString(), cards[i].date.toString()) > 0) {
        return false;
      }
    }
    return true;
  }


  function handleAddCarte(carte: Card, index: number, isBefore: boolean) {
    setCartes((oldCartes) => {
      const newCartes = [...oldCartes];
      const insertionIndex = isBefore ? index : index + 1;
      newCartes.splice(insertionIndex, 0, carte); // Insère la carte à l'index spécifié

      if (!isChronological(newCartes)) {
        alert("Les cartes ne sont pas dans l'ordre chronologique !");
        newCartes.sort((a, b) => compareDates(a.date.toString(), b.date.toString()));
      } else {
        setPlayersState((prevPlayers) =>
          prevPlayers.map((player, idx) =>
            idx === currentPlayerIndex
              ? { ...player, score: player.score + 1 } // 
              : player
          )
        );
      }
      return newCartes;
    });
    setCarteSelectionnee(null);
    nextPlayer();
  }

  return (
    <>
      <Leaderboard players={playersState} />
      <div>
        <h2>Joueur actuel : {playersState[currentPlayerIndex].name}</h2>
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
        onSelectCarte={setCarteSelectionnee}
        carteSelectionnee={carteSelectionnee} // Passe la carte sélectionnée à App
      />
    </>
  );
}

export default Partie;

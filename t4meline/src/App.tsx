import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Pioche from "./components/pioche";
import Frise from "./components/frise";
import { Card, Player } from "./utils/types";
import Leaderboard from "./components/players";

function App() {
  const [cartes, setCartes] = useState<Card[]>([]);
  const [nbCartes, setNbCartes] = useState(0);
  const players: Player[] = [
    { name: "Alice", score: 100 }, { name: "Bob", score: 200 },
    { name: "Charlie", score: 150 }, { name: "David", score: 50 },]

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
      <Frise cartes={cartes} onAddCarte={handleAddCarte} />
      <Pioche onAddCarte={handleAddCarte} />
      <Leaderboard players={players} />
    </>
  );
}

export default App;

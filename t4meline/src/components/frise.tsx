import { useState } from "react";
import { useEffect } from "react";

interface Carte {
  id: number;
  nom: string;
  date: number;
  categorie: string;
  description: string;
}

function Carte(props: { carte: Carte }) {
  return (
    <div className="frise__carte">
      <p>{props.carte.nom}</p>
    </div>
  );
}

export default function Frise() {
  const [nbCartes, setNbCartes] = useState(0);
  const [cartes, setCartes] = useState<Carte[]>([]);

  function handleAddCarte() {
    const newCarte: Carte = {
      id: nbCartes,
      nom: `Carte ${nbCartes + 1}`,
      date: 1945,
      categorie: "historique",
      description: "Description de la carte",
    };
    console.log("Frise.tsx: Adding carte:", newCarte);
    setCartes((prev) => [...prev, newCarte]);
    setNbCartes((prev) => prev + 1);
  }

  return (
    <>
      <div className="frise">
        <div className="frise__add">
          <h1>Frise Component</h1>
          <button onClick={() => handleAddCarte()}>Increment</button>
        </div>
        <div className="frise__container">
          {cartes.map((carte) => (
            <div key={carte.id} className="frise__carte">
              <h2>{carte.date}</h2>
              <h3>{carte.nom}</h3>
              <p>{carte.categorie}</p>
              <p>{carte.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

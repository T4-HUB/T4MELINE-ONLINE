import { useRef, useState } from "react";
import { useEffect } from "react";
import { Card } from "../utils/types";

function Carte(props: { carte: Card }) {
  return (
    <div className="carte__details">
      <h2>{props.carte.date}</h2>
      <h3>{props.carte.titre}</h3>
      <p>{props.carte.type}</p>
      <p>{props.carte.detail}</p>
    </div>
  );
}

export default function Frise({ data }: { data: Card }) {
  const [nbCartes, setNbCartes] = useState(0);
  const [cartes, setCartes] = useState<Card[]>([]);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      handleAddCarte(0); // Ajout de la première carte lors de l'initialisation
      didInit.current = true;
    } else {
      // Ajouter une nouvelle carte chaque fois que `data` change
      handleAddCarte(nbCartes);
    }
  }, [data]); // Le `useEffect` se déclenche chaque fois que `data` change

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
    <div className="frise">
      <div className="frise__add">
        <h1>Frise Component</h1>
      </div>
      <div className="frise__container">
        {cartes.map((carte, index) => (
          <div key={carte.id} className="frise__carte">
            <div className="button_container">
              <button
                className="button_put_before"
                onClick={() => handleAddCarte(index)}
              >
                ↙
              </button>
              <button
                className="button_put_after"
                onClick={() => handleAddCarte(index + 1)}
              >
                ↘
              </button>
            </div>
            <Carte carte={carte} />
          </div>
        ))}
      </div>
    </div>
  );
}

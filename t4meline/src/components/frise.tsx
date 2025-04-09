import { useRef, useState } from "react";
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
    <div className="carte__details">
      <h2>{props.carte.date}</h2>
      <h3>{props.carte.nom}</h3>
      <p>{props.carte.categorie}</p>
      <p>{props.carte.description}</p>
    </div>
  );
}

export default function Frise() {
  const [nbCartes, setNbCartes] = useState(0);
  const [cartes, setCartes] = useState<Carte[]>([]);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      handleAddCarte(0);
      didInit.current = true;
    }
  }, []);

  function handleAddCarte(index: number) {
    const newCarte: Carte = {
      id: nbCartes,
      nom: `Carte ${nbCartes + 1}`,
      date: 1945,
      categorie: "historique",
      description: "Description de la carte",
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

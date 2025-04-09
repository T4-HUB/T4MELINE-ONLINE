import { useRef } from "react";
import { Card } from "../utils/types";
import "../index.css";


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

export default function Frise({
  cartes,
  onAddCarte,
}: {
  cartes: Card[];
  onAddCarte: (index: number) => void;
}) {
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
                onClick={() => onAddCarte(index)}
              >
                ↙
              </button>
              <button
                className="button_put_after"
                onClick={() => onAddCarte(index + 1)}
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

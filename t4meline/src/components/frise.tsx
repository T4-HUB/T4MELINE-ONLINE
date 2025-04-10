import { Card } from "../utils/types";
import "../index.css";

function Carte(props: { carte: Card }) {
  return (
    <div className="card">
      <div className="card__body">
        <span className="card__body__thematic">{props.carte.thematic}</span>
        <span className="card__body__type">{props.carte.type}</span>
        <h1 className="card__body__head">{props.carte.titre}</h1>
        <p className="card__body__content">{props.carte.detail}</p>
      </div>
      <div style={{ backgroundColor: "red" }} className="card__footer">
        <div className="card__Footer__first">
          <div>
            <p>{props.carte.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frise({
  cartes,
  onAddCarte,
}: {
  cartes: Card[];
  onAddCarte: (index: number, isBefore: boolean) => void;
}) {
  return (
    <div className="frise">
      <h2>🗓️ Frise Chronologique</h2>
      <div className="frise__container">
        {cartes.map((carte, index) => (
          <div key={carte.id} className="frise__carte">
            <div className="button_container">
              <button
                className="button_put_before"
                onClick={() => onAddCarte(index, true)} // Ajouter à gauche
              >
                ↖
              </button>
              <button
                className="button_put_after"
                onClick={() => onAddCarte(index, false)} // Ajouter à droite
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

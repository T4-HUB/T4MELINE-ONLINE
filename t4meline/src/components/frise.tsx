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
      <div style={{ backgroundColor: "rgb(118 162 255)" }} className="card__footer">
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
  disabled = false, // Prop pour désactiver les boutons
}: {
  cartes: Card[];
  onAddCarte: (index: number, isBefore: boolean) => void;
  disabled?: boolean; // Prop optionnelle pour désactiver les boutons
}) {
  return (
    <div className="frise">
      <div className="frise__container">
        {cartes.map((carte, index) => (
          <div key={carte.id} className="frise__carte">
            <div className="button_container">
              <button
                className="button_put_before"
                onClick={() => onAddCarte(index, true)} // Ajouter à gauche
                disabled={disabled} // Désactiver le bouton si ce n'est pas le tour du joueur
              >
                ⇙
              </button>
              <button
                className="button_put_after"
                onClick={() => onAddCarte(index, false)} // Ajouter à droite
                disabled={disabled} // Désactiver le bouton si ce n'est pas le tour du joueur
              >
                ⇘
              </button>
            </div>
            <Carte carte={carte} />
          </div>
        ))}
      </div>
    </div>
  );
}

import "./pioche.css";
import { socket } from "../config"; // Chemin relatif selon ton fichier
import { Card } from "../utils/types";

export default function Pioche({
  pioche = [], // Valeur par défaut pour pioche
  carteSelectionnee,
  onDrawCard,
}: {
  pioche: Card[];
  onDrawCard: (carte: Card) => void;
  carteSelectionnee: Card | null;
}) {
  // S'assurer que pioche est toujours défini et est un tableau
  const isPiocheAvailable = Array.isArray(pioche) && pioche.length > 0;
 socket.on("upDatePioche  ", (pioche: Card[]) => {
    console.log("Pioche mise à jour :", pioche);

  });

  return (
    <div className="pioche">
      <div className="pioche-layout">
        <div className="pioche-liste">
          <div
            className="card-back"
            onClick={() => {
              if (isPiocheAvailable) {
                onDrawCard(pioche[0]);
              }
            }}
          >
            <p>{isPiocheAvailable ? "Tirer une carte" : "Pioche vide"}</p>
          </div>
        </div>

        <div className="selection">
          <h3>Carte sélectionnée</h3>
          <div className="selected-card">
            {carteSelectionnee ? (
              <div className="carte-title">
                <h2>{carteSelectionnee.titre}</h2>
                <div className="carte-footer">
                  <h2>?</h2>
                </div>
              </div>
            ) : (
              <p>Aucune carte sélectionnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

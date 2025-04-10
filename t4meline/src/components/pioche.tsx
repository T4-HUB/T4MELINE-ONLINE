import "./pioche.css";
import Carte from "./carte";
import React, { useState, useEffect } from "react";
import { Card } from "../utils/types";
import { loadCards } from "../utils/loadCards";

export default function Pioche({
  pioche,
  carteSelectionnee,
  onDrawCard,
}: {
  pioche: Card[];
  onDrawCard: (carte: Card) => void;
  carteSelectionnee: Card | null;
}) {



  return (
    <div className="pioche">
      <h2>Pioche</h2>
      <div className="pioche-layout">
        <div className="pioche-liste">
          <div
            className="card-back"
            onClick={() => {
              if (pioche.length > 0) {
                onDrawCard(pioche[0]);
              }
            }}
          >
            <p>{pioche.length > 0 ? "Tirer une carte" : "Pioche vide"}</p>
          </div>
        </div>

        <div className="selection">
          <h3>Carte sélectionnée</h3>
          <div className="selected-card">
            {carteSelectionnee ? (
              <Carte carte={carteSelectionnee} isVisible={false} />
            ) : (
              <p>Aucune carte sélectionnée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
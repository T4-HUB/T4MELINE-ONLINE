import { useState } from "react";

interface CarteProps {
  nom: string;
}

export default function Carte({ nom }: CarteProps) {
  return (
    <div className="carte-title">
      <h2>{nom}</h2>
    </div>
  );
}

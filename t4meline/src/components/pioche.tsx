import React from 'react';
import { useState } from 'react';
import './pioche.css'; // Import CSS for styling
import Carte from './carte';

export default function Pioche() {
    const [pioche, setPioche] = useState<string[]>(["carte1", "carte2", "carte3", "carte4", "carte5", "carte6", "carte7", "carte8", "carte9", "carte10"]);
    const [carteSelectionnee, setCarteSelectionnee] = useState<string>("");


    function drawCard() {
        if (pioche.length === 0) {
            alert("No more cards in the deck!");
            return;
        }

        // Randomly select a card from the pioche
        const randomIndex = Math.floor(Math.random() * pioche.length);
        const selectedCard = pioche[randomIndex];
        setCarteSelectionnee(selectedCard);

        // Remove the selected card from the pioche
        const newPioche = pioche.filter((_, index) => index !== randomIndex);
        setPioche(newPioche);
    }

    return (
        <div className="pioche">
            <h2>Pioche</h2>
            <div className="pioche-layout">
                <div className="pioche-liste">
                    <div className="card-back" onClick={drawCard}>
                        <Carte nom={carteSelectionnee} />
                    </div>
                </div>

                <div className="selection">
                    <h3>Carte sélectionnée</h3>
                    <div className="selected-card">
                        <Carte nom={carteSelectionnee} />
                    </div>
                </div>
            </div>
        </div>
    );


}
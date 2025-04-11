import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Frise from './frise';
import Pioche from './pioche';
import Leaderboard from './players';
import { Card, Player } from '../utils/types';
import { socket } from "../config"; // Chemin relatif selon ton fichier
import './partie.css';

function Partie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, numCards, maxPoints } = location.state || { players: [], numCards: 0, maxPoints: 0 };

  // États
  const [playersState, setPlayersState] = useState<Player[]>([]);
  const [frise, setFrise] = useState<Card[]>([]);
  const [pioche, setPioche] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [carteSelectionnee, setCarteSelectionnee] = useState<Card | null>(null);
  useEffect(() => {
    socket.emit('initGame');
  
    // INITIALISER LE JEU
  socket.on('gameState', (gameState: { players: Player[]; pioche: Card[]; frise: Card[] }) => {
    setPlayersState(gameState.players);
    setPioche(gameState.pioche);
    setFrise(gameState.frise);
    setCurrentPlayer(gameState.players.find(player => player.isCurrentPlayer) || null);
    // si je suis le joueur courant, je tire une carte
    if (gameState.players.find(player => player.isCurrentPlayer)) {
      socket.emit('goPlay');
    }
  });
  
    socket.on('yourTurn', (player: Player) => {
      setCurrentPlayer(player);
      const randomIndex = Math.floor(Math.random() * pioche.length);
      // enlever la carte de la pioche
      const carteTiree = pioche[randomIndex]; // Tire la première carte
      setCarteSelectionnee(carteTiree);
      socket.emit('tireCetteCarte', { card: carteTiree });
    });
  
    socket.on("updatePioche", (updatedPioche: Card[]) => {
      setPioche(updatedPioche); // Mettre à jour la pioche avec les nouvelles cartes
    });
  
    socket.on('gameOver', ({ winner }: { winner: { name: string; score: number } }) => {
      alert(`Le gagnant est ${winner.name} avec ${winner.score} points !`);
      navigate('/endgame', { state: { players: playersState } });
    });
  
    socket.on('error', (message: string) => {
      alert(`Erreur : ${message}`);
    });
  
    return () => {
      socket.off('gameState');
      socket.off('yourTurn');
      socket.off('updatePioche');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [navigate]); // Dépendances mises à jour

 
  function drawCard() {
    if (carteSelectionnee) {
      return;
    }

    if (pioche.length === 0) {
      return;
    }


    const randomIndex = Math.floor(Math.random() * pioche.length);
    const selectedCard = pioche[randomIndex];
    setCarteSelectionnee(selectedCard);

    const newPioche = pioche.filter((_, index) => index !== randomIndex);
    setPioche(newPioche);
  }

  return (
    <div className="partie">
      {/* Section Pioche */}
      <div className="pioche">
        <Pioche pioche={pioche} onDrawCard={drawCard} carteSelectionnee={carteSelectionnee} />
      </div>

      <div className="frise-container"> <Frise
        cartes={frise}
        onAddCarte={(index, isBefore) =>
          carteSelectionnee &&
          handleAddCarte(carteSelectionnee, index, isBefore)
        }
      /></div>

      {/* Section Classement */}
      <div className="leaderboard">
        <>
          <h2>Joueur actuel : {currentPlayer?.name || "Aucun joueur"}</h2>
          <Leaderboard players={playersState} />
        </>
      </div>
    </div>
  );
}

export default Partie;

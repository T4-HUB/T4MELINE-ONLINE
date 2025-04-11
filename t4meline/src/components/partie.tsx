import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Frise from './frise';
import Pioche from './pioche';
import Leaderboard from './players';
import { Card, Player } from '../utils/types';
import { socket } from "../config";
import './partie.css';

function Partie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, numCards, maxPoints } = location.state || { players: [], numCards: 0, maxPoints: 0 };

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [playersState, setPlayersState] = useState<Player[]>([]);
  const [frise, setFrise] = useState<Card[]>([]);
  const [pioche, setPioche] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [carteSelectionnee, setCarteSelectionnee] = useState<Card | null>(null);

  useEffect(() => {
    socket.emit('initGame');

    socket.on('yourTurn', (player: Player) => {
      setCurrentPlayer(player);
    });

    socket.on("updatePioche", (updatedPioche: Card[]) => {
      setPioche(updatedPioche);
    });

    socket.on('gameOver', ({ winner }: { winner: { name: string; score: number } }) => {
      alert(`Le gagnant est ${winner.name} avec ${winner.score} points !`);
      navigate('/endgame', { state: { players: playersState } });
    });

    socket.on('error', (message: string) => {
      alert(`Erreur : ${message}`);
    });

    socket.on('gameState', (gameState: { players: Player[]; pioche: Card[]; frise: Card[] }) => {
      setPlayersState(gameState.players);
      setPioche(gameState.pioche);
      setFrise(gameState.frise);
      setCurrentPlayer(gameState.players.find(player => player.isCurrentPlayer) || null);
    });

    return () => {
      socket.off('gameState');
      socket.off('yourTurn');
      socket.off('updatePioche');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [navigate]);

  const isMyTurn = currentPlayer?.socketId === socket.id;

  function drawCard() {
    if (!isMyTurn) {
      return;
    }

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
    socket.emit("tireCetteCarte", { card: selectedCard });
  }

  function handleAddCarte(carte: Card, index: number, isBefore: boolean) {
    if (!isMyTurn) {
      return;
    }

    socket.emit("placeCarte", { carte, position: isBefore ? "before" : "after" }, (response) => {
      if (!response.success) {
        alert(response.message);
      }
    });

    setCarteSelectionnee(null);
  }

  return (
    <div className="partie">
      <div className="pioche">
        <Pioche
          pioche={pioche}
          onDrawCard={drawCard}
          carteSelectionnee={carteSelectionnee}
          disabled={!isMyTurn} // Désactiver le bouton si ce n'est pas le tour du joueur
        />
      </div>
      <div className="frise-container">
        <Frise
          cartes={frise}
          onAddCarte={(index, isBefore) =>
            carteSelectionnee &&
            handleAddCarte(carteSelectionnee, index, isBefore)
          }
          disabled={!isMyTurn} // Désactiver l'ajout de carte si ce n'est pas le tour du joueur
        />
      </div>
      <div className="leaderboard">
        <h2>Joueur actuel : {currentPlayer?.name || "Aucun joueur"}</h2>
        <Leaderboard players={playersState} />
      </div>
    </div>
  );
}

export default Partie;

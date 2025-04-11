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
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [playersState, setPlayersState] = useState<Player[]>([]);
  const [frise, setFrise] = useState<Card[]>([]);
  const [pioche, setPioche] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [carteSelectionnee, setCarteSelectionnee] = useState<Card | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  useEffect(() => {
    socket.emit('initGame');

    // INITIALISER LE JEU
    socket.on('gameState', (gameState: { players: Player[]; pioche: Card[]; frise: Card[] }) => {
      setPlayersState(gameState.players);
      setPioche(gameState.pioche);
      setFrise(gameState.frise);
      setCurrentPlayer(gameState.players.find(player => player.isCurrentPlayer) || null);
    });

    socket.on('yourTurn', (player: Player) => {
      setCurrentPlayer(player);
      const randomIndex = Math.floor(Math.random() * pioche.length);
      // Enlever la carte de la pioche
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
  }, [navigate, pioche]); // Dépendances mises à jour

  function drawCard() {
    if (!currentPlayer || currentPlayer.socketId !== socket.id) {
      return; // Si ce n'est pas son tour, on bloque l'action
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

  function compareDates(date1: string, date2: string): number {
    const value1 = parseSeasonalDate(date1, "start");
    const value2 = parseSeasonalDate(date2, "start");

    if (value1 === null || value2 === null) {
      console.warn(`Impossible de comparer les dates : "${date1}" et "${date2}"`);
      return 0;
    }

    return value1 - value2;
  }

  function parseSeasonalDate(dateStr: string, mode: "start" | "average" = "start"): number | null {
    const seasonMap: { [key: string]: number } = {
      "printemps": 0.0,
      "été": 0.25,
      "ete": 0.25,
      "automne": 0.5,
      "hiver": 0.75
    };

    const seasons = [...dateStr.toLowerCase().matchAll(/(printemps|été|ete|automne|hiver)/g)];
    const years = [...dateStr.matchAll(/\d{4}/g)].map(match => parseInt(match[0]));

    if (years.length === 0) return null;

    const getDateValue = (index: number): number => {
      const year = years[index];
      const seasonMatch = seasons[index];
      const season = seasonMatch ? seasonMap[seasonMatch[1]] : 0.0;
      return year + season;
    };

    if (mode === "average" && years.length >= 2) {
      const start = getDateValue(0);
      const end = getDateValue(1);
      return (start + end) / 2;
    }

    return getDateValue(0);
  }

  function isChronological(cards: Card[]): boolean {
    for (let i = 1; i < cards.length; i++) {
      if (compareDates(cards[i - 1].date.toString(), cards[i].date.toString()) > 0) {
        return false;
      }
    }
    return true;
  }

  function handleAddCarte(carte: Card, index: number, isBefore: boolean) {
    if (!currentPlayer || currentPlayer.socketId !== socket.id) {
      return; // Si ce n'est pas son tour, rien ne se passe
    }

    setFrise((oldCartes) => {
      const newCartes = [...oldCartes];
      const insertionIndex = isBefore ? index : index + 1;
      newCartes.splice(insertionIndex, 0, carte);

      if (!isChronological(newCartes)) {
        newCartes.sort((a, b) => compareDates(a.date.toString(), b.date.toString()));
      } else {
        setPlayersState((prevPlayers) => {
          const updatedPlayers = prevPlayers.map((player, idx) =>
            idx === currentPlayerIndex
              ? { ...player, score: player.score + 1 }
              : player
          );

          // Vérifier la fin de partie après la mise à jour du score
          if (updatedPlayers.some((player) => player.score >= maxPoints)) {
            setIsGameOver(true); // Déclencher la fin de partie
          }

          return updatedPlayers;
        });
      }
      return newCartes;
    });
    setCarteSelectionnee(null);

    if (!isGameOver) {
      nextPlayer();
    }
  }

  function nextPlayer() {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playersState.length);
  }

  return (
    <div className="partie">
      {/* Section Pioche */}
      <div className="pioche">
        <Pioche pioche={pioche} onDrawCard={drawCard} carteSelectionnee={carteSelectionnee} />
      </div>

      {/* Section Frise */}
      <div className="frise-container">
        <Frise
          cartes={frise}
          onAddCarte={(index, isBefore) =>
            carteSelectionnee &&
            handleAddCarte(carteSelectionnee, index, isBefore)
          }
        />
      </div>

      {/* Section Classement */}
      <div className="leaderboard">
        <h2>Joueur actuel : {currentPlayer?.name || "Aucun joueur"}</h2>
        <Leaderboard players={playersState} />
      </div>
    </div>
  );
}

export default Partie;

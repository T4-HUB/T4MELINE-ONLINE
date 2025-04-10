import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Frise from './frise';
import Pioche from './pioche';
import Leaderboard from './players';
import { Card, Player } from '../utils/types';
import { loadCards } from '../utils/loadCards'; // Assurez-vous que cette fonction est correctement importée
import './partie.css';
import { API_URL } from "../config"; // Chemin relatif selon ton fichier



// Adresse du serveur
const socket = io(API_URL);

function Partie() {
  const location = useLocation();
  const navigate = useNavigate();
  const { players, numCards, maxPoints } = location.state || { players: [], numCards: 0, maxPoints: 0 };

  // États
  const [playersState, setPlayersState] = useState<Player[]>([]);
  const [cartes, setCartes] = useState<Card[]>([]);
  const [pioche, setPioche] = useState<Card[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    console.log("État des joueurs (playersState):", playersState);
  }, [playersState]);
  // Initialisation du jeu
  useEffect(() => {
    {
      
      // Charger les cartes à partir de la fonction utilitaire
      loadCards(numCards).then((loadedCards) => {
        const initialCard = loadedCards[0]; // Utilisez la première carte comme point de départ
        const remainingCards = loadedCards.slice(1); // Le reste ira dans la pioche

        setCartes([initialCard]);
        setPioche(remainingCards);
        console.log("Cartes chargées :", loadedCards);
      });
    }
    socket.emit('initGame', { playersList: players, numCards, maxScore: maxPoints });

    socket.on('gameState', (players: Player[]) => {
      setPlayersState(players);
    });

    socket.on('cardDrawn', (card: Card) => {
      setSelectedCard(card);
    });

    socket.on('gameOver', ({ winner }: { winner: { name: string; score: number } }) => {
      alert(`Le gagnant est ${winner.name} avec ${winner.score} points !`);
      navigate('/endgame', { state: { players: playersState } });
    });

    socket.on('error', (message: string) => {
      alert(message);
    });

    

    return () => {
      socket.off('gameState');
      socket.off('cardDrawn');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [players, numCards, maxPoints, playersState, navigate]);

  

  return (
    <div className="partie">
      <div className="pioche">
        <Pioche pioche={pioche} onDrawCard={drawCard} carteSelectionnee={selectedCard} />
      </div>
      <div className="frise-container">
        <Frise cartes={cartes} onAddCarte={(index, isBefore) => handleAddCarte(index, isBefore)} />
      </div>
      <div className="leaderboard">
  {playersState.length > 0 ? (
    <>
      <h2>Joueur actuel : {currentPlayer}</h2>
      <Leaderboard players={playersState} />
    </>
  ) : (
    <p>Aucun joueur n'est disponible pour le moment...</p>
  )}
</div>
    </div>
  );
}

export default Partie;

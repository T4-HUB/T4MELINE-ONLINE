import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./acceuil.css";
import { useNavigate } from "react-router-dom";

// Adresse du serveur
const socket = io("http://172.20.10.3:3001");

function Acceuil() {
  const [inputValue, setInputValue] = useState(""); // Saisie du nom du joueur
  const [players, setPlayers] = useState<{ name: string; isReady: boolean }[]>([]); // Liste des joueurs
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null); // Joueur actuel
  const [hasJoined, setHasJoined] = useState<boolean>(false); // Indique si le joueur a rejoint
  const [errorMessage, setErrorMessage] = useState<string>(""); // Message d'erreur
  const navigate = useNavigate();

  
    useEffect(() => {
      console.log("État des joueurs (players):", players);
    }, [players]);
  useEffect(() => {
    // Mettre à jour la liste des joueurs lorsque le serveur envoie un événement
    socket.on("playersUpdate", (updatedPlayers: { name: string; isReady: boolean }[]) => {
      setPlayers(updatedPlayers);
    });

    // Écouter l'événement "playerNameTaken" pour afficher un message d'erreur
    socket.on("playerNameTaken", (message: string) => {
      setErrorMessage(message);
    });

    // Démarrer la partie lorsque le serveur envoie l'événement
    socket.on("gameStarted", () => {
      navigate("/partie", { state: { players, numCards: 80, maxPoints: 9 } });
      console.log("Tous les joueurs sont prêts, la partie peut commencer !");
    });

    // Nettoyage des événements Socket.IO à la fermeture du composant
    return () => {
      socket.off("playersUpdate");
      socket.off("playerNameTaken");
      socket.off("gameStarted");
    };
  }, [navigate]);

  const handleAddPlayer = () => {
    // Vérification des erreurs avant d'ajouter le joueur
    const trimmedName = inputValue.trim();

    if (!trimmedName) {
      setErrorMessage("Le nom ne peut pas être vide.");
    } else if (!hasJoined) {
      const newPlayer = { name: trimmedName, isReady: false };
      socket.emit("addPlayer", newPlayer); // Envoie au serveur pour ajouter un joueur
      setCurrentPlayer(newPlayer.name); // Définit le joueur actuel
      setHasJoined(true); // Marque que le joueur a rejoint
      setInputValue(""); // Réinitialise l'input
      setErrorMessage(""); // Réinitialise le message d'erreur
    }
  };

  const togglePlayerStatus = (playerName: string) => {
    // Vérifie que le joueur actuel essaie de modifier son propre statut
    if (currentPlayer === playerName) {
      socket.emit("togglePlayerStatus", playerName); // Modifie le statut de prêt du joueur
    }
  };

  const startGame = () => {
    console.log("La partie a commencé !");
    socket.emit("startGame"); // Demande au serveur de démarrer la partie
  };

  return (
    <div className="main-content">
      <div className="input-section">
        <h1>T4meline</h1>
        <div className="input-boutton">
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={hasJoined} // Désactiver le champ de saisie si déjà rejoint
          />
          <button
            className="boutton_plus"
            onClick={handleAddPlayer}
            disabled={hasJoined} // Désactiver le bouton si déjà rejoint
          >
            S'ajouter
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      <ul className="items-list">
        {players.map((player) => (
          <li key={player.name}>
            {player.name} - {player.isReady ? "Prêt" : "Pas prêt"}
            {currentPlayer === player.name && (
              <button onClick={() => togglePlayerStatus(player.name)}>
                {player.isReady ? "Marquer pas prêt" : "Marquer prêt"}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="footer-section">
        <button className="boutton_lancer" onClick={startGame} disabled={players.length === 0}>
          Lancer la partie
        </button>
      </div>
    </div>
  );
}

export default Acceuil;

import * as express from "express";
import * as http from "http";
import { Server as SocketIOServer } from "socket.io";
import { Player, Card } from "./types";
import { loadCards } from "./loadCards";

const app = express();
const server = http.createServer(app);

let nbrPlayers = 0; // Compteur de joueurs
let currentPlayerIndex = 1;

// Configurer Socket.IO avec CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Autoriser toutes les origines pour les connexions React
    methods: ["GET", "POST"],
  },
});

let players: Player[] = []; // Liste des joueurs
let pioche: Card[] = [];
let frise: Card[] = [];

// Vérifier si Express fonctionne bien
app.get("/", (req, res) => {
  res.send("Serveur Socket.IO est en marche !");
});

// Gestion des événements Socket.IO
io.on("connection", (socket) => {
  console.log("Un client est connecté.");

  // Envoyer la liste actuelle des joueurs à la connexion
  socket.emit("playersUpdate", players);

  // Ajouter un nouveau joueur
  socket.on("addPlayer", (newPlayer: Player) => {
    const playerExists = players.some(
      (player) => player.name.toLowerCase() === newPlayer.name.toLowerCase()
    );

    if (playerExists) {
      socket.emit("playerNameTaken", "Ce nom est déjà pris, choisissez-en un autre.");
    } else {
      // Ajouter le socketId au joueur
      players.push({ ...newPlayer, score: 0, socketId: socket.id }); // Initialiser le score à 0 et ajouter socketId
      if (players.length === 1) {
        players[0].isCurrentPlayer = true; // Le premier joueur est le joueur actuel
      }
      console.log("Liste des joueurs mise à jour après ajout :");
      console.table(players); // Affiche les joueurs en tableau dans la console
      io.emit("playersUpdate", players); // Notifier tous les clients
      nbrPlayers++;
      console.log(`Nombre de joueurs connectés : ${nbrPlayers}`);
    }
  });

  // Modifier le statut "prêt" d'un joueur
  socket.on("togglePlayerStatus", (playerName: string) => {
    players = players.map((player) =>
      player.name === playerName ? { ...player, isReady: !player.isReady } : player
    );
    console.log("Liste des joueurs mise à jour après modification du statut :");
    console.table(players);
    io.emit("playersUpdate", players); // Notifier tous les clients
  });

  // Démarrer la partie
  socket.on("startGame", () => {
    console.log("Tentative de démarrage de la partie...");
    const everyoneReady = players.every((player) => player.isReady);

    if (!everyoneReady) {
      console.log("Tous les joueurs ne sont pas prêts !");
      io.emit("gameError", "Tous les joueurs ne sont pas prêts !");
      return;
    }

    io.emit("gameStarted"); 
    console.log("Tous les joueurs sont prêts, la partie commence !");
  });

  socket.on("initGame", async () => {
    try {
      const loadedCards = await loadCards(80); // Chargez les cartes
      pioche = loadedCards; // Mettre à jour les cartes

      const randomIndex = Math.floor(Math.random() * pioche.length);
      const carteTiree = pioche[randomIndex]; // Tire la première carte

      pioche.splice(randomIndex, 1); // Enlève la carte de la pioche

      // Ajouter la carte à la frise au milieu
      frise = [carteTiree]; // Initialiser la frise avec une seule carte

      io.emit("gameState", { players, pioche, frise }); // Émettre l'état initial du jeu avec la frise
    } catch (error) {
      console.error("Erreur lors du chargement des cartes :", error);
      io.emit("gameError", "Une erreur est survenue lors du chargement des cartes.");
    }
  });

   socket.on("updatePioche", (updatedPioche: Card[]) => {
    pioche = updatedPioche; // Mettre à jour la pioche avec les nouvelles cartes
    console.log("Pioche mise à jour :", pioche);
    socket.emit("updatePioche", pioche); // Émettre l'événement de mise à jour de la pioche
  });


  // GREG 

  // Lorsqu'un joueur place une carte
socket.on("placeCarte", ({ carte, position }) => {
  const index = position === "before" ? 0 : frise.length; // Ajouter avant ou après la première carte
  const newFrise = [...frise];

  // Ajouter la carte à la frise selon la position
  if (position === "before") {
    newFrise.unshift(carte); // Ajouter avant
  } else {
    newFrise.push(carte); // Ajouter après
  }

  // Valider si la carte a été bien placée (à définir par tes règles)
  const isCorrect = validateCartePlacement(carte, position);
  let points = 0;

  if (isCorrect) {
    points = 10; // Exemple de score
  }

  // Mettre à jour les joueurs (en ajoutant les points si la carte est bien placée)
  players = players.map(player => {
    if (player.socketId === socket.id) {
      player.score += points;
    }
    return player;
  });

  frise = newFrise; // Mettre à jour la frise

  // Envoyer les nouvelles données à tous les clients
  io.emit("gameState", { players, pioche, frise });
  io.emit("updatePioche", pioche); // Si nécessaire pour la pioche
});

function validateCartePlacement(carte: Card, position: string): boolean {
  // Par exemple, la carte est valide si elle suit certaines règles (à définir selon ta logique)
  return true; // Exemple basique : tout placement est correct
}


}); // Close the io.on("connection") block

// Démarrer le serveur
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

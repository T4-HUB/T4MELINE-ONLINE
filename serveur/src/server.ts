import * as express from "express";
import * as http from "http";
import { Server as SocketIOServer } from "socket.io";
import { Player, Card } from "./types";
import { loadCards } from "./loadCards";

const app = express();
const server = http.createServer(app);

let nbrPlayers = 0;
let currentPlayerIndex = 0;

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let players: Player[] = [];
let pioche: Card[] = [];
let frise: Card[] = [];

app.get("/", (req, res) => {
  res.send("Serveur Socket.IO est en marche !");
});

io.on("connection", (socket) => {
  console.log("Un client est connecté avec l'ID:", socket.id);

  socket.emit("playersUpdate", players);

  socket.on("addPlayer", (newPlayer: Player) => {
    const playerExists = players.some(
      (player) => player.name.toLowerCase() === newPlayer.name.toLowerCase()
    );

    if (playerExists) {
      socket.emit("playerNameTaken", "Ce nom est déjà pris, choisissez-en un autre.");
    } else {
      players.push({ ...newPlayer, score: 0, socketId: socket.id, isCurrentPlayer: false });
      if (players.length === 1) {
        players[0].isCurrentPlayer = true;
      }
      console.log("Liste des joueurs mise à jour après ajout :");
      console.table(players);
      io.emit("playersUpdate", players);
      nbrPlayers++;
      console.log(`Nombre de joueurs connectés : ${nbrPlayers}`);
    }
  });

  socket.on("togglePlayerStatus", (playerName: string) => {
    players = players.map((player) =>
      player.name === playerName ? { ...player, isReady: !player.isReady } : player
    );
    console.log("Liste des joueurs mise à jour après modification du statut :");
    console.table(players);
    io.emit("playersUpdate", players);
  });

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
      const loadedCards = await loadCards(80);
      pioche = loadedCards;
      const randomIndex = Math.floor(Math.random() * pioche.length);
      const carteTiree = pioche[randomIndex];
      pioche.splice(randomIndex, 1);
      frise = [carteTiree];
      io.emit("gameState", { players, pioche, frise });

      updateCurrentPlayer();

    } catch (error) {
      console.error("Erreur lors du chargement des cartes :", error);
      io.emit("gameError", "Une erreur est survenue lors du chargement des cartes.");
    }
  });

  socket.on("placeCarte", ({ carte, position }, callback) => {
    const player = players.find(p => p.socketId === socket.id);
    if (!player || !player.isCurrentPlayer) {
      callback({ success: false, message: "Ce n'est pas votre tour." });
      return;
    }

    const isCorrect = validateCartePlacement(carte, position); // place la carte dans la frise déjà
    let points = isCorrect ? 10 : 0;



    players = players.map(p => {
      if (p.socketId === socket.id) {
        p.score += points;
        p.isCurrentPlayer = false; // Reset current player status
      }
      return p;
    });

    io.emit("gameState", { players, pioche, frise });
    io.emit("updatePioche", pioche);

    updateCurrentPlayer();

    callback({ success: true });
  });

  socket.on("updatePioche", (updatedPioche: Card[]) => {
    pioche = updatedPioche;
    console.log("Pioche mise à jour :", pioche);
    socket.emit("updatePioche", pioche);
  });

  function updateCurrentPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    players = players.map((player, index) => ({
      ...player,
      isCurrentPlayer: index === currentPlayerIndex
    }));

    const nextSocketId = players[currentPlayerIndex]?.socketId;
    if (nextSocketId) {
      io.to(nextSocketId).emit("yourTurn", players[currentPlayerIndex]);
    }
  }

  function getDateValeur(dateStr: string): number {
    const match = dateStr.match(/-?\d+/g);
    if (!match) return Number.MAX_SAFE_INTEGER; // Cas très flou qu'on met à la fin

    let num = parseInt(match[0]);

    if (dateStr.includes("av")) {
      num = -Math.abs(num);
    }

    return num;
  }


  function validateCartePlacement(carte: Card, position: string): boolean {
    if (frise.length === 0) {
      frise.push(carte); // Si la frise est vide, on ajoute directement la carte
      return true;
    }

    console.log("Frise actuelle :", frise);
    console.log(typeof (carte.date), carte.date);

    let correctIndex = frise.findIndex((c) => getDateValeur(String(c.date)) > getDateValeur(String(carte.date)));
    if (correctIndex === -1) {
      correctIndex = frise.length; // Si aucune carte n'a une date supérieure, insérer à la fin
    }

    const isCorrect =
      (position === "before" && correctIndex === 0) ||
      (position === "after" && correctIndex === frise.length) ||
      (correctIndex > 0 &&
        correctIndex < frise.length &&
        frise[correctIndex - 1].date < carte.date &&
        frise[correctIndex].date > carte.date);

    frise.splice(correctIndex, 0, carte); // Toujours placer la carte au bon endroit

    return isCorrect; // Retourner si la carte était correctement placée initialement
  }

});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

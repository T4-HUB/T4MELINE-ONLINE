import * as express from "express";
import * as http from "http";
import { Server as SocketIOServer } from "socket.io";

type Player = {
  name: string;
  score: number;
  isReady: boolean;
  id: string;
};

const app = express();
const server = http.createServer(app);

// Configurer CORS pour autoriser le client React à se connecter
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Permettre à React de se connecter depuis plusieurs origines
    methods: ["GET", "POST"],
  },
});

// Liste des joueurs
let players: Player[] = [];

// Créer une route pour vérifier si Express fonctionne bien
app.get('/', (req, res) => {
  res.send('Serveur Socket.IO est en marche');
});

// Gérer les événements Socket.IO
io.on('connection', (socket) => {
  console.log('Un client est connecté');

  // Envoyer la liste actuelle des joueurs à la connexion
  socket.emit('playersUpdate', players);

  // Ajouter un joueur
  socket.on('addPlayer', (newPlayer: { name: string; isReady: boolean; id: string }) => {
    // Vérifier si le nom du joueur existe déjà dans la liste
    const playerExists = players.some(player => player.name.toLowerCase() === newPlayer.name.toLowerCase());

    if (playerExists) {
      // Si le nom existe déjà, envoyer un message d'erreur au client
      socket.emit('playerNameTaken', 'Ce nom est déjà pris, choisissez-en un autre.');
    } else {
      // Sinon, ajouter le joueur à la liste
      players.push({ ...newPlayer, score: 0 }); // Initialize score to 0
      console.log("Liste des joueurs mise à jour (après ajout) :");
      console.table(players); // Affiche les joueurs sous forme de tableau dans la console
      io.emit('playersUpdate', players); // Mettre à jour tous les clients
    }
  });

  // Mettre à jour le statut d'un joueur
  socket.on('togglePlayerStatus', (playerName: string) => {
    players = players.map((player) =>
      player.name === playerName ? { ...player, isReady: !player.isReady } : player
    );
    console.log("Liste des joueurs mise à jour (après modification de statut) :");
    console.table(players); // Affiche les joueurs sous forme de tableau dans la console
    io.emit('playersUpdate', players); // Mettre à jour tous les clients
  });

  // Démarrer la partie
  socket.on('startGame', () => {
    console.log("Tentative de démarrage de la partie...");
    const everyoneReady = players.every((player) => player.isReady);
    if (!everyoneReady) {
      console.log("Tous les joueurs ne sont pas prêts !");
      io.emit('gameError', "Tous les joueurs ne sont pas prêts !");
      return;
    }

    io.emit('gameStarted'); // Notifier les clients que la partie commence
    console.log("Tous les joueurs sont prêts, la partie peut commencer !");
  });
  socket.on('initGame', (data) => {
    const { playersList, numCards, maxScore } = data;
    
    if (!playersList || playersList.length === 0) {
      console.error('Aucun joueur envoyé au serveur.');
      return;
    }
  
    const gameState = {
      players: playersList,  // Liste des joueurs envoyée par le client
      cartes: [],  // Ajouter des cartes ici
      currentPlayer: playersList[0].name,  // Le premier joueur commence
    };
  
    io.emit('gameState', players);  // Envoie l'état du jeu
  });

  // Gérer la déconnexion
  socket.on('disconnect', () => {
    console.log('Un client a quitté');
  });
});

// Démarrer le serveur
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur ${PORT}`);
});
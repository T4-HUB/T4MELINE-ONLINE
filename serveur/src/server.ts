import * as express from 'express';
import * as http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Configurer CORS pour autoriser le client React à se connecter
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",  // Autoriser React à se connecter depuis plusieurs origines
    methods: ["GET", "POST"],
  }
});

// Créer une route pour voir si Express fonctionne bien
app.get('/', (req, res) => {
  res.send('Serveur Socket.IO est en marche');
});

io.on('connection', (socket) => {
  console.log('Un client est connecté');
  
    // Gérer les erreurs de connexion
    socket.on('connect_error', (err) => {
      console.error('Erreur de connexion:', err);
      alert('Erreur de connexion au serveur');
    });
  socket.emit('message', 'Bienvenue sur le serveur de jeu !');
  
  socket.on('action', (data) => {
    console.log('Message reçu du client:', data);
    socket.emit('message', `Action reçue: ${data}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Un client a quitté');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur en écoute sur http://0.0.0.0:${PORT}`);
});

import React, { useState } from 'react';
import Leaderboard from './components/players'; 
import Pioche from './components/pioche';

const App = () => {
  const [players, setPlayers] = useState([
    { name: 'Binhhhhhhhhhhhlal', points: 120 },
    { name: 'Sarah', points: 150 },
    { name: 'Mehdi', points: 100 },
    { name: 'Lina', points: 180 },
    { name: 'Bilal', points: 120 },
    { name: 'Sarah', points: 150 },
    { name: 'Mehdi', points: 100 },
    { name: 'Lina', points: 180 },
    { name: 'Bilal', points: 120 },
    { name: 'Sarah', points: 150 },
    { name: 'Mehdi', points: 100 },
    { name: 'Lina', points: 180 },
    { name: 'Bilal', points: 120 },
    { name: 'Sarah', points: 150 },
    { name: 'Mehdi', points: 100 },
    { name: 'Lina', points: 180 },
    { name: 'Bilal', points: 120 },
    { name: 'Sarah', points: 150 },
    { name: 'Mehdi', points: 100 },
    { name: 'Lina', points: 180 },
    { name: 'Bilal', points: 120 },
    { name: 'Sarah', points: 150 },
    { name: 'Mehdi', points: 100 },
    { name: 'Lina', points: 180 }
  ]);

 

  return (
    <>
      <Leaderboard players={players} />
    </>
  );
};

export default App;

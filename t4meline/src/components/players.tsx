 import React from 'react';
import './players.css';

type Player = {
  name: string;
  points: number;
};

type LeaderboardProps = {
  players: Player[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      <div className="scrollable-body">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Nom</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
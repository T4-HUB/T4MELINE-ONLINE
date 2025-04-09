import './players.css';
import { Player } from '../utils/types';

interface LeaderboardProps {
  players: Player[];
};

export default function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

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
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
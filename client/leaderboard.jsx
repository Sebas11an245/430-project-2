import React, { useEffect, useState } from 'react';

const Leaderboard = ({ setPage }) => {
  const [gameType, setGameType] = useState('speedGarden');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (type) => {
    setLoading(true);

    const res = await fetch(`/leaderboard?gameType=${type}`, {
      credentials: 'include',
    });

    const data = await res.json();

    // IMPORTANT FIX: backend returns { leaderboard: [...] }
    setLeaderboard(data.leaderboard || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard(gameType);
  }, [gameType]);

  return (
    <div className="leaderboardPage">

      {/* HEADER */}
      <div className="leaderHeader">
        <h1>🏆 Leaderboard</h1>

        <select
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
        >
          <option value="speedGarden">Speed Garden</option>
          <option value="reactionDash">Reaction Dash</option>
          <option value="memoryFlip">Memory Flip</option>
          <option value="puzzleGrid">Puzzle Grid</option>
        </select>
      </div>

      {/* CONTENT */}
      <div className="leaderCard">

        {loading ? (
          <p>Loading scores...</p>
        ) : leaderboard.length === 0 ? (
          <p>No scores yet.</p>
        ) : (
          <ol className="leaderList">
            {leaderboard.map((entry, index) => (
              <li key={index} className="leaderItem">
                <span className="rank">#{index + 1}</span>

                <span className="name">
                  {entry.username}
                </span>

                <span className="score">
                  {entry.score}
                </span>
              </li>
            ))}
          </ol>
        )}

      </div>

      {/* NAV */}
      <nav className="bottomNav">
        <button onClick={() => setPage('home')}>Home</button>
        <a href="/logout">Logout</a>
      </nav>

    </div>
  );
};

export default Leaderboard;
import React, { useEffect, useState } from 'react';
import GameGrid from './gameGrid.jsx';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('/me', { credentials: 'include' })
      .then(res => res.json())
      .then(setUser);

    fetch('/games', { credentials: 'include' })
      .then(res => res.json())
      .then(setGames);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <GameGrid user={user} games={games} />
  );
};

export default Dashboard;
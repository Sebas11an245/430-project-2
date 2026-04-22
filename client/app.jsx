import React, { useEffect, useState } from 'react';
import Dashboard from './dashboard.jsx';
import Leaderboard from './leaderboard.jsx';

const App = () => {
  const [page, setPage] = useState('home');

  return (
    <>
      {page === 'home' && <Dashboard setPage={setPage} />}
      {page === 'leaderboard' && <Leaderboard setPage={setPage} />}
    </>
  );
};

export default App;
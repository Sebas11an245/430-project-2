import React from 'react';

const GameGrid = ({ user, games = [] }) => {
  if (!user) return <div className="loading">Loading user...</div>;

  const safeGames = Array.isArray(games) ? games : [];

  const allowedGames = user.premium
    ? safeGames
    : safeGames.slice(0, 2);

  const isLocked = (gameId) => {
    if (user.premium) return false;
    return !allowedGames.some(g => g.id === gameId);
  };

  const handlePlay = (game) => {
    console.log("Launching game:", game.id);
  };

  return (
    <div className="gridWrapper">

      {/* HEADER */}
      <div className="gridHeader">
        <h2>🎮 Game Library</h2>

        <div className="userBadge">
          {user.premium ? (
            <span className="premiumBadge">💎 Premium Member</span>
          ) : (
            <span className="freeBadge">Free Account</span>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="gameGrid">

        {safeGames.map((game) => {
          const locked = isLocked(game.id);

          return (
            <div key={game.id} className={`gameCard ${locked ? 'locked' : ''}`}>

              <div className="cardGlow"></div>

              <h3>{game.name}</h3>

              <p className="gameDesc">
                Fast-paced interactive challenge game.
              </p>

              <div className="cardActions">

                {locked ? (
                  <button className="lockedBtn" disabled>
                    🔒 Premium Required
                  </button>
                ) : (
                  <button
                    className="playBtn"
                    onClick={() => handlePlay(game)}
                  >
                    ▶ Play
                  </button>
                )}

              </div>

              {locked && (
                <div className="lockOverlay">
                  <span>Upgrade to unlock</span>
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default GameGrid;
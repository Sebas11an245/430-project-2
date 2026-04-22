import React from 'react';

const GameGrid = ({ user, games }) => {
  if (!user || !games) return <div className="loading">Loading games...</div>;

  const allowedGames = user.premium ? games : games.slice(0, 2);

  const isLocked = (gameId) => {
    if (user.premium) return false;
    return !allowedGames.find(g => g.id === gameId);
  };

  const handlePlay = (game) => {
    console.log("Launching game:", game.id);
    // later: navigate or open game canvas
  };

  return (
    <div className="gridWrapper">

      {/* HEADER BAR */}
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

      {/* GAME GRID */}
      <div className="gameGrid">

        {games.map((game) => {
          const locked = isLocked(game.id);

          return (
            <div key={game.id} className={`gameCard ${locked ? 'locked' : ''}`}>

              {/* BACKGROUND GLOW */}
              <div className="cardGlow"></div>

              {/* GAME TITLE */}
              <h3>{game.name}</h3>

              {/* GAME DESCRIPTION (optional placeholder) */}
              <p className="gameDesc">
                Fast-paced interactive challenge game.
              </p>

              {/* ACTION AREA */}
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

              {/* LOCK OVERLAY */}
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
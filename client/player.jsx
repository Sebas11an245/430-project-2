const React = require('react');
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const PLANT_TYPES = [
    { type: "Rose", image: "/assets/img/rose.png", request: "Water🌊", key: "w" },
    { type: "Cactus", image: "/assets/img/cactus.png", request: "Sunlight☀️", key: "s" },
    { type: "Dandelion", image: "/assets/img/dandelion.png", request: "Air🍃", key: "a" },
    { type: "Sapling", image: "/assets/img/sapling.png", request: "Dirt🌱", key: "d" }
];

const PlayerMain = () => {
    const [view, setView] = React.useState('dashboard');
    const [isPremium, setIsPremium] = React.useState(false);
    const [scores, setScores] = React.useState([]);
    const [isAnon, setIsAnon] = React.useState(false);


    const togglePremiumStatus = async () => {
        const _csrf = document.querySelector('#_csrf').value;
        const endpoint = isPremium ? '/downgrade' : '/upgrade';

        helper.sendPost(endpoint, { _csrf }, (result) => {
            setIsPremium(result.premium);
            updateNavButton(result.premium);
        });
    };

    const updateNavButton = (premium) => {
        const btn = document.getElementById('premiumButton');
        if (btn) {
            btn.textContent = premium ? "Downgrade to Free" : "Upgrade to Premium";
            btn.style.backgroundColor = premium ? "#df5a0d" : "#643173"; 
        }
    };

    React.useEffect(() => {
        const premBtn = document.getElementById('premiumButton');
        if (premBtn) {
            premBtn.onclick = togglePremiumStatus;
        }

        const checkStatus = async () => {
            const response = await fetch('/me');
            const data = await response.json();
            setIsPremium(data.premium);
            setIsAnon(data.anonymity);
            updateNavButton(data.premium);
        };
        checkStatus();
    }, [isPremium]);


    React.useEffect(() => {
        const loadScores = async () => {
            try {
                const response = await fetch('/getScores');
                const data = await response.json();
                setScores(data.scores || []);
            } catch (err) {
                console.error("Failed to fetch scores", err);
                setScores([]);
            }
        };
        loadScores();
    }, [view]);

    const startLevel = (gameName) => {
        if (gameName === 'Speed Garden') {
            setView('game');
        } else {
            alert("This game is coming soon for Premium users!");
        }
    };


    return (
        <div id="main-interface">
            {view === 'dashboard' && (
                <Dashboard
                    scores={scores}
                    isPremium={isPremium}
                    onPlay={startLevel}
                    onSettings={() => setView('settings')}
                />
            )}
            {view === 'game' && (
                <GameWindow onExit={() => setView('dashboard')} />
            )}
            {view === 'settings' && (
                <Settings 
                    initialAnon={isAnon} 
                    onBack={() => setView('dashboard')} 
                />
            )}
        </div>
    );
};

const Dashboard = (props) => {
    const gameList = [
        { id: 'speed', name: 'Speed Garden', icon: '🌼', premium: false },
        { id: 'memory', name: 'Memory Flip', icon: '🧠', premium: true },
        { id: 'puzzle', name: 'Puzzle Grid', icon: '🧩', premium: true },
    ];

    const scores = props.scores || [];

    const scoreNodes = props.scores.map(s => (
        <div key={s._id} className="scoreEntry">
            <span className="user">{s.username}</span>: {s.score}
        </div>
    ));

    return (
        <div className="player-content">

            <div className="dashboard-header">
                <h2>Game Library</h2>
                <button onClick={props.onSettings} className="settings-btn">Settings</button>
                <div className="status-badge">
                    {props.isPremium ? (
                        <span style={{ color: 'gold', fontWeight: 'bold' }}>★ PREMIUM ACCOUNT</span>
                    ) : (
                        <span style={{ color: '#666' }}>Standard Account</span>
                    )}
                </div>
            </div>

            <div className="game-grid">
                {gameList.map(game => {
                    const isLocked = game.premium && !props.isPremium;
                    return (
                        <div key={game.id} className={`game-card ${isLocked ? 'locked' : ''}`}>
                            <div className="icon">{game.icon}</div>
                            <h3>{game.name}</h3>
                            <button
                                className="play-btn"
                                onClick={() => props.onPlay(game.name)}
                                disabled={isLocked}
                            >
                                {isLocked ? 'Premium Only' : 'Play Now'}
                            </button>
                        </div>
                    );
                })}
            </div>


            <section className="leaderboard">
                <h2>Top Gardeners</h2>
                <div className="score-list">
                    {scoreNodes.length > 0 ? scoreNodes : <p>No records found.</p>}
                </div>
            </section>
        </div>
    );
};

const GameWindow = (props) => {
    const [score, setScore] = React.useState(0);
    const [lives, setLives] = React.useState(3);
    const [timeLeft, setTimeLeft] = React.useState(60);
    const [plots, setPlots] = React.useState(Array(16).fill(null));
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const [gameState, setGameState] = React.useState('playing');  

    //Redactored keypress handling
    React.useEffect(() => {
        const handleKeyPress = (e) => {
            const key = e.key.toLowerCase();

            const validKeys = ['w', 'a', 's', 'd'];
            if (!validKeys.includes(key)) return;

            if (hoveredIndex !== null) {
                const target = plots[hoveredIndex];

                if (target) {
                    if (key === target.key) {
                        setScore(prevScore => prevScore + 10);

                        const newPlots = [...plots];
                        newPlots[hoveredIndex] = null;
                        setPlots(newPlots);

                    } else {
                        setLives(prevLives => prevLives - 1);
                    }
                } else {
                    setLives(prev => prev - 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [hoveredIndex, plots]);

    // Refactored game timer logic
    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameState('ended');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [score]);

    // Refactored plant spawning logic
    React.useEffect(() => {
        const spawner = setInterval(() => {
            setPlots(currentPlots => {
                const emptyIndices = currentPlots.map((p, i) => p === null ? i : null).filter(i => i !== null);
                if (emptyIndices.length === 0) {
                    setLives(0);
                    return currentPlots;
                }

                const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                const randomPlant = PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)];

                const newPlots = [...currentPlots];
                newPlots[randomIndex] = randomPlant;
                return newPlots;
            });
        }, 1500);
        return () => clearInterval(spawner);
    }, []);

    React.useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            setGameState('ended');
        }
    }, [lives]);

    const saveScore = () => {
        const csrfToken = document.querySelector('#_csrf')?.value;
        helper.sendPost('/submitScore', { score, _csrf: csrfToken }, () => {
            props.onExit();
        });
    };

    if (gameState === 'ended') {
        return (
            <div className="overlay">
                <h1>Game Over!</h1>
                <p>Final Score: {score}</p>
                <button onClick={saveScore}>Save & Return to Leaderboard</button>
            </div>
        );
    }

    return (
        <div id="game-view">
            <div className="game-stats">
                <span>Score: {score}</span>
                <span>Lives: {lives}</span>
                <span>Time: {timeLeft}s</span>
                <button onClick={() => window.location.reload()} className="exit-btn">Quit</button>
            </div>
            <div id="garden-grid">
                {plots.map((p, i) => (
                    <div
                        key={i}
                        className={`plot ${hoveredIndex === i ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {p && (
                            <div className="plant-wrapper">
                                <img src={p.image} alt={p.type} className="plant-img" />
                                <div className="bubble">{p.request}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Settings = (props) => {
    const [anon, setAnon] = React.useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        const oldPass = e.target.querySelector('#oldPass').value;
        const newPass = e.target.querySelector('#newPass').value;
        const newPass2 = e.target.querySelector('#newPass2').value;
        const _csrf = document.querySelector('#_csrf').value;

        helper.sendPost('/changePassword', { oldPass, newPass, newPass2, _csrf }, (res) => {
            if (res.message) alert(res.message);
        });
    };

    const toggleAnon = () => {
        const _csrf = document.querySelector('#_csrf').value;
        helper.sendPost('/toggleAnon', { _csrf }, (res) => {
            setAnon(res.anonymity);
        });
    };

    return (
        <div className="player-content">
            {/* Added the Return Button here */}
            <div className="settings-header">
                <button onClick={props.onBack} className="exit-btn">← Back to Library</button>
                <h2>User Settings</h2>
            </div>
            
            <div className="settings-section">
                <h3>Privacy Settings</h3>
                <label>
                    <input type="checkbox" checked={anon} onChange={toggleAnon} />
                    Appear as "Anonymous" on Leaderboards
                </label>
            </div>

            <hr />

            <div className="settings-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="mainForm">
                    <input id="oldPass" type="password" placeholder="Old Password" />
                    <input id="newPass" type="password" placeholder="New Password" />
                    <input id="newPass2" type="password" placeholder="Retype New Password" />
                    <input type="submit" value="Update Password" />
                </form>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<PlayerMain />);
};

window.onload = init;
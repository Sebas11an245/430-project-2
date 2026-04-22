const models = require('../models');

const Score = models.Score;


const submitScore = async (req, res) => {
  try {
    const { gameType, score } = req.body;

    if (!gameType || score === undefined) {
      return res.status(400).json({ error: 'Game type and score are required.' });
    }

    const newScore = new Score({
      user: req.session.account._id,
      gameType,
      score,
    });

    await newScore.save();

    return res.status(201).json({
      message: 'Score submitted successfully!',
      score: {
        gameType,
        score,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error submitting score.' });
  }
};


const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.session.account._id })
      .sort({ createdDate: -1 }) // ✅ FIXED FIELD NAME
      .lean();

    return res.json({
      scores: scores.map(doc => ({
        gameType: doc.gameType,
        score: doc.score,
        createdDate: doc.createdDate,
      })),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error retrieving scores.' });
  }
};


const getLeaderboard = async (req, res) => {
  try {
    const { gameType } = req.query;

    if (!gameType) {
      return res.status(400).json({ error: 'Game type is required.' });
    }

    const topScores = await Score.find({ gameType })
      .sort({ score: -1 }) // highest score first
      .limit(10)
      .populate('user', 'username')
      .lean();

    return res.json({
      leaderboard: topScores.map(doc => ({
        username: doc.user?.username || 'Unknown',
        score: doc.score,
        createdAt: doc.createdDate,
      })),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error retrieving leaderboard.' });
  }
};

module.exports = {
  submitScore,
  getUserScores,
  getLeaderboard,
};
const models = require('../models');

const Score = models.Score;


const saveScore = async (req, res) => {
    if (req.body.score === undefined) {
        return res.status(400).json({ error: 'Score is required.' });
    }

    const scoreData = {
        username: req.session.account.username,
        score: req.body.score,
        owner: req.session.account._id,
    };

    try {
        const newScore = new Score(scoreData);
        await newScore.save();
        return res.status(201).json({ message: 'Score saved!' });
    } catch (err) {
      console.log(err);
        return res.status(400).json({ error: 'Error saving score.' });
    }
};

const getScores = async (req, res) => {
    try {
        const docs = await Score.find().sort({ score: -1 }).limit(10).populate('owner').lean().exec();

        const processedScores = docs.map(doc => {
            if (doc.owner && doc.owner.anonymity) {
                return { ...doc, username: 'Anonymous' };
            }
            return doc;
        });

        return res.json({ scores: processedScores || []});
    } catch (err) {
      console.log(err);
        return res.status(400).json({ error: 'Could not retrieve scores.' });
    }
};


module.exports = {
  saveScore,
  getScores
};
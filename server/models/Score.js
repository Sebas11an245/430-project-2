const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
    gameType: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        min: 0,
        required: true,
    }, createdDate: {
        type: Date,
        default: Date.now,
    }
});

ScoreSchema.statics.toAPI = (doc) => ({
    gameType: doc.gameType,
    score: doc.score,
});

const ScoreModel = mongoose.model('Score', ScoreSchema);

module.exports = ScoreModel;
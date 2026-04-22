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
    },
}, {timestamps: true});

ScoreSchema.index({ gameType: 1, score: -1 });

ScoreSchema.statics.toAPI = (doc) => ({
    gameType: doc.gameType,
    score: doc.score,
    createdAt: doc.createdAt,
})

const ScoreModel = mongoose.model('Score', ScoreSchema);

module.exports=ScoreModel;
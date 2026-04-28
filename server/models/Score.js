const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        min: 0,
        required: true,
    }, owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    }, createdDate: {
        type: Date,
        default: Date.now,
    }
});

ScoreSchema.statics.toAPI = (doc) => ({
    username: doc.username,
    score: doc.score,
});

const ScoreModel = mongoose.model('Score', ScoreSchema);

module.exports = ScoreModel;
const mongoose = require("mongoose");

const HighscoreSchema = new mongoose.Schema({
    game: { type: String, required: true },
    naam: { type: String, required: true },
    score: { type: Number, required: true }
});

module.exports = mongoose.model("Highscore", HighscoreSchema);
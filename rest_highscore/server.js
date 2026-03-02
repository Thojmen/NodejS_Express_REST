require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Highscore = require("./models/Highscore");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB verbinding
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));

/*
POST /
Body:
game=Pong&naam=Piet&score=123774
*/
app.post("/", async (req, res) => {
    try {
        const { game, naam, score } = req.body;

        if (!game || !naam || !score) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const numericScore = Number(score);

        // Zoek huidige hoogste score
        const currentHighscore = await Highscore
            .findOne({ game })
            .sort({ score: -1 });

        let isHighscore = false;

        if (!currentHighscore || numericScore > currentHighscore.score) {
            await Highscore.create({
                game,
                naam,
                score: numericScore
            });

            isHighscore = true;
        }

        res.json({
            game,
            naam,
            score: numericScore,
            highscore: isHighscore
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

/*
GET /:game
Geeft hoogste score terug
*/
app.get("/:game", async (req, res) => {
    try {
        const game = req.params.game;

        const highscore = await Highscore
            .findOne({ game })
            .sort({ score: -1 });

        if (!highscore) {
            return res.status(404).json({ error: "Game not found" });
        }

        res.json({
            game: highscore.game,
            naam: highscore.naam,
            score: highscore.score
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
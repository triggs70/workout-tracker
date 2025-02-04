const express = require("express");
const auth = require("../middleware/auth");
const Workout = require("../models/Workout");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const workouts = await Workout.find({userId: req.user});
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const {title, exercises, cardio} = req.body;
        const workout = new Workout({
            userId: req.user,
            title,
            exercises,
            cardio
        });
        await workout.save();
        res.status(201).json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
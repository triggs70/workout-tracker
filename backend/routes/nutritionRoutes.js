const express = require("express");
const auth = require("../middleware/auth");
const Nutrition = require("../models/Nutrition");

const router = express.Router();

// Log Nutrition
router.post("/", auth, async (req, res) => {
    try {
        const {calories, protein, carbs, fat} = req.body;
        const date = new Date().setHours(0,0,0,0);
        const existing = await Nutrition.findOne({userId: req.user, date});
        if (existing) {
            return res.status(400).json({msg: "Nutrition has already been logged for this date"});
        }
        const nutrition = new Nutrition({userId: req.user, date, calories, protein, carbs, fat});
        await nutrition.save();
        res.status(201).json(nutrition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Get User nutrition for specific date
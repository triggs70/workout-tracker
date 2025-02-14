const express = require("express");
const auth = require("../middleware/auth");
const Nutrition = require("../models/Nutrition");

const router = express.Router();

// Log Nutrition
router.post("/", auth, async (req, res) => {
    try {
        const {calories, protein, carbs, fat, date} = req.body;
        const logDate = date ? new Date(date) : new Date();
        const existing = await Nutrition.findOne({userId: req.user, date: logDate});
        if (existing) {
            return res.status(400).json({msg: "Nutrition has already been logged for this date"});
        }
        const nutrition = new Nutrition({userId: req.user, date: logDate, calories, protein, carbs, fat});
        await nutrition.save();
        res.status(201).json(nutrition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Get User nutrition for specific date
router.get("/", auth, async (req, res) => {
    try {
        const queryDate = req.query.date ? new Date(req.query.date) : new Date();
        queryDate.setUTCHours(0,0,0,0);
        const nextDay = new Date(queryDate);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        const nutrition = await Nutrition.findOne({userId: req.user, date: {$gte: queryDate, $lt: nextDay}});
        if (!nutrition) {
            return res.status(404).json({msg: "No nutrition info for this date"});
        }
        res.json(nutrition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Update an entry
router.put("/date/:date", auth, async (req, res) => {
    try {
        const {calories, protein, carbs, fat} = req.body;
        const queryDate = new Date(req.params.date);
        let nutrition = await Nutrition.findOne({userId: req.user, date: {$gte: queryDate, $lt: new Date(queryDate.getTime() + 86400000)}});
        if (!nutrition) {
            return res.status(404).json({msg: "No nutriton info for this date"});
        }
        if (calories) nutrition.calories = calories;
        if (protein) nutrition.protein = protein;
        if (carbs) nutrition.carbs = carbs;
        if (fat) nutrition.fat = fat;
        await nutrition.save();
        res.json(nutrition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Delete an entry
router.delete("/date/:date", auth, async (req, res) => {
    try {
        const date = new Date(req.params.date).setHours(0,0,0,0);
        const nutrition = await Nutrition.findOneAndDelete({userId: req.user, date});
        if (!nutrition) {
            return res.status(404).json({msg: "No nutriton info for this date"});
        }
        res.json({msg: "Nutrition data deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Get Calorie trend for graphing
router.get("/trend", auth, async (req, res) => {
    try {
        const trend = await Nutrition.find({userId: req.user}).sort({date: 1}).select("date calories");
        res.json(trend);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
const express = require("express");
const auth = require("../middleware/auth");
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

const router = express.Router();

//fetch all user workouts, with date filtering
router.get("/", auth, async (req, res) => {
    try {
        const query = {userId: req.user};
        if (req.query.date) {
            const date = new Date(req.query.date);
            query.date = {$gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)};
        }
        const workouts = await Workout.find(query).populate("exercises");
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Add a user workout
router.post("/", auth, async (req, res) => {
    try {
        const {title, exercises, cardio} = req.body;
        const workout = new Workout({userId: req.user, title, cardio});
        await workout.save();
        if (exercises && exercises.length > 0) {
            const exerciseDocs = exercises.map(ex => ({
                userId: req.user,
                workoutId: workout._id,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
            }));
            const inserted = await Exercise.insertMany(exerciseDocs);
            workout.exercises = inserted.map(ex => ex._id);
            await workout.save();
        }
        const populated = await Workout.findById(workout._id).populate("exercises");
        res.status(201).json(populated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Delete a user workout
router.delete("/date/:date", auth, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const workout = await Workout.findOneAndDelete({
            userId: req.user,
            date: {$gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)},
        });
        if (!workout) {
            return res.status(404).json({msg: "Workout not found"});
        }
        await Exercise.deleteMany({workoutId: workout._id});
        res.json({msg: "Workout deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Update a users workout
router.put("/date/:date", auth, async (req, res) => {
    try {
        const {title, cardio, exercises} = req.body;
        const date = new Date(req.params.date);
        let workout = await Workout.findOne({
            userId: req.user,
            date: {$gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)},
        });
        if (!workout) {
            return res.status(404).json({msg: "Workout doesnt exist"});
        }
        if (title) {
            workout.title = title;
        }
        if (cardio) {
            workout.cardio = cardio;
        }
        if (exercises) {
            workout.exercises = workout.exercises.filter(id => 
                exercises.some(ex => ex._id && ex._id.toString() === id.toString())
            );
            for (let ex of exercises) {
                if (ex._id) {
                    await Exercise.findByIdAndUpdate(ex._id, {
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight
                    });
                } else {
                    const added = new Exercise({
                        userId: req.user,
                        workoutId: workout._id,
                        name: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight,
                    });
                    await added.save();
                    workout.exercises.push(added._id);
                }
            }    
        }
        await workout.save();
        const updated = await Workout.findById(workout._id).populate("exercises");
        res.json(updated);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Fetch a specific exercise history for a user(progress tracking)
router.get("/progress/:exerciseName", auth, async (req,res) => {
    try {
        const {exerciseName} = req.params;
        const workouts = await Workout.find({userId: req.user}).populate({
            path: "exercises",
            match: {name: exerciseName},
        });
        const progress = workouts
            .map(workout => ({
                date: workout.date,
                exercises: workout.exercises.filter(ex => ex !== null),
            }))
            .filter(workout => workout.exercises.length > 0);
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
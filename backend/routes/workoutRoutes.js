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
        const workout = await Workout.find(query).populate("exercises");
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
        const workout = new Workout({ userId: req.user, title, cardio});
        await workout.save();
        if (exercises && exercises.length > 0) {
            const excerciseDocs = exercises.map(ex => ({
                userId: req.user,
                workoutId: workout._id,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight
            }));
            const insertedExercises = await Exercise.insertMany(excerciseDocs);
            workout.exercises = insertedExercises.map(ex => ex._id);
            await workout.save();
        }
        const popWorkout = await Workout.findById(workout._id).populate("exercises");
        res.status(201).json(popWorkout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Delete a user workout(protected)
router.delete("/:id", auth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({_id: req.params.id, userId: req.user});
        if (!workout) {
            return res.status(404).json({msg: "No workout data found"});
        }
        await Exercise.deleteMany({workoutId: req.params.id});
        res.json({msg: "Workout deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Update a users workout(protected)
router.put("/:id", auth, async (req, res) => {
    try {
        const {title, cardio, exercises} = req.body;
        let workout = await Workout.findOne({_id: req.params.id, userId: req.user});
        if (!workout) {
            return res.status(404).json({msg: "No workout data found"});
        }
        if (title) {
            workout.title = title;
        }
        if (cardio) {
            workout.cardio = cardio;
        }
        if (exercises && exercises.length > 0) {
            for (let ex of exercises) {
                if (ex._id) {
                    await Exercise.findByIdAndUpdate(ex._id, {
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight,
                    });
                } else {
                    const newExercise = new Exercise({
                        userId: req.user,
                        workoutId: workout._id,
                        name: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight,
                    });
                    await newExercise.save();
                    workout.exercises.push(newExercise._id);
                }
            }
        }
        await workout.save();
        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Delete a specific exercise from a workout(protected)
router.put("/:workoutId/exercises/:exerciseId", auth, async (req, res) => {
    try {
        const {workoutId, exerciseId} = req.params;
        let workout = await Workout.findOne({_id: workoutId, userId: req.user});
        if (!workout) {
            return res.status(404).json({msg: "Workout not found"});
        }
        workout.exercises = workout.exercises.filter(id => id.toString() !== exerciseId);
        await workout.save();
        await Exercise.findOneAndDelete({_id: exerciseId, workoutId});
        res.json({msg: "Exercise removed from the workout"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
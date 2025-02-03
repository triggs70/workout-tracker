const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, //references the logging user
    workoutId: {type: mongoose.Schema.Types.ObjectId, ref: "Workout", required: true}, //references a specific workout
    name: {type: String, required: true}, //Exercise name (Bench press, cable fly, etc)
    date: {type: Date, default: Date.now},
    sets: {type: Number, required: true},
    reps: {type: Number, required: true},
    weight: {type: Number, required: false} //Can have excercises w/o weight
});

//indexing for easier search by exercise name
ExerciseSchema.index({name: 1, userId: 1});

module.exports = mongoose.model("Exercise", ExerciseSchema);
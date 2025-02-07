const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, //Specifies what user workout referencing
    title: {type: String, required: true}, //User defined title (Chest day, Back day, etc)
    date: {type: Date, default: Date.now}, //Date entered
    exercises: [{type: mongoose.Schema.Types.ObjectId, ref: "Exercise"}], //list of excercise entities (Bench press, chest fly, etc)
    cardio: {
        type: {type: String},
        duration: Number
    }
});

module.exports = mongoose.model("Workout", WorkoutSchema);
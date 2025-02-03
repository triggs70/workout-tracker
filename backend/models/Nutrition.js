const mongoose = require("mongoose");

const NutritionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, default: Date.now},
    calories: {type: Number, required: true},
    protein: {type: Number, required: true},
    carbs: {type: Number, required: true},
    fat: {type: Number, required: true}
});

//Prevenets duplicate entries for same day
NutritionSchema.index({userId: 1, date: 1}, {unique: true});

module.exports = mongoose.model("Nutrition", NutritionSchema);
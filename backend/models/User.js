const mongoose = require("mongoose");

//Define the user model
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true}, //Users full name
    email: {type: String, required: true, unique: true}, //User email
    password: {type: String, required: true}, //User password, will be hashed
    joinDate: {type: Date, default: Date.now} //not required from user, automatically updated
}); 

module.exports = mongoose.model("User", UserSchema);
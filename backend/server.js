//Dependencies required 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
console.log("Loaded env file");
console.log("MONGO_URI:", process.env.MONGO_URI);
require("./models/User"); //User db schema

const app = express();

//Middleware for app 
app.use(express.json());
app.use(cors());

//MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB Atlas connection error:", err));

//API
app.get('/api', (req,res) => {
    res.json({ message: "App is running"});
});

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
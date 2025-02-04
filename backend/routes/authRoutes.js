const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

router.post(
    "/register",
    [
        body("name", "Name is required").not().isEmpty(),
        body("email", "Enter valid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {name, email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if (user) {
                return res.status(400).json({msg: "User with this email already exists"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt); //Hash password
            user = new User({name, email, password: hashedPass});
            await user.save();
            const payload = {userId: user.id};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
            res.status(201).json({token});
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

router.post(
    "/login",
    [
        body("email", "Please enter a valid email").isEmail(),
        body("password", "Password required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({msg: "Email not associated with an account"});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({msg: "Incorrect password"});
            }
            const payload = {userId: user.id};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
            res.json({token});
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
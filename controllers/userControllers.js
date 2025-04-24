const User = require('../models/userModel'); // Correct: Capitalized model name
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register Controller
exports.registerController = async (req, res) => {
    console.log("inside registerController");
    const { username, phonenumber, email, password, country } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(406).json("Account already exists! Please login.");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            phonenumber,
            email,
            password: hashedPassword,
            country
        });

        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_PASSWORD);

        res.status(200).json({ newUser, token });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Registration failed", details: err });
    }
};

// Login Controller
exports.loginController = async (req, res) => {
    console.log("inside loginController");
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json("Invalid Email/Password");
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json("Invalid Email/Password");
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_PASSWORD);

        res.status(200).json({
            user: existingUser,
            token
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Login failed", details: err });
    }
};

// Get All Users Controller
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().select('-password'); // Avoid name conflict
        res.status(200).json(allUsers);
    } catch (err) {
        console.error('Failed to fetch users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

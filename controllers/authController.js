const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token, user: { id: user._id, username, email } });
    } catch (error) {
        console.error("🔴 Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        console.error("🔴 Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("🔴 Profile Fetch Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error("🔴 Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers };
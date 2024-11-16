const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/authUtils');

// Signup function
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Email already registered" }));
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "User registered successfully" }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid credentials" }));
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid credentials" }));
        }

        const token = generateToken(user._id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Logged in successfully", token }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server error", error: error.message }));
    }
};

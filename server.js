const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors());

// Serve static folders (matches your structure)
app.use(express.static("public"));
app.use("/owner", express.static("owner"));
app.use("/student", express.static("student"));

// ================= DATABASE =================
// 👉 Replace YOUR_PASSWORD with your Atlas password
mongoose.connect("mongodb+srv://manu:manu123@cluster0.hysyd.mongodb.net/loginDB?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

// ================= MODEL =================
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ message: "Please fill all fields" });
        }

        if (!username.endsWith("@admin") && !username.endsWith("@user")) {
            return res.json({ message: "Username must end with @admin or @user" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = username.endsWith("@admin") ? "admin" : "user";

        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.json({ message: "Account created successfully" });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ message: "Please fill all fields" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            role: user.role
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ================= SERVER =================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
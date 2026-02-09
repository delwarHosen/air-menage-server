import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../utils/sendEmail.js";

// Create User 
export const createUser = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const { fullName, email, password, role } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ 
                msg: "Please provide all required fields" 
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                msg: "User already exists" 
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            fullName,
            email,
            password: hashPassword,
            role: role || 'guest', // Default role
            profileImage: req.file ? `/uploads/${req.file.filename}` : null
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            msg: "User created successfully",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            },
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ 
            msg: error.message || "Server error" 
        });
    }
}

// Login User
export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
// console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({ 
                msg: "Please provide email and password" 
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ 
                msg: "Invalid email or password" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ 
                msg: "Invalid email or password" 
            });
        }

        // Generate token 
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            msg: error.message || "Server error" 
        });
    }
};


// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetCode = code;
        user.resetCodeExpire = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendEmail(email, code);
        res.json({ msg: "Verification code sent to email" });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

// Verify reset code
export const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetCode !== code || user.resetCodeExpire < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired code" });
        }

        res.json({ msg: "Code verified successfully" });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetCode = undefined;
        user.resetCodeExpire = undefined;

        await user.save();
        res.json({ msg: "Password reset successful" });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
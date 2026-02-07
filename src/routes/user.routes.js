import express from "express";
import multer from "multer";
import path from "path";
import { createUser, forgotPassword, loginUser, resetPassword, verifyResetCode } from "../controllers/user.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "src/uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    }
});


router.post("/register", upload.single("profileImage"), createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
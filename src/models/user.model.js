import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['guest', 'host', 'cleaner'],
        default: 'guest',
    },
    profileImage: {
        type: String,
        default: null,
    },
    resetCode: String,
    resetCodeExpire: Date,
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
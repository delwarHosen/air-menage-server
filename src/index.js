import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/property.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// CORS - 
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("src/uploads"));

// Logging middleware (debugging এর জন্য)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    next();
});

// Routes
app.use("/api", userRoutes);
app.use("/api/properties", propertyRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "Server is running...",
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({ 
        message: "API is working!",
        port: PORT
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        msg: err.message || "Server error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        msg: "Route not found",
        path: req.path
    });
});

// Database connection এবং server start
connectDB().then(() => {
    console.log("✅ MongoDB connected successfully");
    
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port: ${PORT}`);
        console.log(`📡 Local: http://localhost:${PORT}`);
        console.log(`📡 Network: http://0.0.0.0:${PORT}`);
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
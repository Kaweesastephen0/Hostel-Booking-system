import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import hostelRoute from './routes/hostelRoute.js'
import roomRoute from "./routes/roomRoute.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/hostels', hostelRoute)
app.use("/api/rooms", roomRoute);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/premium", hostelRoute), 
 

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ 
        success: true, 
        message: "Hostel Booking API is running!",
        timestamp: new Date().toISOString()
    });
});

// Legacy endpoint for keeping the backward compatibility.
app.get("/api/notes", (req, res) => {
    res.json({ 
        success: true, 
        message: "You are in the Uganda Hostel Booking API!" 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.all('/', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(` Hostel Booking API started on port ${PORT}!!`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Hostels API: http://localhost:${PORT}/api/hostels`);
});
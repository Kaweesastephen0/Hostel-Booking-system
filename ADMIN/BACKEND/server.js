import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import hostelRoute from "./routes/hostelRoute.js";
import roomRoute from "./routes/roomRoute.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import userRoutes from "./routes/users.js";
import paymentRoutes from "./routes/payments.js";
import settingsRoutes from "./routes/settings.js";
import activityLogRoutes from "./routes/activityLogs.js";
import frontUsersRoutes from "./routes/frontUsers.js";
import searchRoutes from "./routes/search.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/hostels', hostelRoute);
app.use("/api/rooms", roomRoute); 
app.use("/api/auth", authRoutes); 
app.use("/api/bookings", bookingRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/logs", activityLogRoutes);
app.use('/api/frontusers', frontUsersRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/premium", hostelRoute);
 

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
    // Prefer explicit status codes from thrown errors (err.statusCode or err.status)
    const statusCode = err.statusCode || err.status || 500;
    console.error(err.stack || err);
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack || err.message : undefined
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(` Hostel Booking API started on port ${PORT}!!`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Hostels API: http://localhost:${PORT}/api/hostels`);
});
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

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URI
    
    ]
    

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if(allowedOrigins.includes(origin)){
        return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/hostels', hostelRoute);
app.use("/api/rooms", roomRoute); 
app.use("/api/auth", authRoutes); 
app.use("/api/bookings", bookingRoutes); 
app.use("/api/auth", authRoutes); // This would have been the next error
app.use("/api/bookings", bookingRoutes); // This would have been the error after that
app.use("/api/premium", hostelRoute);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
 

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(` Hostel Booking API started on port ${PORT}!!`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Hostels API: http://localhost:${PORT}/api/hostels`);
});

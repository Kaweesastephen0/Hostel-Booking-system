/********************************************************************
 *  server.js – Express API for Muk-Book Hostel Booking
 *  ----------------------------------------------------
 *  • CORS is now **dynamic** and **secure** – only your Vercel URL
 *    (and localhost for dev) are allowed.
 *  • Preflight (OPTIONS) requests are handled automatically.
 *  • All other middleware (helmet, rate-limit, cookie-parser) stay
 *    exactly where they were.
 *  • Minor clean-ups (duplicate logs, unused 404 handlers).
 ********************************************************************/

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/database.js";

import hostelRoute from "./routes/hostelRoute.js";
import roomRoute from "./routes/roomRoute.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// ------------------------------------------------------------------
// 1. Load env variables & connect to MongoDB
// ------------------------------------------------------------------
dotenv.config();
connectDB();

const app = express();

// ------------------------------------------------------------------
// 2. Security & Utility Middleware
// ------------------------------------------------------------------
app.use(helmet());                 // HTTP headers security
app.use(cookieParser());           // Parse cookies (used in auth)

// Rate limiting – protects against brute-force / DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,        // 15 minutes
  max: 100,                        // 100 requests per IP per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ------------------------------------------------------------------
// 3. CORS – **the part that was blocking your Vercel frontend**
// ------------------------------------------------------------------
/*
   - `process.env.FRONTEND_URL` is the only production origin.
   - During local development we also allow localhost (any port).
   - `credentials: true` → cookies / Authorization headers work.
   - `origin` callback logs any disallowed origin for debugging.
*/
const allowedOrigins = [
  process.env.FRONTEND_URL,               // e.g. https://hostel-booking-system-two.vercel.app
  // ---- local dev helpers (feel free to delete in prod) ----
  "http://localhost:3000",
  "http://localhost:5173",   // Vite default
];

const corsOptions = {
  origin: (origin, callback) => {
    // Non-browser tools (Postman, curl) have no `origin` header
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,               // needed for cookies / auth
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Explicitly handle pre-flight for **all** routes (just in case)
app.options("*", cors(corsOptions));

// ------------------------------------------------------------------
// 4. Body parsers
// ------------------------------------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------
// 5. API Routes
// ------------------------------------------------------------------
app.use("/api/hostels", hostelRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);

// ------------------------------------------------------------------
// 6. Health / Info Endpoints
// ------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Hostel Booking API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/notes", (req, res) => {
  res.json({
    success: true,
    message: "You are in the Uganda Hostel Booking API!",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Muk-Book Hostel Booking API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      hostels: "/api/hostels",
      rooms: "/api/rooms",
      auth: "/api/auth",
      contact: "/api/contact",
    },
  });
});

// ------------------------------------------------------------------
// 7. Global Error Handler (must be **after** routes)
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// ------------------------------------------------------------------
// 8. 404 for any /api/* route that wasn’t matched
// ------------------------------------------------------------------
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// ------------------------------------------------------------------
// 9. Start the server
// ------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Hostel Booking API started on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Hostels API: http://localhost:${PORT}/api/hostels`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
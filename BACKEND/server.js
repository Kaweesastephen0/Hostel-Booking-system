/********************************************************************
 *  server.js – Muk-Book Hostel Booking API
 *  ----------------------------------------------------
 *  • CORS: Allows only your Vercel frontend + localhost (dev)
 *  • URL Normalization: Removes trailing slashes for proper origin matching
 *  • Secure: helmet, rate-limit, cookie-parser
 *  • Ready for Render.com deployment
 ********************************************************************/

import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

// Database & Routes
import connectDB from "./config/database.js"
import hostelRoute from "./routes/hostelRoute.js"
import roomRoute from "./routes/roomRoute.js"
import authRoutes from "./routes/authRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"

// ------------------------------------------------------------------
// 1. Load Environment Variables & Connect to MongoDB
// ------------------------------------------------------------------
dotenv.config() // Loads from Render dashboard (no .env file needed)
connectDB() // Connects to MongoDB Atlas

const app = express()

// ------------------------------------------------------------------
// 2. Security Middleware
// ------------------------------------------------------------------
app.use(helmet()) // Secure HTTP headers
app.use(cookieParser()) // Parse cookies (used in auth)

// Rate limiting: 100 requests per IP every 15 mins
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// ------------------------------------------------------------------
// 3. CORS – ONLY ALLOW YOUR FRONTEND
// ------------------------------------------------------------------

// Helper function to normalize URLs by removing trailing slashes
const normalizeUrl = (url) => {
  if (!url) return url
  return url.replace(/\/$/, "") // Remove trailing slash if present
}

// Normalize all allowed origins to handle trailing slash mismatch
const allowedOrigins = [
  normalizeUrl(process.env.FRONTEND_URL), // e.g. https://hostel-booking-system-two.vercel.app
  "http://localhost:3000", // Local dev
  "http://localhost:5173", // Vite default
].filter(Boolean) // Remove undefined if FRONTEND_URL not set

console.log("[CORS] Allowed origins:", allowedOrigins)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow tools like Postman (no origin)
    if (!origin) {
      console.log("[CORS] Allowing request with no origin (Postman/tools)")
      return callback(null, true)
    }

    // Normalize the incoming origin for comparison
    const normalizedOrigin = normalizeUrl(origin)

    if (allowedOrigins.includes(normalizedOrigin)) {
      console.log(`[CORS] ✓ Allowed origin: ${origin}`)
      callback(null, true)
    } else {
      console.warn(`[CORS] ✗ Blocked origin: ${origin}`)
      console.warn(`[CORS] Allowed origins: ${allowedOrigins.join(", ")}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true, // Allow cookies & Authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// Apply CORS to all routes
app.use(cors(corsOptions))

// NO NEED FOR: app.options("*", ...) → IT CRASHES THE SERVER
// cors() already handles preflight automatically

// ------------------------------------------------------------------
// 4. Body Parsing
// ------------------------------------------------------------------
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// ------------------------------------------------------------------
// 5. API Routes
// ------------------------------------------------------------------
app.use("/api/hostels", hostelRoute)
app.use("/api/rooms", roomRoute)
app.use("/api/auth", authRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/bookings", bookingRoutes)

// ------------------------------------------------------------------
// 6. Health & Info Endpoints
// ------------------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Hostel Booking API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

app.get("/api/notes", (req, res) => {
  res.json({
    success: true,
    message: "You are in the Uganda Hostel Booking API!",
  })
})

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
      bookings: "/api/bookings",
    },
  })
})

// ------------------------------------------------------------------
// 7. Global Error Handler (must be after routes)
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// ------------------------------------------------------------------
// 8. 404 Handler for /api/*
// ------------------------------------------------------------------
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  })
})

// ------------------------------------------------------------------
// 9. Start Server
// ------------------------------------------------------------------
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Hostel Booking API running on port ${PORT}`)
  console.log(`Health Check: http://localhost:${PORT}/api/health`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "Not set"}`)
  console.log(`Normalized Frontend URL: ${normalizeUrl(process.env.FRONTEND_URL) || "Not set"}`)
})

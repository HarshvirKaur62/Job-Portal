import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic CORS configuration supporting both local dev and deployed frontend domains
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// Connect DB middleware for serverless invocations
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

const PORT = process.env.PORT || 8000;

// Root / Health check route
app.get("/", (req, res) => {
    res.json({ message: "Job Portal API is running", status: "success" });
});

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error("SERVER_ERROR:", err.message);
    if (err.name === 'MulterError' || err.message.includes("Only images")) {
        return res.status(400).json({
            message: err.message,
            success: false
        });
    }
    return res.status(err.status || 500).json({
        message: err.message || "Internal server error.",
        success: false
    });
});

// Start local server if not running inside a serverless handler
if (!process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    });
}

export default app;

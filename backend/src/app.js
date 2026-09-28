import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import quizzesRoutes from './routes/quiz.routes.js'
import attemptRoutes from './routes/attempt.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quiz Maker API is running",
  });
});

// auth
app.use('/api/auth', authRoutes);

// User
app.use('/api/user', userRoutes);

// Quiz
app.use('/api/quizzes', quizzesRoutes);

// Quiz Attempts
app.use('/api/quizzes/:quizId/attempt', attemptRoutes);

// Dashboard
app.use('/api/dashboard', dashboardRoutes);

export default app;
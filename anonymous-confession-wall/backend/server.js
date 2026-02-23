import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import cookieParser from 'cookie-parser';


// 1. Load env vars BEFORE anything else
dotenv.config();

// 2. Import DB and Configs
import connectDB from './config/db.js';
import './config/passport.js';

// 3. Import Routes
import authRoutes from './routes/authRoutes.js';
import confessionRoutes from './routes/confessionRoutes.js';

// 4. Connect to Database
connectDB();

const app = express();

// 5. Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// 6. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// 7. Body parsers & sanitization (MUST BE ABOVE ROUTES)
app.use(express.json());
app.use(cookieParser());
//app.use(mongoSanitize()); // Prevent MongoDB Injection
//app.use(xss()); // Prevent XSS attacks

// 8. Routes (Now they can successfully read req.cookies and req.body!)
app.use('/api/auth', authRoutes);
app.use('/api/confessions', confessionRoutes);

// 9. Base Route
app.get('/', (req, res) => {
  res.send('Anonymous Confession Wall API is running...');
});

// 10. Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { config } from './configs/app.config.js';
import './configs/passport.config.js';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDb from './configs/database.config.js';
import authRoutes from './routes/auth.routes.js';

import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.middleware.js';

const app = express();

// DATABASE CONNECTION
connectDb();

// MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// REQUEST AND REQ METHOD/URL LOGGER
app.use((req, res, next) => {
  logger.info(`Received ${req.method} from ${req.url}`);
  next();
});

// ROUTES
app.use('/api/auth', authRoutes);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

// STARTING THE SERVER
app.listen(config.PORT, () => {
  logger.info(`Server is listening on ${config.PORT} in ${config.NODE_ENV}`);
});

// UNHANDLED EXCEPTIONS HANDLERS
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at', promise, 'reason:', reason);
});

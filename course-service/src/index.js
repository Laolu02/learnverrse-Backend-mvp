import 'dotenv/config';
import express from 'express';
import { config } from './configs/app.config.js';
import cors from 'cors';
import helmet from 'helmet';
import connectDb from './configs/database.config.js';

import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import { router } from './router/query-route.js';
import educatorRoutes from './routes/educator.routes.js';

const app = express();

// DATABASE CONNECTION
connectDb();

// MIDDLEWARES
app.use(helmet());
app.use(cors());
app.use(express.json());

// REQUEST AND REQ METHOD/URL LOGGER
app.use((req, res, next) => {
  logger.info(`Received ${req.method} from ${req.url}`);
  console.log(req.body);
  next();
});

console.log(config.PORT);

// ROUTES
app.use("/api", router)
app.use('/api/educator', educatorRoutes);

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

import mongoose from 'mongoose';
import logger from '../api/v1/utils/logger.js';

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB');
    process.exit(1);
  }
};

export default connectDb;

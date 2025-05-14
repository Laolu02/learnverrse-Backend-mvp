import getEnv from '../utils/get-env.js';

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '3002'),
  BASE_PATH: getEnv('BASE_PATH', '/api'),
  MONGO_URI: getEnv('MONGO_URI', ''),
});

export const config = appConfig();

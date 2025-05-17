import getEnv from '../utils/get-env.js';

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '3001'),
  BASE_PATH: getEnv('BASE_PATH', '/api'),
  MONGO_URI: getEnv('MONGO_URI', ''),

  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL'),

  ACCESS_TOKEN: getEnv('ACCESS_TOKEN'),

  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', 'localhost'),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL'),
  EMAIL_USER: getEnv('EMAIL_USER', ''),
  EMAIL_PASS: getEnv('EMAIL_PASS', ''),
});

export const config = appConfig();

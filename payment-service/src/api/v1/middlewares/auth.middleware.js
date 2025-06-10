import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../utils/appError.js';
import { ErrorCodeEnum } from '../enums/error-code.enum.js';
import AsyncHandler from './asyncHandler.js';

/**
 * Authentication middleware to verify JWT tokens and ensure user is authenticated
 * Attaches the decoded user information to the request object
 */
const auth = AsyncHandler(async (req, res, next) => {
  // Check if authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException(
      'Authentication required. Please provide a valid token.',
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
  }

  // Extract token
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedException(
      'Authentication token is required',
      ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token has required user information
    if (!decoded || !decoded.id) {
      throw new UnauthorizedException(
        'Invalid authentication token',
        ErrorCodeEnum.AUTH_INVALID_TOKEN
      );
    }

    // Attach user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    throw new UnauthorizedException(
      'Invalid or expired token',
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
  }
});

/**
 * Middleware to ensure the user has educator role
 */
const isEducator = AsyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'educator') {
    throw new UnauthorizedException(
      'Access denied. Only educators can perform this action.',
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
  
  next();
});

export { auth, isEducator };


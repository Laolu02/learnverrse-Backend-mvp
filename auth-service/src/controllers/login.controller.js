import { HTTPSTATUS } from '../configs/http.config.js';
import AsyncHandler from '../middlewares/asyncHandler.js';
import { loginLearnerService } from '../services/login.service.js';
import { loginSchema } from '../validations/login.validation.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const loginLearnerController = AsyncHandler(
  async (req, res, next) => {
    //Validate
    const credentials = loginSchema.parse({ ...req.body });

    //Fetch & verify
    const { user } = await loginLearnerService(credentials);

    //Sign JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '5m' }
    );

    //Strip sensitive info
    const safeUser = user.toObject();
    delete safeUser.password;

    //Send HTTP response
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: 'Login successful',
      data: { user: safeUser, token },
    });
  }
);

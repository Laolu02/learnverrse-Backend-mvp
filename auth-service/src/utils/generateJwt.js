import jwt from 'jsonwebtoken';
import { config } from '../configs/app.config.js';
import crypto from 'crypto';
import RefreshTokenModel from '../model/refreshToken.model.js';

const generateJwtToken = async (user) => {
  const accessToken = jwt.sign(
    {
      user: {
        id: user._id,
      },
    },
    config.ACCESS_TOKEN,
    { expiresIn: '1h' }
  );

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // refresh token expires in 7 days

  await RefreshTokenModel.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

export default generateJwtToken;

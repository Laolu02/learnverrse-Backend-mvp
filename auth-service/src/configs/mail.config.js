// src/config/mail.ts
import nodemailer from 'nodemailer';
import config from '../configs/app.config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export default transporter;

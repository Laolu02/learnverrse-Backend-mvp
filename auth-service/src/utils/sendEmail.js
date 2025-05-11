import nodemailer from 'nodemailer';
import logger from './logger.js';

export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to}`);
    } catch (error) {
        logger.error(`Error sending email: ${error.message}`);
        throw new Error('Error sending email');
    }
};
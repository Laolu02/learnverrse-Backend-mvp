import { z } from 'zod';

export const resetPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    token: z.number().min(6, { message: 'Token must be at least 6 characters' }),
});

export const newPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    newPassword: z.string().trim().min(4),
});

import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth.validation.js';

export const setPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

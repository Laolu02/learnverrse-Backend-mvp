import { z } from 'zod';
import { emailSchema, passwordSchema } from './register.validation';

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

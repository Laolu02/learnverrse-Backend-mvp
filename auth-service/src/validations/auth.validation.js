import { z } from 'zod';

// common fields

export const firstNameSchema = z.string().trim().min(1).max(255);
export const lastNameSchema = z.string().trim().min(1).max(255);

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const dateOfBirthSchema = z.date().refine(
  (date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    const monthDifference = new Date().getMonth() - date.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && new Date().getDate() < date.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  },
  {
    message: 'You must be at least 18 years old',
  }
);

export const profilePictureSchema = z
  .string()
  .url()
  .optional()
  .refine(
    (url) => {
      return /\.(jpg|jpeg|png|gif)$/i.test(url);
    },
    {
      message: 'Profile picture must be a valid image URL (JPG, PNG, or GIF)',
    }
  );

// auth validations

export const registerSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

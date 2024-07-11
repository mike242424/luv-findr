import z from 'zod';

export const registerUserSchema = z
  .object({
    email: z.string().email('Must be a valid email.'),
    password: z.string().min(1, 'Must be a valid password.'),
    confirmPassword: z.string().min(1, 'Must be a valid password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

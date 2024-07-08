import z from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email('Must be a valid email.'),
  password: z.string().min(1, 'Must be a valid password.'),
});

import z from 'zod';

const GenderEnum = [
  'male',
  'female',
  'nonBinary',
  'other',
  'preferNotToSay',
] as const;

const isValidDateString = (dateString: string): boolean => {
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return datePattern.test(dateString);
};

const genderEnumSchema = z.enum(GenderEnum, {
  errorMap: () => ({
    message:
      'Must be one of the predefined gender options: male, female, nonBinary, other, or preferNotToSay.',
  }),
});

export const registerUserSchema = z.object({
  email: z.string().email('Must be a valid email.'),
  password: z.string().min(1, 'Must be a valid password.'),
  firstName: z.string().min(1, 'Must be a valid first name.'),
  lastName: z.string().min(1, 'Must be a valid last name.'),
  dateOfBirth: z.string().refine(isValidDateString, {
    message: 'Date must be in the format of DD/MM/YYYY.',
  }),
  usersGender: genderEnumSchema,
  interestedInGender: genderEnumSchema,
  about: z.string().min(1, 'Must be valid about me information.'),
});

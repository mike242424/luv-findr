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
    message: 'Must be one of the predefined gender options.',
  }),
});

export const updateUserSchema = z.object({
  firstName: z.string().nonempty('First Name is required.'),
  lastName: z.string().nonempty('Last Name is required.'),
  dateOfBirth: z.string().refine(isValidDateString, {
    message: 'Date must be in the format of DD/MM/YYYY.',
  }),
  usersGender: genderEnumSchema,
  interestedInGender: genderEnumSchema,
  about: z.string().nonempty('About me information is required.'),
});

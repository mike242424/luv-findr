import { Gender } from "@prisma/client";

export type UserDetailsFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
  state: string;
  usersGender: Gender | string;
  interestedInGender: Gender | string;
  profession: string;
  about: string;
  profilePhoto: string;
};

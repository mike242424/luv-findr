import axios from 'axios';
import { UserDetailsFormData } from '@/types/userDetailsFormData';

export async function getUsers() {
  const response = await axios.get('/api/users');
  return response.data;
}

export async function getUserDetails() {
  const response = await axios.get('/api/users/user');
  return response.data;
}

export async function fetchUserDetails(userId: string) {
  const response = await axios.get(`/api/users/user`, {
    params: { userId },
  });
  return response.data;
}

export async function updateUser(values: UserDetailsFormData) {
  const response = await axios.put('/api/users', values);
  return response.data;
}

export async function fetchUserDetailsAndFormatDate() {
  const response = await axios.get('/api/users/user');
  const userDetails = response.data.user;

  if (userDetails.dateOfBirth) {
    const date = new Date(userDetails.dateOfBirth);
    userDetails.dateOfBirth = `${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  return userDetails;
}

import axios from 'axios';
import { RegisterUserFormData } from '@/types/registerUserFormData';

export async function registerUser(values: RegisterUserFormData) {
  const response = await axios.post('/api/auth/register', values);
  return response.data;
}

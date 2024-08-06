import axios from 'axios';

export async function fetchMessages(matchId: string) {
  const response = await axios.get(`/api/users/user/messages/${matchId}`);
  return response.data;
}

export async function sendMessage(data: { matchId: string; content: string }) {
  const response = await axios.post(`/api/users/user/messages`, data);
  return response.data;
}

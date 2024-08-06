import axios from 'axios';

export async function getMatches() {
  const response = await axios.get('/api/users/user/matches');
  return response.data;
}

export async function unmatchUser(matchUserId: string) {
  try {
    const response = await axios.delete('/api/users/user', {
      data: { matchUserId },
    });
    return response.data;
  } catch (error) {
    console.error('Error unmatching user:', error);
    throw error;
  }
}

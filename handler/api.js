import axios from 'axios';

const API_BASE_URL = 'https://api.kucoin.com';

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/symbols`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

import Axios from 'axios';

export const axios = Axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
});
axios.interceptors.response.use((response) => {
  return response.data;
});

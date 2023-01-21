import { query, page, per_page } from '../index.js';
import axios from 'axios';

export default async function fetchImages() {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32970845-e4fc8afb31274d73d690834b7';
  const QUERY_PARAM = `q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${QUERY_PARAM}`);

  return response.data;
}

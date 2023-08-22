import axios from 'axios';

const API_KEY = '38873107-2fd59623250c411d575012e5a';
const BASE_URL = 'https://pixabay.com/api/';


async function fetchImages(query, page, per_page) {
  const params = new URLSearchParams({
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: per_page,
  });

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${params}`);
  return response.data;
}
 

export { fetchImages };
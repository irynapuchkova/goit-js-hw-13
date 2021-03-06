import axios from 'axios';

const PIXABAY_KEY = '22640715-8f791d5797d8fe249801e9206';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';


export async function fetchQuery(query, page) {
  const response = await axios.get(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&${PARAMS}&page=${page}&per_page=40`);
  return response;
}
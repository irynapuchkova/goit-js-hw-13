import './sass/main.scss';
import Notiflix from "notiflix";

import photoCard from './template/photo_card.hbs'
import getRefs from './js/getRefs';
import { fetchQuery } from './js/fetch_picture';
// import {INPUT_VALUE,DATA_STATE,PAGE,TOTAL_HITS,HITS,} from './js/constant'

let INPUT_VALUE = '';
let DATA_STATE = [];
let PAGE = 1;
let TOTAL_HITS = 0;
const HITS = 40;
let QUERY;

const refs = getRefs();


refs.input.addEventListener('input', handleInputValue) 
refs.inputBtn.addEventListener('click', onFetchQuery)
refs.loadMoreBtn.addEventListener('click', onMoreHits)

refs.loadMoreBtn.classList.add('visually-hidden');

function handleInputValue(e) {
  e.preventDefault();
  INPUT_VALUE = e.target.value.trim();
}
  
async function onFetchQuery(e) {
  e.preventDefault();
 
  if (INPUT_VALUE === '') {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  }
  
  try {
    QUERY = await fetchQuery(INPUT_VALUE, PAGE, HITS );
    const pictures = await QUERY.data.hits;
    TOTAL_HITS = await QUERY.data.totalHits;

    DATA_STATE = [...pictures];

    const markup = await photoCard(DATA_STATE);
    refs.gallery.innerHTML = markup;

    Notiflix.Notify.info(`We've found ${TOTAL_HITS} hits of query.`);

    if (pictures.length < 40) {
        refs.loadMoreBtn.classList.add('visually-hidden');
        Notiflix.Notify.warning("We're sorry, but that is all of search results.");
        }

    if (TOTAL_HITS > 40) {
      refs.loadMoreBtn.classList.remove('visually-hidden');
      refs.loadMoreBtn.addEventListener('click', onMoreHits);
      return;
    } 
  
    if (pictures.length === 0) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

  } catch (error) {
    console.error(error);
  }
}

async function onMoreHits(e) {
  e.preventDefault();

    try {
      QUERY = await fetchQuery(INPUT_VALUE, ++PAGE, HITS);
      const pictures = await QUERY.data.hits;

      DATA_STATE = [...DATA_STATE, ...pictures];

      const markup = await photoCard(DATA_STATE);

      Notiflix.Notify.success('New hits are loading');
      refs.gallery.insertAdjacentHTML('beforeend', markup);

    }
  
    catch (error) {
      console.error(error);
    }
}


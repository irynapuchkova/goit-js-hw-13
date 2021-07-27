import './sass/main.scss';
import Notiflix from "notiflix";

import photoCard from './template/photo_card.hbs'
import getRefs from './js/getRefs';
import { fetchPictures } from './js/fetch_picture';
// import {INPUT_VALUE,DATA_STATE,PAGE,TOTAL_HITS,HITS,} from './js/constant'

let INPUT_VALUE = '';
let DATA_STATE = [];
let PAGE = 1;
let TOTAL_HITS = 0;
const HITS = 40;
let QUERY;

const refs = getRefs();


refs.loadMoreBtn.setAttribute('hidden', 'hidden');

console.log(refs.loadMoreBtn);
refs.gallery.innerHTML = '';

refs.input.addEventListener('input', getQueryContex) 
refs.inputBtn.addEventListener('click', fetchQuery)
refs.loadMoreBtn.addEventListener('click', getMoreHits)

function getQueryContex(e) {
  e.preventDefault();
  // refs.loadMoreBtn.setAttribute('hidden', 'hidden');
  INPUT_VALUE = e.target.value.toLowerCase().trim();
  if (!INPUT_VALUE) {
    window.location.reload();
    refs.loadMoreBtn.setAttribute('hidden', 'hidden');
  }
  return INPUT_VALUE;
}
  
async function fetchQuery(e) {
  e.preventDefault();
 
  if (INPUT_VALUE === '') {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  } else {
    try {
      QUERY = await fetchPictures(INPUT_VALUE, PAGE, HITS );
      const pictures = await QUERY.data.hits;
      TOTAL_HITS = await QUERY.data.totalHits;
      DATA_STATE = [...pictures];

      refs.inputBtn.setAttribute('disabled', 'disabled')
    
      if (pictures.length === 0 || INPUT_VALUE === '') {
        refs.inputBtn.removeAttribute('disabled');
        refs.gallery.innerHTML = '';
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      }

      if (TOTAL_HITS > 0) {
        Notiflix.Notify.info(`For you we've found ${TOTAL_HITS} hits of query.`);

        const markup = await photoCard(DATA_STATE);
        refs.gallery.innerHTML = markup;
      }

      if (TOTAL_HITS > 40) {
        refs.loadMoreBtn.removeAttribute('hidden');
        refs.loadMoreBtn.addEventListener('click', getMoreHits);
        return;
      } else {
        refs.loadMoreBtn.setAttribute('hidden', 'hidden');
        refs.inputBtn.setAttribute('abled', 'abled');
      }

    } catch (error) {
      console.error(error);
    }
  }
}

async function getMoreHits(e) {
  e.preventDefault();
  
  if (DATA_STATE.length === TOTAL_HITS) {
    // refs.loadMoreBtn.setAttribute('hidden', 'hidden');
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");

    // refs.inputBtn.setAttribute('abled', 'abled');
    return;
  } else {
    try {
      QUERY = await fetchPictures(INPUT_VALUE, ++PAGE, HITS);
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
}



// Notiflix.Notify.warning('Warning message text');

import './sass/main.scss';
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";


import photoCard from './template/photo_card.hbs'
import getRefs from './js/getRefs';
import { fetchQuery } from './js/fetch_picture';

let INPUT_VALUE = '';
let DATA_STATE = [];
let page = 1;
let TOTAL_HITS;

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
    TOTAL_HITS = 0;
    const QUERY = await fetchQuery(INPUT_VALUE, page);
    const pictures = await QUERY.data.hits;
    TOTAL_HITS = await QUERY.data.totalHits;
    Notiflix.Notify.info(`We've found ${TOTAL_HITS} hits of query.`);


    const markup = await photoCard(pictures);
    refs.gallery.innerHTML = markup;

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

    if (pictures.length < 40) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.warning("We're sorry, but that is all of search results.");
    }

  } catch (error) {
    console.error(error);
  }
}

async function onMoreHits(e) {
  e.preventDefault();

  try {   
      page += 1;
      const QUERY = await fetchQuery(INPUT_VALUE, page);
      let pictures = await QUERY.data.hits;

      const markup = await photoCard(pictures);
      Notiflix.Notify.success('New hits are loading');
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      
      DATA_STATE = [...DATA_STATE, ...pictures];

      if (pictures.length < 40) {
        refs.loadMoreBtn.classList.add('visually-hidden');
        Notiflix.Notify.warning("We're sorry, but that is all of search results.");
      }
    }
  
    catch (error) {
      console.error(error);
    }
}


import './sass/main.scss';
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";

import photoCard from './template/photo_card.hbs'
import getRefs from './js/getRefs';
import { fetchQuery } from './js/fetch_picture';

// import '../node_modules/simplelightbox/src/simple-lightbox';

let imputValue = '';
let dataState = [];
let page = 1;
let totalHits;


const refs = getRefs();

let lightboxColl = refs.imgThumb;

refs.input.addEventListener('input', handleInputValue) 
refs.inputBtn.addEventListener('click', onFetchQuery)
refs.loadMoreBtn.addEventListener('click', onMoreHits)

refs.loadMoreBtn.classList.add('visually-hidden');

function handleInputValue(e) {
  e.preventDefault();
 imputValue = e.target.value.trim();
}
  
async function onFetchQuery(e) {
  e.preventDefault();
 
  if (imputValue === '') {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  }
  
  try {
    totalHits = 0;
    const QUERY = await fetchQuery (imputValue, page);
    const pictures = await QUERY.data.hits;
    totalHits = await QUERY.data.totalHits;
    Notiflix.Notify.info(`We've found ${totalHits} hits of query.`);


    const markup = await photoCard(pictures);
    refs.gallery.innerHTML = markup;
    

    let lightbox = new SimpleLightbox(lightboxColl);
    console.log(lightbox);

    if (totalHits > 40) {
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
      const QUERY = await fetchQuery (imputValue, page);
      let pictures = await QUERY.data.hits;

      const markup = await photoCard(pictures);
      Notiflix.Notify.success('New hits are loading');
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      
    dataState = [...dataState, ...pictures];

      if (pictures.length < 40) {
        refs.loadMoreBtn.classList.add('visually-hidden');
        Notiflix.Notify.warning("We're sorry, but that is all of search results.");
      }
    
    let lightbox = new SimpleLightbox(lightboxColl).refresh();
    }
  
    catch (error) {
      console.error(error);
  }
}
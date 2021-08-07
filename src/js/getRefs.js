export default function getRefs() {
  return {
    gallery: document.querySelector('.gallery-list'),
    imgThumb: document.getElementsByClassName('imglightbox'),
    input: document.querySelector('.search-form__input'),
    inputBtn: document.querySelector('.search-form__btn'),
    loadMoreBtn: document.querySelector('.load-more'),
    
  }
}

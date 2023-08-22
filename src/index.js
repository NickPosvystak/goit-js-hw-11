import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './api';

const refs = {
  gallery: document.querySelector('.gallery '),
  loadMoreBtn: document.querySelector('.load-more'),
  searchForm: document.querySelector('.search-form'),
};

let query = '';
let page = 1;
let lightBox = new SimpleLightbox('.gallery a');
const per_page = 40;

refs.loadMoreBtn.classList.replace('load-more', 'load-more-hidden');

refs.searchForm.addEventListener('submit', onSearchForm);

function onSearchForm(event) {
  event.preventDefault();

  page = 1;
  query = event.target.elements.searchQuery.value.trim();
  refs.gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  fetchImages(query, page, per_page)
    .then(response => {
      if (response.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.gallery.insertAdjacentHTML(
          'beforeend',
          createMarkup(response.hits)
        );

        lightBox.refresh();

        Notiflix.Notify.success(
          `Hooray! We found ${response.totalHits} images.`
        );

        refs.loadMoreBtn.classList.replace('load-more-hidden', 'load-more');
      }
    })
    .catch(onFetchError)
    .finally(() => {
      refs.searchForm.reset();
    });
}

refs.loadMoreBtn.addEventListener('click', onloadMore);

function onloadMore() {
  page += 1;

  fetchImages(query, page, per_page)
    .then(response => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(response.hits));

      lightBox.refresh();

      const totalPages = Math.ceil(response.totalHits / per_page);

      if (page < totalPages) {
        refs.loadMoreBtn.classList.replace('load-more-hidden', 'load-more');
      } else {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );

        refs.loadMoreBtn.classList.replace('load-more', 'load-more-hidden');
      }
    })
    .catch(onFetchError);
}

function createMarkup(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery-link" href="${largeImageURL}">
          <div class="photo-card">
            <img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>`;
      }
    )
    .join('');
}

function onFetchError(error) {
  console.log(error);

  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

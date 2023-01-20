import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 1;
const per_page = 4;
loadMoreBtn.hidden = true;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';

  try {
    const data = await fetchImages();
    if (data.hits.length < 1) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    renderImages(data.hits);

    lightbox = new SimpleLightbox('.gallery a');
  } catch (error) {
    console.log(error.message);
  }

  loadMoreBtn.hidden = false;
}

async function onLoadMoreBtnClick() {
  try {
    page += 1;
    lightbox.destroy();

    const data = await fetchImages();
    renderImages(data.hits);

    lightbox = new SimpleLightbox('.gallery a').refresh();

    if (per_page * page >= data.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );

      loadMoreBtn.hidden = true;
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchImages() {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32970845-e4fc8afb31274d73d690834b7';
  const QUERY_PARAM = `q=${input.value}&image_type=photo&orientation=horizontal&safesearch=false&page=${page}&per_page=${per_page}`;

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${QUERY_PARAM}`);

  return response.data;
}

function renderImages(data) {
  const markup = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <a class="gallery__link" href="${largeImageURL}">
        <div class="gallery__card">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="160"/>
            <div class="info">
              <p class="info__item"><b><span>Likes</span> ${likes}</b></p>
              <p class="info__item"><b><span>Views</span> ${views}</b></p>
              <p class="info__item"><b><span>Comments</span> ${comments}</b></p>
              <p class="info__item"><b><span>Downloads</span> ${downloads}</b></p>
            </div>
        </div>
      </a>
      `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

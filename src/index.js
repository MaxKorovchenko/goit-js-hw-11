import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');

let page = 0;

form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();

  page = 0;
  gallery.innerHTML = '';

  try {
    const data = await fetchImages();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    console.log(data);
    renderImages(data.hits);
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchImages() {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '32970845-e4fc8afb31274d73d690834b7';
  const QUERY_PARAM = `q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=4`;

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${QUERY_PARAM}`);

  return response.data;
}

function renderImages(data) {
  const markup = data
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
    </div>`
    )
    .join('');

  gallery.innerHTML = markup;
}

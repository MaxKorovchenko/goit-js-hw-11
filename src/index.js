import axios from 'axios';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 1;
let per_page = 4;
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

    console.log(data);
    renderImages(data.hits);
  } catch (error) {
    console.log(error.message);
  }

  loadMoreBtn.hidden = false;
}

async function onLoadMoreBtnClick() {
  try {
    page += 1;

    const data = await fetchImages();
    renderImages(data.hits);

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
  const QUERY_PARAM = `q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${QUERY_PARAM}`);

  return response.data;
}

function renderImages(data) {
  const markup = data
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width="160"/>
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

  gallery.insertAdjacentHTML('beforeend', markup);
}

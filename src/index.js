import fetchImages from './js/fetch-images';
import scrollToTop from './js/scroll-to-top';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

export let page = 1;
export let query = '';
export const per_page = 40;

const lightbox = new SimpleLightbox('.gallery a');
scrollToTop();

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  try {
    e.preventDefault();
    page = 1;
    query = e.currentTarget.searchQuery.value;
    // loadMoreBtn.classList.add('is-hidden');

    const data = await fetchImages();

    if (!data.hits.length) {
      loadMoreBtn.classList.add('is-hidden');
      gallery.innerHTML = '';

      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      gallery.innerHTML = '';
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    renderImages(data.hits);

    windowUpScrollBy();

    lightbox.refresh();
    loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMoreBtnClick() {
  try {
    page += 1;

    const data = await fetchImages();
    if (per_page * page >= data.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );

      loadMoreBtn.classList.add('is-hidden');
    }

    renderImages(data.hits);
    windowDownScrollBy();

    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
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
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
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

function windowUpScrollBy() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  if (window.innerWidth <= 767) {
    window.scrollBy({
      top: -cardHeight * 70,
      behavior: 'smooth',
    });
  }

  if (window.innerWidth < 1200 && window.innerWidth > 767) {
    window.scrollBy({
      top: -cardHeight * 20,
      behavior: 'smooth',
    });
  }

  if (window.innerWidth >= 1200) {
    window.scrollBy({
      top: -cardHeight * 9,
      behavior: 'smooth',
    });
  }
}

function windowDownScrollBy() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

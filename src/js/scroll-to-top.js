import throttle from 'lodash.throttle';

export default function scrollToTop() {
  const btnToTop = document.querySelector('.to-top');

  document.addEventListener('scroll', throttle(onScroll, 500));
  btnToTop.addEventListener('click', onBtnToTopClick);

  function onScroll() {
    if (window.scrollY > 800) {
      btnToTop.classList.add('visible');
    } else {
      btnToTop.classList.remove('visible');
    }
  }

  function onBtnToTopClick() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

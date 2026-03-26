import { createSliderControls, initSlider, showSlide } from '../../scripts/slider.js';

/**
 * Decorates the news-carousel block.
 * Each row = one article slide: [image, content (meta + h2 + p + cta)].
 * Last row without an image is treated as a footer link.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  /* ── separate slides from optional footer ── */
  const slides = [];
  let footerRow = null;

  rows.forEach((row) => {
    const cols = [...row.children];
    const hasImage = cols[0]?.querySelector('picture') || cols[0]?.querySelector('img');
    if (hasImage) {
      slides.push(row);
    } else {
      footerRow = row;
    }
  });

  if (!slides.length) return;

  block.textContent = '';
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  /* ── build slide container ── */
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'news-carousel-slides-container';

  const slidesList = document.createElement('ul');
  slidesList.className = 'news-carousel-slides';

  slides.forEach((row, i) => {
    const slide = document.createElement('li');
    slide.className = 'news-carousel-slide';
    slide.dataset.slideIndex = i;

    const cols = [...row.children];

    /* image column */
    const imageCol = cols[0];
    if (imageCol) {
      imageCol.classList.add('news-carousel-slide-image');
      slide.append(imageCol);
    }

    /* content column */
    const contentCol = cols[1];
    if (contentCol) {
      contentCol.classList.add('news-carousel-slide-content');

      /* first <p> becomes meta bar */
      const firstP = contentCol.querySelector('p');
      if (firstP && !firstP.querySelector('a')) {
        firstP.classList.add('news-carousel-meta');
      }

      slide.append(contentCol);
    }

    slidesList.append(slide);
  });

  /* ── collect category text from each slide's meta ── */
  const metaTexts = [];
  slidesList.querySelectorAll('.news-carousel-slide').forEach((slide) => {
    const meta = slide.querySelector('.news-carousel-meta');
    metaTexts.push(meta ? meta.textContent.trim() : '');
  });

  /* ── navigation bar (category + counter + prev/next) ── */
  const navBar = document.createElement('div');
  navBar.className = 'news-carousel-nav';

  const category = document.createElement('span');
  category.className = 'news-carousel-category';
  category.textContent = metaTexts[0] || '';
  navBar.append(category);

  const counter = document.createElement('span');
  counter.className = 'news-carousel-counter';
  counter.textContent = `1 of ${slides.length}`;
  navBar.append(counter);

  const { buttonsContainer } = createSliderControls(slides.length, {
    navButtonsWrapperClass: 'news-carousel-buttons',
    prevClass: 'slide-prev',
    nextClass: 'slide-next',
    prevAriaLabel: 'Previous article',
    nextAriaLabel: 'Next article',
  });
  navBar.append(buttonsContainer);

  /* ── dividers ── */
  const topDivider = document.createElement('hr');
  topDivider.className = 'news-carousel-divider';

  /* ── assemble ── */
  block.append(topDivider);
  block.append(navBar);
  slidesContainer.append(slidesList);
  block.append(slidesContainer);

  /* ── footer link ── */
  if (footerRow) {
    const bottomDivider = document.createElement('hr');
    bottomDivider.className = 'news-carousel-divider';
    block.append(bottomDivider);

    const footer = document.createElement('div');
    footer.className = 'news-carousel-footer';
    const link = footerRow.querySelector('a');
    if (link) {
      footer.append(link);
    }
    block.append(footer);
  }

  /* ── init slider ── */
  const sliderOpts = {
    slidesContainer: '.news-carousel-slides',
    slideSelector: '.news-carousel-slide',
    prevSelector: '.slide-prev',
    nextSelector: '.slide-next',
    activeSlideAttr: 'activeSlide',
    slideIndexAttr: 'slideIndex',
  };
  initSlider(block, sliderOpts);

  /* force initial position to slide 0 */
  showSlide(block, 0, 'auto', sliderOpts);

  /* ── update counter and category on slide change ── */
  const observer = new MutationObserver(() => {
    const active = parseInt(block.dataset.activeSlide, 10) || 0;
    counter.textContent = `${active + 1} of ${slides.length}`;
    category.textContent = metaTexts[active] || '';
  });
  observer.observe(block, { attributes: true, attributeFilter: ['data-active-slide'] });
}

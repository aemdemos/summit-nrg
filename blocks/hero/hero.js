/**
 * Finds the best image element in a container — <picture> first, then <img>.
 * DA content may serve bare <img> tags instead of <picture> elements.
 * @param {Element} el Container to search
 * @returns {Element|null} The picture or img element, or null
 */
function findImage(el) {
  return el.querySelector('picture') || el.querySelector('img');
}

/**
 * Moves the hero background image to be a direct child of the block.
 * Wraps bare <img> in <picture> for consistent CSS targeting.
 * @param {Element} block The hero block
 * @param {Element} pictureCol The column containing the image
 */
function promoteHeroImage(block, pictureCol) {
  const img = findImage(pictureCol);
  if (!img) return;

  if (img.tagName === 'IMG') {
    const picture = document.createElement('picture');
    img.before(picture);
    picture.append(img);
    block.prepend(picture);
  } else {
    block.prepend(img);
  }
  pictureCol.remove();
}

/**
 * Decorates the hero block.
 *
 * Expected authored structure (single row):
 * Row 1: [image] [h1 + description + CTA links]
 *
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  /* ---- Row 1: hero image + content ---- */
  if (rows[0]) {
    const cols = [...rows[0].children];
    let pictureCol = null;
    let contentCol = null;

    cols.forEach((col) => {
      if (findImage(col) && !col.querySelector('h1')) {
        pictureCol = col;
      } else {
        contentCol = col;
      }
    });

    if (pictureCol) promoteHeroImage(block, pictureCol);

    if (contentCol) {
      contentCol.querySelectorAll('div:empty').forEach((div) => div.remove());
    }

    /* Wrap picture + content in a container so the absolute image
       only covers the hero content area. */
    const contentArea = document.createElement('div');
    contentArea.className = 'hero-content-area';
    const picture = block.querySelector('picture');
    if (picture) contentArea.append(picture);
    if (rows[0]) contentArea.append(rows[0]);
    block.prepend(contentArea);
  }

  /* Remove any extra rows (e.g. legacy sub-bar from DA content).
     The sub-bar is now authored as a separate columns section. */
  [...block.children].forEach((child) => {
    if (child !== block.firstElementChild) child.remove();
  });
}

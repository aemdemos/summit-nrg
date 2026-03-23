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
 * Expected authored structure (two rows):
 * Row 1: [image] [h1 + description + CTA link]
 * Row 2: [description text + CTA links for "For homes" / "For businesses"]
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
  }

  /* ---- Row 2: sub-hero bar ---- */
  if (rows[1]) {
    const subBar = rows[1];
    const hasContent = subBar.querySelector('p, a, h1, h2, h3, h4, h5, h6')
      || subBar.textContent.trim().length > 0;
    if (!hasContent) subBar.remove();
  }
}

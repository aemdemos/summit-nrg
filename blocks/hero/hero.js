/**
 * Decorates the hero block.
 *
 * Expected authored structure (single row, single cell):
 * Row 1: [picture + h1 + description + CTA links]
 *
 * The picture is promoted to a background image behind the text content.
 *
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  /* Single-cell: the first (and only) column contains everything */
  const cell = row.firstElementChild;
  if (!cell) return;

  /* Find and extract the picture for background use */
  const picture = cell.querySelector('picture')
    || (() => {
      const img = cell.querySelector('img');
      if (!img) return null;
      const pic = document.createElement('picture');
      img.before(pic);
      pic.append(img);
      return pic;
    })();

  /* Remove the picture from the cell flow — it will be repositioned */
  if (picture) picture.remove();

  /* Clean up empty wrapper divs */
  cell.querySelectorAll('div:empty').forEach((div) => div.remove());

  /* Build the hero-content-area: picture (background) + content (foreground) */
  const contentArea = document.createElement('div');
  contentArea.className = 'hero-content-area';
  if (picture) contentArea.append(picture);
  contentArea.append(row);

  block.textContent = '';
  block.append(contentArea);
}

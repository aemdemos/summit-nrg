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
    const row = rows[0];
    const cols = [...row.children];

    // Find the column with the picture and the one with text
    let pictureCol = null;
    let contentCol = null;

    cols.forEach((col) => {
      if (col.querySelector('picture') && !col.querySelector('h1')) {
        pictureCol = col;
      } else {
        contentCol = col;
      }
    });

    // Move picture to be a direct child of the block (for absolute positioning)
    if (pictureCol) {
      const picture = pictureCol.querySelector('picture');
      if (picture) {
        block.prepend(picture);
        pictureCol.remove();
      }
    }

    // Ensure content column has no empty wrappers
    if (contentCol) {
      const emptyDivs = contentCol.querySelectorAll('div:empty');
      emptyDivs.forEach((div) => div.remove());
    }
  }

  /* ---- Row 2: sub-hero bar ---- */
  // The second row already has the right structure from EDS decoration
  // (paragraph + button-container with .button links)
  // No additional JS transformation needed — CSS handles layout
}

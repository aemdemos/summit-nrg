/**
 * Decorates the feature-panel block.
 * Each row becomes a two-column panel (image + text).
 * DA content may serve bare <img> tags instead of <picture> elements.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('feature-panel-row');
    const cols = [...row.children];
    cols.forEach((col) => {
      if (col.querySelector('picture') || col.querySelector('img')) {
        col.classList.add('feature-panel-image');
      } else {
        col.classList.add('feature-panel-content');
      }
    });
  });
}

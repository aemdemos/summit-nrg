/**
 * Decorates the cta-banner block.
 * Row 1: [image, content (h2 + description + CTA link)].
 * Image becomes a full-bleed background; content is centered overlay.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];
  const imageCol = cols[0];
  const contentCol = cols[1];

  if (imageCol) imageCol.classList.add('cta-banner-image');
  if (contentCol) contentCol.classList.add('cta-banner-content');
}

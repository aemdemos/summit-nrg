import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Groups consecutive h3 + ul pairs into column divs within the nav section.
 * @param {Element} navSection The footer-nav section
 */
function buildNavColumns(navSection) {
  const wrapper = navSection.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  const navColumns = document.createElement('div');
  navColumns.className = 'footer-nav-columns';

  const children = [...wrapper.children];
  const remaining = [];
  let i = 0;

  // Group consecutive h3 + ul pairs into column divs
  while (i < children.length) {
    const child = children[i];
    const next = children[i + 1];
    if (child.tagName === 'H3' && next && next.tagName === 'UL') {
      const col = document.createElement('div');
      col.className = 'footer-nav-col';
      col.append(child);
      col.append(next);
      navColumns.append(col);
      i += 2;
    } else {
      remaining.push(child);
      i += 1;
    }
  }

  if (navColumns.children.length) wrapper.prepend(navColumns);
  remaining.forEach((el) => wrapper.append(el));
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  const sections = fragment ? [...fragment.querySelectorAll(':scope .section')] : [];

  // First section = dark CTA column, second section = nav column
  if (sections.length >= 2) {
    sections[0].classList.add('footer-cta');
    sections[1].classList.add('footer-nav');
    buildNavColumns(sections[1]);
  }

  sections.forEach((section) => footer.append(section));
  block.append(footer);
}

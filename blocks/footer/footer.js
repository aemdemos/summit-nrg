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
 * Builds an email signup form (input + submit) and appends it to the CTA section.
 * @param {Element} ctaSection The footer-cta section
 */
function buildEmailForm(ctaSection) {
  const wrapper = ctaSection.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  const form = document.createElement('form');
  form.className = 'footer-email-form';
  form.setAttribute('role', 'search');

  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'Enter Email';
  input.setAttribute('aria-label', 'Enter Email');
  input.required = true;

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'footer-email-submit';
  btn.setAttribute('aria-label', 'Sign up submit');
  btn.textContent = '→';

  form.append(input, btn);
  form.addEventListener('submit', (e) => e.preventDefault());

  wrapper.append(form);
}

/**
 * Adds a "Your Privacy Choices" button to the legal links paragraph.
 * @param {Element} navSection The footer-nav section
 */
function buildPrivacyButton(navSection) {
  const wrapper = navSection.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Find the legal links paragraph (contains "Legal" link)
  const paragraphs = [...wrapper.querySelectorAll('p')];
  const legalP = paragraphs.find((p) => p.querySelector('a[href$="/legal"], a[href$="/legal.html"]'));
  if (!legalP) return;

  const separator = document.createTextNode(' · ');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'footer-privacy-choices';
  btn.textContent = 'Your Privacy Choices';

  legalP.append(separator, btn);
}

/**
 * Replaces icon <img> tags with inline SVGs so CSS fill works.
 * @param {Element} section The section containing icons
 */
async function inlineIcons(section) {
  const imgs = section.querySelectorAll('.icon img[src$=".svg"]');
  const fetches = [...imgs].map(async (img) => {
    try {
      const resp = await fetch(img.src);
      if (!resp.ok) return;
      const text = await resp.text();
      // eslint-disable-next-line secure-coding/no-xxe-injection -- browser DOMParser is safe
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg) return;
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      img.replaceWith(svg);
    } catch { /* keep img fallback */ }
  });
  await Promise.all(fetches);
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
    buildEmailForm(sections[0]);
    buildNavColumns(sections[1]);
    buildPrivacyButton(sections[1]);
    inlineIcons(sections[1]);
  }

  sections.forEach((section) => footer.append(section));
  block.append(footer);
}

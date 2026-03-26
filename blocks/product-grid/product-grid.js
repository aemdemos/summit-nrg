/**
 * Decorates the product-grid block into an interactive tabbed layout (desktop)
 * and an accordion layout (mobile).
 * Each row = one product tab: [icon, hero-image, content (h3 + p + link)].
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const tabs = [];
  rows.forEach((row) => {
    const cols = [...row.children];
    const icon = cols[0]?.querySelector('picture') || cols[0]?.querySelector('img');
    const image = cols[1]?.querySelector('picture') || cols[1]?.querySelector('img');
    const content = cols[2];
    const title = content?.querySelector('h3')?.textContent || '';
    tabs.push({
      icon, image, content, title,
    });
  });

  block.textContent = '';

  /* ---- desktop: tabs + panels ---- */
  const tabList = document.createElement('div');
  tabList.className = 'product-grid-tabs';

  const tabContent = document.createElement('div');
  tabContent.className = 'product-grid-content';

  /* ---- mobile: accordion ---- */
  const accordion = document.createElement('div');
  accordion.className = 'product-grid-accordion';

  tabs.forEach((tab, i) => {
    /* --- desktop tab button --- */
    const tabBtn = document.createElement('button');
    tabBtn.className = 'product-grid-tab';
    if (i === 0) tabBtn.classList.add('active');
    tabBtn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    if (tab.icon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'product-grid-tab-icon';
      iconWrap.append(tab.icon);
      tabBtn.append(iconWrap);
    }

    const label = document.createElement('span');
    label.className = 'product-grid-tab-label';
    label.textContent = tab.title;
    tabBtn.append(label);

    tabBtn.addEventListener('click', () => {
      tabList.querySelectorAll('.product-grid-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tabBtn.classList.add('active');
      tabBtn.setAttribute('aria-selected', 'true');

      tabContent.querySelectorAll('.product-grid-panel').forEach((p) => {
        p.classList.remove('active');
      });
      tabContent.querySelector(`.product-grid-panel[data-index="${i}"]`)?.classList.add('active');
    });

    tabList.append(tabBtn);

    /* --- desktop panel --- */
    const panel = document.createElement('div');
    panel.className = `product-grid-panel${i === 0 ? ' active' : ''}`;
    panel.dataset.index = i;

    if (tab.image) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'product-grid-panel-image';
      imgWrap.append(tab.image);
      panel.append(imgWrap);
    }

    if (tab.content) {
      const textWrap = document.createElement('div');
      textWrap.className = 'product-grid-panel-text';
      textWrap.append(...[...tab.content.children]);
      panel.append(textWrap);
    }

    tabContent.append(panel);

    /* --- mobile accordion item --- */
    const item = document.createElement('div');
    item.className = 'product-grid-accordion-item';

    const header = document.createElement('button');
    header.className = 'product-grid-accordion-header';
    header.setAttribute('aria-expanded', 'false');

    if (tab.icon) {
      const mobileIcon = document.createElement('span');
      mobileIcon.className = 'product-grid-accordion-icon';
      const iconImg = tab.icon.cloneNode(true);
      mobileIcon.append(iconImg);
      header.append(mobileIcon);
    }

    const mobileLabel = document.createElement('span');
    mobileLabel.className = 'product-grid-accordion-label';
    mobileLabel.textContent = tab.title;
    header.append(mobileLabel);

    const chevron = document.createElement('span');
    chevron.className = 'product-grid-accordion-chevron';
    chevron.innerHTML = '<img src="/icons/chevron-down.svg" alt="" width="24" height="24">';
    header.append(chevron);

    const body = document.createElement('div');
    body.className = 'product-grid-accordion-body';

    /* clone the panel text content for mobile */
    const panelText = panel.querySelector('.product-grid-panel-text');
    if (panelText) {
      body.append(panelText.cloneNode(true));
    }

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* close all items */
      accordion.querySelectorAll('.product-grid-accordion-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        openItem.querySelector('.product-grid-accordion-header')?.setAttribute('aria-expanded', 'false');
      });

      /* toggle clicked item */
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    item.append(header);
    item.append(body);
    accordion.append(item);
  });

  block.append(tabList);
  block.append(tabContent);
  block.append(accordion);
}

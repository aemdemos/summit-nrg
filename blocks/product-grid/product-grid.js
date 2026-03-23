/**
 * Decorates the product-grid block into an interactive tabbed layout.
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

  const tabList = document.createElement('div');
  tabList.className = 'product-grid-tabs';

  const tabContent = document.createElement('div');
  tabContent.className = 'product-grid-content';

  tabs.forEach((tab, i) => {
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
  });

  block.append(tabList);
  block.append(tabContent);
}

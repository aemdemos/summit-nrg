#!/usr/bin/env node

/**
 * Homepage Content Generator for NRG EDS Migration
 *
 * Generates content/index.plain.html with current NRG.com homepage content.
 * Addresses QA issues: #17 (hero), #18 (business grid), #19 (residential tabs),
 * #20 (carousel articles), #26 (page title).
 *
 * Usage: node tools/importer/generate-homepage.js
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = join(__dirname, '..', '..');
const OUTPUT = join(WORKSPACE, 'content', 'index.plain.html');

/* ── Local image paths (raster only — SVG icons stay on external CDNs) ── */
const LOCAL_IMAGES = {
  'desktopImage-1393': '/media/nrg/hero-ceraweek.jpg',
  'GettyImages-1284976355-1800x1200': '/media/nrg/feature-family-lawn.jpg',
  'home-story-beyond-our-solutions-712x475': '/media/nrg/feature-mother-daughter.jpg',
  'electricity-plans-toogle': '/media/nrg/grid-energy-plans.jpg',
  'smart_home_product_grid': '/media/nrg/grid-smart-home.jpg',
  'solar-home-toggle-1530x1020-new21': '/media/nrg/grid-sustainable-living.jpg',
  'ev-1530x1020': '/media/nrg/grid-ev-driving.jpg',
  'backup_power_1530x1020_2-1': '/media/nrg/grid-backup-power.jpg',
  'edgar-castrejon-CX8ooha2yLA-unsplash': '/media/nrg/grid-home-services.jpg',
  'Homepage-Business-Power-1530x1020': '/media/nrg/grid-power.jpg',
  'Homepage-Business-NatGas-1530x1020': '/media/nrg/grid-natural-gas.jpg',
  'Homepage-Business-LoadMngmnt-1530x1020': '/media/nrg/grid-load-management.jpg',
  'Homepage-Business-Susty-Renewables-1530x1020': '/media/nrg/grid-sustainability-renewables.jpg',
  'Homepage-Business-Brokers-1530x1020': '/media/nrg/grid-energy-brokers.jpg',
  'desktopImage-1451': '/media/nrg/news-collaborative-team.jpg',
  'desktopImage-1443': '/media/nrg/news-energy-market.jpg',
  'mobileImage-1012': '/media/nrg/news-ellie-schweiker.jpg',
  'image-1450': '/media/nrg/news-energy-legislation.jpg',
  'image-1466': '/media/nrg/news-community-engagement.jpg',
  'homepage-image-swap-join-our-2400x1352-A': '/media/nrg/cta-nrg-employees.jpg',
};

/* ── SVG icon helpers (kept on external CDNs) ── */
function s7content(id) {
  return `https://s7d9.scene7.com/is/content/nrgenergy/${id}`;
}

function nrgAsset(path) {
  return `https://www.nrg.com/assets/${path}`;
}

function picture(id, alt, {
  desktopWid = 1500, desktopHei, loading = 'lazy',
  isContent = false, isAsset = false, assetPath = '',
} = {}) {
  if (isContent) {
    return `<picture>
          <img loading="${loading}" alt="${alt}" src="${s7content(id)}" width="48" height="48">
        </picture>`;
  }
  if (isAsset) {
    return `<picture>
          <img loading="${loading}" alt="${alt}" src="${nrgAsset(assetPath)}" width="48" height="48">
        </picture>`;
  }
  const localPath = LOCAL_IMAGES[id];
  return `<picture>
          <img loading="${loading}" alt="${alt}" src="${localPath}" width="${desktopWid}" height="${desktopHei || Math.round(desktopWid * 0.67)}">
        </picture>`;
}

/* ── Section builders ── */

function buildHero() {
  const bgImage = picture('desktopImage-1393', 'NRG CERAWeek hero image', {
    desktopWid: 1500, desktopHei: 845, loading: 'eager',
  });

  return `<div>
  <div class="hero">
    <div>
      <div>
        ${bgImage}
      </div>
      <div>
        <h1>NRG at CERAWeek</h1>
        <p>It's CERAWeek, one of the world's leading energy industry gatherings. NRG leaders are helping shape the conversation around AI, grid reliability, and large load growth while sharing solutions that help meet rising electricity demand and keep power affordable.</p>
        <p><strong><a href="https://worldofnrg.com/" title="Explore the World of NRG">Explore the World of NRG</a></strong></p>
        <p><em><a href="/insights/energy-education/ceraweek-speaker-schedule.html" title="Speaker Schedule">Speaker Schedule</a></em></p>
      </div>
    </div>
  </div>
</div>`;
}

function buildSubBar() {
  return `<div>
  <div class="columns">
    <div>
      <div>
        <p>Our customer-first approach and robust portfolio allow us to tailor smarter solutions for homes and businesses.</p>
      </div>
      <div>
        <p><em><a href="/residential/all-products-and-services.html" title="For homes">For homes</a></em></p>
        <p><em><a href="/business/all-products-and-services.html" title="For businesses">For businesses</a></em></p>
      </div>
    </div>
  </div>
  <div class="section-metadata">
    <div>
      <div>style</div>
      <div>sub-bar</div>
    </div>
  </div>
</div>`;
}

function buildFeaturePanel() {
  const img1 = picture('GettyImages-1284976355-1800x1200', 'family on lawn', {
    desktopWid: 720, desktopHei: 480,
  });
  const img2 = picture('home-story-beyond-our-solutions-712x475', 'Mother and daughter with tablet', {
    desktopWid: 720, desktopHei: 480,
  });

  return `<div>
  <div class="feature-panel">
    <div>
      <div>
        ${img1}
      </div>
      <div>
        <h2>We're leading the way by expanding what's possible</h2>
        <p>A smarter, cleaner, empowered future for people, homes, businesses, and communities.</p>
        <ul>
          <li><a href="/about/our-story.html">Discover how</a></li>
        </ul>
      </div>
    </div>
    <div>
      <div>
        <h2>Our story goes beyond our solutions</h2>
        <p>We're committed to a clean, diverse, and just world. And that commitment is part of our culture.</p>
        <ul>
          <li><a href="/sustainability/context.html">Explore our sustainability commitment</a></li>
          <li><a href="/about/diversity-equity-and-inclusion.html">Discover our diverse culture</a></li>
          <li><a href="/about/social-responsibility.html">View our social impact</a></li>
        </ul>
      </div>
      <div>
        ${img2}
      </div>
    </div>
  </div>
</div>`;
}

function buildProductGridRow(tab) {
  const icon = tab.iconIsAsset
    ? picture('', tab.title, { isAsset: true, assetPath: tab.iconPath })
    : picture(tab.iconId, tab.iconAlt || `${tab.title} icon`, { isContent: !tab.iconIsScene7 });
  const img = picture(tab.imageId, tab.title, { desktopWid: 840, desktopHei: 560 });

  return `    <div>
      <div>
        ${icon.trim()}
      </div>
      <div>
        ${img.trim()}
      </div>
      <div>
        <h3>${tab.title}</h3>
        <p>${tab.description}</p>
        <ul>
          <li><a href="${tab.linkHref}">${tab.linkText}</a></li>
        </ul>
      </div>
    </div>`;
}

function buildResidentialGrid() {
  const tabs = [
    {
      title: 'Energy plans',
      iconIsAsset: true, iconPath: 'icons/home/Lightbulb_32x32p_1pStroke.svg',
      iconAlt: 'Lightbulb icon',
      imageId: 'electricity-plans-toogle', description: 'Tailored plans delivered with the power to make each customer an effective energy manager.',
      linkHref: '/residential/electricity-plans.html', linkText: 'View more',
    },
    {
      title: 'Smart home',
      iconIsContent: true, iconId: 'smart-home_48x48_1.5pStroke',
      iconAlt: 'Smart home icon',
      imageId: 'smart_home_product_grid', description: 'Customizable smart products designed to simplify your day-to-day.',
      linkHref: '/residential/smart-home.html', linkText: 'Learn more',
    },
    {
      title: 'Sustainable living',
      iconIsContent: true, iconId: 'sustainable-living_48x48_1.5pxStroke',
      iconAlt: 'Sustainable living icon',
      imageId: 'solar-home-toggle-1530x1020-new21', description: 'Solutions that make a low-carbon footprint as easy as it is efficient.',
      linkHref: '/residential/sustainable-living.html', linkText: 'View more',
    },
    {
      title: 'EV driving',
      iconIsAsset: true, iconPath: 'icons/home/Electric%20vehicles_32x32p_1pStroke.svg',
      iconAlt: 'Electric vehicles icon',
      imageId: 'ev-1530x1020', description: 'Electricity plans developed specifically for homes with electric vehicles.',
      linkHref: '/residential/electric-vehicles.html', linkText: 'View more',
    },
    {
      title: 'Backup power',
      iconIsContent: true, iconId: 'backup-power_48x48_1.5pxStroke',
      iconAlt: 'Backup power icon',
      imageId: 'backup_power_1530x1020_2-1', description: 'Sustainable, affordable, and reliable power solutions that bring resilience to homeowners.',
      linkHref: '/residential/backup-power.html', linkText: 'View more',
    },
    {
      title: 'Home services',
      iconIsContent: true, iconId: 'home-services_48x48_1.5pxStroke',
      iconAlt: 'Home services icon',
      imageId: 'edgar-castrejon-CX8ooha2yLA-unsplash', description: 'Rest easy knowing your home is secure, and your systems are protected, connected, and performing at their peak.',
      linkHref: '/residential/home-services.html', linkText: 'View more',
    },
  ];

  const rows = tabs.map((tab) => buildProductGridRow(tab)).join('\n');

  return `<div>
  <h2>Products and services for your home</h2>
  <div class="product-grid">
${rows}
  </div>
</div>`;
}

function buildBusinessGrid() {
  const tabs = [
    {
      title: 'Power',
      iconIsAsset: true, iconPath: 'icons/home/Power_32x32p_1pStroke.svg',
      iconAlt: 'Power icon',
      imageId: 'Homepage-Business-Power-1530x1020', description: "Energy plans matched to each company's business goals, risk tolerance, and future growth.",
      linkHref: '/business/electricity.html', linkText: 'View more',
    },
    {
      title: 'Natural gas',
      iconIsAsset: true, iconPath: 'icons/home/Natural%20gas_32x32p_1pStroke.svg',
      iconAlt: 'Natural gas icon',
      imageId: 'Homepage-Business-NatGas-1530x1020', description: 'Expertise and market knowledge delivered with effectiveness and efficiency.',
      linkHref: '/business/natural-gas.html', linkText: 'View more',
    },
    {
      title: 'Load management',
      iconIsContent: true, iconId: 'load-mgmt_48x48_1.5pxStroke',
      iconAlt: 'Load management icon',
      imageId: 'Homepage-Business-LoadMngmnt-1530x1020', description: 'Programs built to save your business energy and money.',
      linkHref: '/business/load-management.html', linkText: 'View more',
    },
    {
      title: 'Sustainability & renewables',
      iconIsAsset: true, iconPath: 'icons/home/Renewable%20services_32x32p_1pStroke.svg',
      iconAlt: 'Renewable services icon',
      imageId: 'Homepage-Business-Susty-Renewables-1530x1020', description: 'Bringing sustainable energy to business in ways that are easy, seamless, and affordable.',
      linkHref: '/business/sustainability-services.html', linkText: 'View more',
    },
    {
      title: 'Energy brokers',
      iconIsContent: true, iconId: 'energy-brokers_48x48_1.5pxStroke',
      iconAlt: 'Energy brokers icon',
      imageId: 'Homepage-Business-Brokers-1530x1020', description: 'Partnerships fueled by expertise, technology, and a mutual commitment to serving customers.',
      linkHref: '/business/brokers.html', linkText: 'View more',
    },
  ];

  const rows = tabs.map((tab) => buildProductGridRow(tab)).join('\n');

  return `<div>
  <h2>A wide range of solutions to match the needs of your business</h2>
  <div class="product-grid">
${rows}
  </div>
</div>`;
}

function buildNewsCarousel() {
  const articles = [
    {
      title: 'Building a Sustainable Energy Future — One Collaborative Action at a Time...',
      meta: 'PEOPLE AND COMMUNITY • INSIGHTS  FEB 27, 2026',
      subtitle: 'Celebrating our 2025 Demand Response superstars',
      linkHref: '/insights/people-and-community/building-a-sustainable-energy-future-one-collaborative-action-at.html',
      imageId: 'desktopImage-1451',
      imageAlt: 'Collaborative team meeting',
    },
    {
      title: '2026 PJM Market Update',
      meta: 'WHITE PAPERS AND WEBINARS • INSIGHTS  FEB 3, 2026',
      subtitle: 'Join our experts as they explore the factors shaping power and gas markets across the PJM service region to help you navigate the evolving energy landscape in 2026.',
      linkHref: '/insights/white-papers-and-webinars/2026-pjm-market-update.html',
      imageId: 'desktopImage-1443',
      imageAlt: 'Energy market analysis',
    },
    {
      title: 'NRG People Power: Get to Know Ellie Schweiker',
      meta: 'PEOPLE AND COMMUNITY • INSIGHTS  JAN 13, 2026',
      subtitle: "To wrap up an exciting and productive 2025, we're proud to feature Ellie Schweiker, a rising star in one of the fastest-evolving areas in the energy industry.",
      linkHref: '/insights/people-and-community/nrg-people-power-get-to-know-ellie-schweiker.html',
      imageId: 'mobileImage-1012',
      imageAlt: 'Ellie Schweiker portrait',
    },
    {
      title: 'Navigating the One Big Beautiful Bill Act — Part 3',
      meta: 'INNOVATION • INSIGHTS  DEC 18, 2025',
      subtitle: 'Explore how the tax & spending pivots contained in the One Big Beautiful Bill Act impact the future of energy supply, market pricing, & investment across an increasingly busy sector.',
      linkHref: '/insights/innovation/navigating-the-one-big-beautiful-bill-act-part-3.html',
      imageId: 'image-1450',
      imageAlt: 'Energy legislation analysis',
    },
    {
      title: '5 Ways We Uplifted Our Communities in 2025',
      meta: 'PEOPLE AND COMMUNITY • INSIGHTS  DEC 17, 2025',
      subtitle: "Here's a look at some of the moments that defined our year of impact.",
      linkHref: '/insights/people-and-community/5-ways-we-uplifted-our-communities-in-2025.html',
      imageId: 'image-1466',
      imageAlt: 'Community engagement',
    },
  ];

  const rows = articles.map((article) => {
    const img = picture(article.imageId, article.imageAlt, {
      desktopWid: 566, desktopHei: 566,
    });
    return `    <div>
      <div>
        ${img.trim()}
      </div>
      <div>
        <p>${article.meta}</p>
        <h2>${article.title}</h2>
        <p>${article.subtitle}</p>
        <p><em><a href="${article.linkHref}">See article</a></em></p>
      </div>
    </div>`;
  }).join('\n');

  const footer = `    <div>
      <div></div>
      <div><p><a href="/insights/all-insights.html">Discover more insights</a></p></div>
    </div>`;

  return `<div>
  <h2>The latest</h2>
  <div class="news-carousel">
${rows}
${footer}
  </div>
</div>`;
}

function buildCtaBanner() {
  const img = picture('homepage-image-swap-join-our-2400x1352-A', 'NRG Employees', {
    desktopWid: 1500, desktopHei: 845,
  });

  return `<div>
  <div class="cta-banner">
    <div>
      <div>
        ${img.trim()}
      </div>
      <div>
        <h2>Join our talented and diverse workforce</h2>
        <p>The power of NRG lies in our people and the opportunities for their unique voices to be heard.</p>
        <p><em><a href="/about/careers.html" title="Life and jobs at NRG">Life and jobs at NRG</a></em></p>
      </div>
    </div>
  </div>
</div>`;
}

function buildMetadata() {
  return `<div>
  <div class="metadata">
    <div>
      <div>Title</div>
      <div>Welcome to NRG | NRG Energy</div>
    </div>
    <div>
      <div>Description</div>
      <div>NRG Energy is a leading energy and home services company powered by people and our passion for a smarter, cleaner energy future.</div>
    </div>
  </div>
</div>`;
}

/* ── Main ── */

function generate() {
  const sections = [
    buildHero(),
    buildSubBar(),
    buildFeaturePanel(),
    buildResidentialGrid(),
    buildBusinessGrid(),
    buildNewsCarousel(),
    buildCtaBanner(),
    buildMetadata(),
  ];

  const html = sections.join('\n');

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, html, 'utf-8');

  console.log(`Generated ${OUTPUT}`);
  console.log('Sections: hero, feature-panel, residential product-grid, business product-grid, news-carousel, cta-banner, metadata');
}

generate();

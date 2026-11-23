(() => {
  'use strict';

  const CONFIG_KEY = 'ownStudioSiteContent';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  async function loadContent() {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn('Saved site content could not be read:', error);
    }
    const response = await fetch('site-content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load site-content.json (${response.status})`);
    return response.json();
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node && typeof value === 'string') node.textContent = value;
  }

  function setMultiline(id, value) {
    const node = document.getElementById(id);
    if (!node || typeof value !== 'string') return;
    const lines = value.split('\n');
    node.replaceChildren();
    lines.forEach((line, index) => {
      if (index) node.append(document.createElement('br'));
      if ((node.tagName === 'H1' || node.tagName === 'H2') && index === lines.length - 1 && lines.length > 1) {
        const em = document.createElement('em');
        em.textContent = line;
        node.append(em);
      } else {
        node.append(document.createTextNode(line));
      }
    });
  }

  function safeUrl(url) {
    if (typeof url !== 'string' || !url.trim()) return '';
    try {
      const parsed = new URL(url, window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? parsed.href : '';
    } catch {
      return '';
    }
  }

  function renderContent(data) {
    const brand = data.brand || {};
    const home = data.home || {};
    const about = data.about || {};
    const work = data.work || {};
    const contact = data.contact || {};
    const theme = data.theme || {};

    setText('brand-name', brand.name || 'YOUR NAME');
    setText('footer-brand', brand.name || 'YOUR NAME');
    setText('availability-text', brand.availability || 'OPEN TO OPPORTUNITIES');
    setText('home-eyebrow', home.eyebrow || 'INDEPENDENT DIGITAL CREATOR');
    setMultiline('home-headline', home.headline || 'Ideas made\ntangible.');
    setText('home-intro', home.intro || '');
    setText('home-art-caption', home.artCaption || '');
    setText('home-footer-note', home.footerNote || '');
    setText('about-eyebrow', about.eyebrow || 'ABOUT');
    setMultiline('about-headline', about.headline || 'Curious by nature.\nPractical by design.');
    setText('about-note', about.note || '');
    setText('work-eyebrow', work.eyebrow || 'SELECTED WORK');
    setMultiline('work-headline', work.headline || 'Made with\nintent.');
    setText('work-intro', work.intro || '');
    setText('contact-eyebrow', contact.eyebrow || 'CONTACT');
    setMultiline('contact-headline', contact.headline || "Let's make\nsomething good.");
    setText('contact-intro', contact.intro || '');
    setText('contact-footer', contact.footer || 'THANKS FOR STOPPING BY.');

    const headerEmail = $('#header-email');
    const contactEmail = $('#contact-email');
    const email = brand.email || 'hello@example.com';
    [headerEmail, contactEmail].forEach(link => {
      if (!link) return;
      link.href = `mailto:${email}`;
    });
    if (contactEmail) {
      contactEmail.replaceChildren(document.createTextNode(email));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      contactEmail.append(' ', arrow);
    }

    const aboutParagraphs = $('#about-paragraphs');
    if (aboutParagraphs) {
      aboutParagraphs.replaceChildren();
      (Array.isArray(about.paragraphs) ? about.paragraphs : []).forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        aboutParagraphs.append(p);
      });
    }

    const tagList = $('#about-tags');
    if (tagList) {
      tagList.replaceChildren();
      (Array.isArray(about.tags) ? about.tags : []).forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;
        tagList.append(li);
      });
    }

    const projectGrid = $('#project-grid');
    if (projectGrid) {
      projectGrid.replaceChildren();
      (Array.isArray(work.projects) ? work.projects : []).forEach((project, index) => {
        const article = document.createElement('article');
        article.className = `project-card project-${['coral', 'blue', 'green', 'gold'][index % 4]}`;
        const graphic = document.createElement('div');
        graphic.className = 'project-graphic';
        graphic.setAttribute('aria-hidden', 'true');
        const graphicNumber = document.createElement('span');
        graphicNumber.className = 'graphic-number';
        graphicNumber.textContent = project.number || String(index + 1).padStart(2, '0');
        const graphicShape = document.createElement('span');
        graphicShape.className = 'graphic-shape';
        graphicShape.textContent = ['✳', '◒', '＋', '◇'][index % 4];
        graphic.append(graphicNumber, graphicShape);

        const copy = document.createElement('div');
        copy.className = 'project-copy';
        const category = document.createElement('p');
        category.className = 'project-category';
        category.textContent = project.category || 'PROJECT';
        const heading = document.createElement('h3');
        heading.textContent = project.title || 'Untitled project';
        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = project.description || '';
        copy.append(category, heading, description);

        const destination = safeUrl(project.url);
        const cta = destination ? document.createElement('a') : document.createElement('span');
        cta.className = 'project-link';
        cta.textContent = project.label || (destination ? 'VIEW PROJECT' : 'ADD A LINK IN THE EDITOR');
        if (destination) {
          cta.href = destination;
          cta.target = '_blank';
          cta.rel = 'noopener noreferrer';
        }
        copy.append(cta);
        article.append(graphic, copy);
        projectGrid.append(article);
      });
    }

    const socialLinks = $('#social-links');
    if (socialLinks) {
      socialLinks.replaceChildren();
      (Array.isArray(contact.socials) ? contact.socials : []).forEach(item => {
        const url = safeUrl(item.url);
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.label || 'LINK';
        a.append(document.createTextNode(' ↗'));
        socialLinks.append(a);
      });
    }

    const root = document.documentElement;
    const colourMap = {
      '--ink': theme.ink,
      '--paper': theme.paper,
      '--accent': theme.accent,
      '--home-bg': theme.home,
      '--about-bg': theme.about,
      '--work-bg': theme.work,
      '--contact-bg': theme.contact,
      '--home-text': theme.homeText,
      '--about-text': theme.aboutText,
      '--work-text': theme.workText,
      '--contact-text': theme.contactText
    };
    Object.entries(colourMap).forEach(([key, value]) => {
      if (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) root.style.setProperty(key, value);
    });

    document.title = `${brand.name || 'Your Name'} — ${brand.descriptor || 'Portfolio'}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${brand.name || 'Your Name'} — ${brand.descriptor || 'Personal portfolio'}.`;
    setText('year', new Date().getFullYear().toString());
  }

  function setupPanels() {
    const panels = $$('.panel');
    const openPanel = (id, options = {}) => {
      const target = panels.find(panel => panel.dataset.panel === id);
      if (!target) return;
      panels.forEach(panel => {
        const active = panel === target;
        panel.classList.toggle('is-active', active);
        const tab = $('.panel-tab', panel);
        if (tab) tab.setAttribute('aria-expanded', String(active));
        const content = $('.panel-content', panel);
        if (content) content.setAttribute('aria-hidden', String(!active));
      });
      if (options.focus) $('.panel-content', target)?.focus({ preventScroll: true });
      history.replaceState(null, '', `#${id}`);
    };

    panels.forEach(panel => {
      $('.panel-tab', panel)?.addEventListener('click', () => openPanel(panel.dataset.panel));
    });
    $$('[data-open-panel]').forEach(button => {
      button.addEventListener('click', () => openPanel(button.dataset.openPanel));
    });
    window.addEventListener('keydown', event => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        const activeIndex = panels.findIndex(panel => panel.classList.contains('is-active'));
        openPanel(panels[(activeIndex + 1) % panels.length].dataset.panel);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        const activeIndex = panels.findIndex(panel => panel.classList.contains('is-active'));
        openPanel(panels[(activeIndex - 1 + panels.length) % panels.length].dataset.panel);
      }
    });
    const hash = window.location.hash.slice(1);
    if (hash && panels.some(panel => panel.dataset.panel === hash)) openPanel(hash);
  }

  async function init() {
    try {
      const data = await loadContent();
      renderContent(data);
      setupPanels();
    } catch (error) {
      console.error(error);
      document.body.insertAdjacentHTML('afterbegin', '<div class="load-error">Could not load <code>site-content.json</code>. Start the site using <code>start.bat</code> or a local web server. See README.txt.</div>');
    }
  }
  init();
})();

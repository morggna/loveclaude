'use strict';

/* ── Theme (dark / light) ───────────────────────────────────────── */
const THEME_KEY = 'loveclaude-theme';

function resolveTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  const h = new Date().getHours();
  if (h >= 18 || h < 6) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  if (theme === 'dark') {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    btn.setAttribute('aria-label', '切换至亮色模式');
  } else {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', '切换至暗色模式');
  }
}

/* ── Particle canvas animation ───────────────────────────────────── */
class Particles {
  constructor(canvas) {
    this.c = canvas;
    this.x = canvas.getContext('2d');
    this.pts = [];
    this.mouse = { x: -9999, y: -9999 };
    this._raf = null;
    this._resize();
    this._spawn();
    this._events();
    this._tick();
  }

  _resize() {
    const r = this.c.getBoundingClientRect();
    this.c.width  = r.width;
    this.c.height = r.height;
    this.W = r.width;
    this.H = r.height;
  }

  _spawn() {
    const n = Math.min(100, Math.floor((this.W * this.H) / 9000));
    this.pts = Array.from({ length: n }, () => ({
      x:  Math.random() * this.W,
      y:  Math.random() * this.H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.4 + 0.4,
      a:  Math.random() * 0.55 + 0.15,
    }));
  }

  _events() {
    const onResize = () => { this._resize(); this._spawn(); };
    window.addEventListener('resize', onResize, { passive: true });

    this.c.addEventListener('mousemove', e => {
      const r = this.c.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
    }, { passive: true });

    this.c.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    }, { passive: true });
  }

  _color() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? '90, 60, 180'
      : '160, 139, 250';
  }

  _tick() {
    const { x: ctx, W, H, pts, mouse } = this;
    const CON = 130;
    const MR  = 140;
    const col = this._color();

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d  = Math.hypot(dx, dy);
      if (d < MR && d > 0) {
        const f = ((MR - d) / MR) * 0.28;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }

      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x  += p.vx;
      p.y  += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.a})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < pts.length; j++) {
        const q  = pts[j];
        const dd = Math.hypot(p.x - q.x, p.y - q.y);
        if (dd < CON) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${col},${(1 - dd / CON) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    this._raf = requestAnimationFrame(() => this._tick());
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}

/* ── Mobile menu ─────────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }, { passive: true });
}

/* ── Scroll-to-top ───────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 450);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Header shrink on scroll ─────────────────────────────────────── */
function initHeaderScroll() {
  const hdr = document.getElementById('site-header');
  if (!hdr) return;
  window.addEventListener('scroll', () => {
    hdr.style.borderBottomColor = window.scrollY > 10
      ? 'var(--border-s)'
      : 'var(--border)';
  }, { passive: true });
}

/* ── Reading progress ────────────────────────────────────────────── */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Scroll-reveal (cards fade up with stagger) ──────────────────── */
function initScrollReveal() {
  const cards = document.querySelectorAll('.post-card');
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('animate-cards');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${Math.min(i, 5) * 70}ms`);
    observer.observe(card);
  });
}

/* ── Code copy button ────────────────────────────────────────────── */
function initCodeCopy() {
  document.querySelectorAll('.post-content pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.setAttribute('aria-label', '复制代码');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    pre.appendChild(btn);

    btn.addEventListener('click', async () => {
      const text = (pre.querySelector('code') || pre).textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          btn.classList.remove('copied');
        }, 2000);
      } catch { /* clipboard not available */ }
    });
  });
}

/* ── TOC active heading highlight ────────────────────────────────── */
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.toc #TableOfContents a');
  if (!tocLinks.length) return;
  const headings = [...document.querySelectorAll('.post-content h2, .post-content h3')];
  if (!headings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach(a => a.classList.remove('toc-active'));
      const active = document.querySelector(`.toc a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('toc-active');
    });
  }, { rootMargin: '-70px 0px -75% 0px' });

  headings.forEach(h => h.id && observer.observe(h));
}

/* ── Blog: search, view-toggle, filter ───────────────────────────── */
const VIEW_KEY = 'loveclaude-view';
const MOBILE_VIEW_QUERY = '(max-width: 760px)';

function resolvePostView() {
  const saved = localStorage.getItem(VIEW_KEY);
  if (saved === 'grid' || saved === 'list') return saved;
  return window.matchMedia(MOBILE_VIEW_QUERY).matches ? 'list' : 'grid';
}

function setView(view) {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;
  grid.classList.toggle('view-list', view === 'list');
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
}

function filterPosts() {
  const query = (document.getElementById('blog-search')?.value || '').trim().toLowerCase();
  const activeCats = [...document.querySelectorAll('.filter-option.active[data-category]')]
    .map(el => el.dataset.category.toLowerCase());
  const activeTags = [...document.querySelectorAll('.filter-option.active[data-tag]')]
    .map(el => el.dataset.tag.toLowerCase());

  document.querySelectorAll('#posts-grid .post-card').forEach(card => {
    const title = (card.dataset.title || '').toLowerCase();
    const desc  = (card.dataset.description || '').toLowerCase();
    const cats  = (card.dataset.categories || '').toLowerCase().split(',').filter(Boolean);
    const tags  = (card.dataset.tags || '').toLowerCase().split(',').filter(Boolean);

    // Search matches if query appears in title, description, tags, OR categories
    const okSearch = !query
      || title.includes(query)
      || desc.includes(query)
      || tags.some(t => t.includes(query))
      || cats.some(c => c.includes(query));

    // Category/tag filters are independent of search and work simultaneously
    const okCat = activeCats.length === 0 || activeCats.some(c => cats.includes(c));
    const okTag = activeTags.length === 0 || activeTags.some(t => tags.includes(t));

    card.hidden = !(okSearch && okCat && okTag);
  });
}

function initBlogControls() {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  setView(resolvePostView());

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.view;
      setView(v);
      localStorage.setItem(VIEW_KEY, v);
    });
  });

  const searchInput = document.getElementById('blog-search');
  if (searchInput) {
    // 'input' fires on every keystroke; 'search' fires on native × clear button
    searchInput.addEventListener('input', filterPosts);
    searchInput.addEventListener('search', filterPosts);
  }

  document.querySelectorAll('.filter-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const list = toggle.nextElementSibling;
      if (!list) return;
      const open = list.classList.toggle('open');
      toggle.classList.toggle('open', open);
      const chevron = toggle.querySelector('.chevron');
      if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
    });
  });

  document.querySelectorAll('.filter-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('active');
      filterPosts();
    });
  });
}

/* ── Image blur-up on load ───────────────────────────────────────── */
function initImageBlurUp() {
  document.querySelectorAll('.card-media img').forEach(img => {
    if (img.complete && img.naturalWidth) return;
    img.style.filter = 'blur(8px)';
    img.style.transition = 'filter 0.5s ease';
    img.addEventListener('load', () => { img.style.filter = 'none'; }, { once: true });
  });
}

/* ── Life-tree scroll-driven animation ───────────────────────────── */
function initArticleTree() {
  const section = document.querySelector('.ltree-section');
  const tree    = document.getElementById('ltree');
  if (!tree) return;

  const items     = Array.from(tree.querySelectorAll('.ltree-item'));
  const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let treeUnlocked = false;
  let scrollDir    = 'none';
  let lastScrollY  = window.scrollY;
  let rafPending   = false;

  /* ── Reveal one item: branch grows → card blooms ───────────────── */
  function revealItem(item) {
    if (item.classList.contains('branched')) return;
    item.classList.add('branched');
    /* Card starts after branch has visibly extended (~half its duration) */
    setTimeout(() => {
      item.classList.add('fruited');
      /* After full animation, restore fast hover transitions */
      setTimeout(() => item.classList.add('ltree-item--done'), 1000);
    }, 480);
  }

  /* ── Check viewport: animate items visible while scrolling up ───── */
  function checkItems() {
    if (!treeUnlocked || scrollDir !== 'up') return;
    const navH = 68; /* fixed nav height — don't trigger items fully behind it */
    const vh = window.innerHeight;
    items.forEach(item => {
      if (item.classList.contains('branched')) return;
      const { top, bottom } = item.getBoundingClientRect();
      /* Trigger when at least 60px of item is below the nav */
      if (bottom > navH + 60 && top < vh * 0.88) revealItem(item);
    });
  }

  /* ── Scroll listener: track direction + rAF-throttled item check ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if      (y > lastScrollY + 2) scrollDir = 'down';
    else if (y < lastScrollY - 2) scrollDir = 'up';
    lastScrollY = y;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { checkItems(); rafPending = false; });
  }, { passive: true });

  /* ── Unlock: expand section + start trunk ───────────────────────── */
  function unlock() {
    treeUnlocked = true;
    section?.classList.add('tree-unlocked');
    void section?.offsetHeight; /* synchronous reflow so #tree-root has real position */
    tree.classList.add('grown'); /* trunk grows from bottom */
    if (reduced) items.forEach(item => revealItem(item));
  }

  /* ── Hero "浏览文章" button ──────────────────────────────────────── */
  const heroBtn = document.getElementById('hero-browse');
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!treeUnlocked) unlock();
      /* Force scrollDir to 'down' so the smooth scroll to root
         doesn't accidentally trigger item animations mid-flight */
      scrollDir = 'down';
      document.getElementById('tree-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ── Direct URL navigation to #tree-root ────────────────────────── */
  if (window.location.hash === '#tree-root') {
    unlock();
    requestAnimationFrame(() =>
      document.getElementById('tree-root')?.scrollIntoView({ behavior: 'instant', block: 'start' })
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Floating TOC  (fixed right button → left slide-in panel)
   ═══════════════════════════════════════════════════════════════════ */

function initFloatingTOC() {
  const inlineTOC  = document.querySelector('.post-body-wrap .toc');
  const floatWrap  = document.getElementById('toc-float');
  if (!inlineTOC || !floatWrap) return;

  const btn    = document.getElementById('toc-float-btn');
  const panel  = document.getElementById('toc-float-panel');
  const closeBtn = document.getElementById('toc-float-close');
  if (!btn || !panel) return;

  /* ── Scrim for mobile backdrop-close ──────────────────────────── */
  const scrim = document.createElement('div');
  scrim.className = 'toc-float-scrim';
  scrim.hidden = true;
  document.body.appendChild(scrim);

  function openPanel() {
    panel.removeAttribute('hidden');
    btn.setAttribute('aria-expanded', 'true');
    scrim.hidden = false;
    /* Sync active highlight from inline TOC to panel */
    syncActive();
  }
  function closePanel() {
    panel.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
  }
  function togglePanel() {
    panel.hasAttribute('hidden') ? openPanel() : closePanel();
  }

  /* ── Active heading sync ──────────────────────────────────────── */
  function syncActive() {
    const activeHref = inlineTOC.querySelector('.toc-active')?.getAttribute('href');
    if (!activeHref) return;
    panel.querySelectorAll('a').forEach(a => {
      a.classList.toggle('toc-active', a.getAttribute('href') === activeHref);
    });
  }

  /* Watch inline TOC for toc-active changes → mirror in panel */
  new MutationObserver(syncActive).observe(inlineTOC, {
    subtree: true, attributes: true, attributeFilter: ['class']
  });

  /* Panel links: close panel on mobile after click */
  panel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900) closePanel();
    });
  });

  btn.addEventListener('click', e => { e.stopPropagation(); togglePanel(); });
  closeBtn?.addEventListener('click', closePanel);
  scrim.addEventListener('click', closePanel);

  /* ESC to close */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hasAttribute('hidden')) closePanel();
  });

  /* ── IntersectionObserver: show/hide float button ────────────── */
  const observer = new IntersectionObserver(entries => {
    const tocVisible = entries[0].isIntersecting;
    if (tocVisible) {
      /* Inline TOC is visible — hide floating button, close panel */
      floatWrap.setAttribute('hidden', '');
      closePanel();
    } else {
      /* Inline TOC scrolled away — show floating button */
      floatWrap.removeAttribute('hidden');
    }
  }, { threshold: 0.10, rootMargin: `-${64}px 0px 0px 0px` });

  observer.observe(inlineTOC);
}

/* ── Init ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Remove no-transition class after first paint so transitions work normally */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('lc-no-trans');
    });
  });

  applyTheme(resolveTheme());

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  const canvas = document.getElementById('hero-canvas');
  if (canvas) new Particles(canvas);

  initMobileMenu();
  initScrollTop();
  initHeaderScroll();
  initBlogControls();
  initReadingProgress();
  initScrollReveal();
  initCodeCopy();
  initTocHighlight();
  initImageBlurUp();
  initArticleTree();
  initFloatingTOC();
});

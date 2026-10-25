/* =====================================================
   THE NEWSROOM — Main Application Logic
   (Requires js/articles.js to be loaded first)
   ===================================================== */

/* ---------- STATE ---------- */
let currentLang = 'en';

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initLiveTime();
  initThemeToggle();
  initLangToggle();
  initMobileMenu();
  initSearch();
  initTickerPause();
  initModalBackdropClose();
  applyLanguage(currentLang);
});

/* ---------- LIVE TIME ---------- */
function initLiveTime() {
  const timeElem = document.getElementById('live-time');
  if (!timeElem) return;
  const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    timeElem.innerHTML = `<i class="far fa-clock"></i> ${now.toLocaleDateString('en-US', options)}`;
  };
  updateTime();
  setInterval(updateTime, 60000);
}

/* ---------- THEME TOGGLE ---------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-toggle-label');
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    const icon = toggleBtn.querySelector('i');
    if (next === 'dark') {
      icon.className = 'fas fa-sun';
      if (label) label.textContent = currentLang === 'hi' ? 'लाइट मोड' : 'Light Mode';
    } else {
      icon.className = 'fas fa-moon';
      if (label) label.textContent = currentLang === 'hi' ? 'डार्क मोड' : 'Dark Mode';
    }
  });
}

/* ---------- LANGUAGE TOGGLE ---------- */
function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  const label = document.getElementById('lang-toggle-label');
  if (!btn) return;
  btn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    applyLanguage(currentLang);

    if (label) label.textContent = currentLang === 'en' ? 'हिन्दी' : 'English';

    const themeLabel = document.getElementById('theme-toggle-label');
    if (themeLabel) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) themeLabel.textContent = currentLang === 'hi' ? 'लाइट मोड' : 'Light Mode';
      else         themeLabel.textContent = currentLang === 'hi' ? 'डार्क मोड' : 'Dark Mode';
    }
  });
}

function applyLanguage(lang) {
  document.body.classList.toggle('lang-hi', lang === 'hi');

  const title = document.getElementById('masthead-title');
  const tagline = document.getElementById('masthead-tagline');
  if (lang === 'hi') {
    title.textContent = 'द न्यूज़रूम';
    tagline.textContent = 'समाचार • विचार • दृष्टिकोण';
  } else {
    title.textContent = 'The Newsroom';
    tagline.textContent = 'News • Views • Perspectives';
  }

  document.querySelectorAll('[data-en][data-hi]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.placeholder = lang === 'hi'
      ? 'समाचार, विषय, लेखक या कीवर्ड खोजें...'
      : 'Search news, topics, authors or keywords...';
  }
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-toggle');
  const navList = document.getElementById('nav-links-list');
  if (!btn || !navList) return;
  btn.addEventListener('click', () => navList.classList.toggle('mobile-open'));
}

/* ---------- ARTICLE MODAL ---------- */
function openArticleById(id) {
  const data = articlesDatabase[id] || fallbackArticle();

  document.getElementById('modal-title').innerText    = data.title[currentLang]    || data.title.en;
  document.getElementById('modal-category').innerText = data.category[currentLang] || data.category.en;
  document.getElementById('modal-author').innerText   = data.author[currentLang]   || data.author.en;
  document.getElementById('modal-date').innerText     = data.date[currentLang]     || data.date.en;
  document.getElementById('modal-image').src          = data.image;

  const paras = data.paragraphs[currentLang] || data.paragraphs.en;
  document.getElementById('modal-text').innerHTML = paras.map(p => `<p>${p}</p>`).join('');

  openModal('article-reader-modal');
}

function fallbackArticle() {
  return {
    title:      { en: "Newsroom Special Report", hi: "न्यूज़रूम विशेष रिपोर्ट" },
    category:   { en: "General News", hi: "सामान्य समाचार" },
    author:     { en: "By News Desk", hi: "समाचार डेस्क द्वारा" },
    date:       { en: "September 28, 2026", hi: "28 सितंबर, 2026" },
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop",
    paragraphs: {
      en: ["This is a sample article dynamically rendered by The Newsroom article modal reader system."],
      hi: ["यह न्यूज़रूम लेख मोडल रीडर सिस्टम द्वारा गतिशील रूप से प्रस्तुत एक नमूना लेख है।"]
    }
  };
}

/* ---------- MODAL HELPERS ---------- */
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
}

/* ---------- VIDEO MODAL ---------- */
function playVideo(videoId, title) {
  if (!videoId || videoId.startsWith('YOUTUBE_ID')) {
    alert('⚠️ Video placeholder\n\nReplace "' + videoId + '" in index.html with a real YouTube video ID.\n\nExample: onclick="playVideo(\'dQw4w9WgXcQ\', \'Title\')"');
    return;
  }
  const modal  = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  if (iframe && modal) {
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoModal() {
  const modal  = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  if (iframe && modal) {
    iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ---------- SEARCH ---------- */
function initSearch() {
  const triggerBtn = document.getElementById('search-trigger-btn');
  const overlay    = document.getElementById('search-overlay');
  const input      = document.getElementById('search-input');
  const results    = document.getElementById('search-results-list');
  if (!triggerBtn || !overlay || !input) return;

  triggerBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    input.focus();
  });

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) { results.innerHTML = ''; return; }

    const matches = Object.entries(articlesDatabase).filter(([id, art]) => {
      const t = (art.title[currentLang] || art.title.en).toLowerCase();
      const c = (art.category[currentLang] || art.category.en).toLowerCase();
      return t.includes(query) || c.includes(query);
    });

    if (matches.length === 0) {
      results.innerHTML = `<div style="padding:1rem; color:var(--text-muted);">No headlines found matching "${query}"</div>`;
    } else {
      results.innerHTML = matches.map(([id, art]) => `
        <div style="padding:0.75rem; border-bottom:1px solid var(--border-color); cursor:pointer;"
             onclick="closeSearch(); openArticleById('${id}');">
          <span class="category-tag">${art.category[currentLang] || art.category.en}</span>
          <h4 style="font-family:var(--font-serif); color:var(--text-primary);">${art.title[currentLang] || art.title.en}</h4>
        </div>
      `).join('');
    }
  });
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.classList.remove('active');
}

/* ---------- TICKER PAUSE ---------- */
function initTickerPause() {
  const pauseBtn = document.getElementById('ticker-pause-btn');
  const tickerItems = document.getElementById('ticker-items-wrapper');
  if (pauseBtn && tickerItems) {
    pauseBtn.addEventListener('click', () => {
      const paused = tickerItems.style.animationPlayState === 'paused';
      tickerItems.style.animationPlayState = paused ? 'running' : 'paused';
      pauseBtn.innerHTML = paused ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    });
  }
}

/* ---------- MODAL BACKDROP / ESC CLOSE ---------- */
function initModalBackdropClose() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
        if (backdrop.id === 'video-modal') {
          document.getElementById('video-iframe').src = '';
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => {
        m.classList.remove('active');
        if (m.id === 'video-modal') document.getElementById('video-iframe').src = '';
      });
      document.body.style.overflow = '';
      closeSearch();
    }
  });
}
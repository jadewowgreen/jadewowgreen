// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let rafId = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

if (cursor && ring && !prefersReducedMotion && !coarsePointer) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      rafId = null;
    });
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
    requestAnimationFrame(animateRing);
  }

  animateRing();
} else {
  // Avoid extra animation work when unsupported or unnecessary.
  document.body.style.cursor = 'auto';
  if (cursor) cursor.style.display = 'none';
  if (ring) ring.style.display = 'none';
}

// Scroll reveal (skip observer when reduced motion: CSS already shows content)
const reveals = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  reveals.forEach(el => el.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// Week-based theming and active nav state.
const themes = {
  '1': { bg: '#f8ede3', bgSoft: '#f2dfce', bgMid: '#f4dcbf', surface: '#fff7f1', ink: '#2f1f18', muted: '#7a5a48', accent: '#c96f47', accentDark: '#9f4d2f', line: 'rgba(95, 56, 37, 0.16)', textSoft: '#8a8a88' },
  '2': { bg: '#fdf2e8', bgSoft: '#f8d8b8', bgMid: '#ffd0a8', surface: '#fff6ee', ink: '#3b2417', muted: '#8e6045', accent: '#e28155', accentDark: '#b95c36', line: 'rgba(125, 77, 51, 0.2)', textSoft: '#996f56' },
  '3': { bg: '#f8eef3', bgSoft: '#ecc6da', bgMid: '#e4b2d0', surface: '#fff6fb', ink: '#3a1f31', muted: '#8a5f7d', accent: '#c06fa0', accentDark: '#8f4f77', line: 'rgba(108, 72, 96, 0.2)', textSoft: '#9b748e' },
  '4': { bg: '#eff4fb', bgSoft: '#c9dff8', bgMid: '#b1d1f7', surface: '#f8fbff', ink: '#1f2f3f', muted: '#60758d', accent: '#6e9fda', accentDark: '#4f79ab', line: 'rgba(72, 108, 143, 0.2)', textSoft: '#758ea8' },
  '5': { bg: '#fff4e7', bgSoft: '#f9d8b1', bgMid: '#f3c38e', surface: '#fff9f1', ink: '#3a2715', muted: '#8a6642', accent: '#cf8b44', accentDark: '#9f6129', line: 'rgba(118, 83, 44, 0.2)', textSoft: '#9a7651' },
  '6': { bg: '#eef7ef', bgSoft: '#cce7cf', bgMid: '#b7debe', surface: '#f7fcf8', ink: '#1f3323', muted: '#56755b', accent: '#6ea676', accentDark: '#487d50', line: 'rgba(66, 102, 73, 0.2)', textSoft: '#6a8e70' },
  '7': { bg: '#f1f0fb', bgSoft: '#d2cff3', bgMid: '#bdb7ee', surface: '#f9f8ff', ink: '#26243a', muted: '#666285', accent: '#8077d0', accentDark: '#5f56aa', line: 'rgba(87, 78, 139, 0.2)', textSoft: '#7773a0' },
  '8': { bg: '#fdeef0', bgSoft: '#f7c9d3', bgMid: '#f3b0c0', surface: '#fff7f9', ink: '#3b2028', muted: '#8d5b6a', accent: '#d67893', accentDark: '#a54f6d', line: 'rgba(123, 74, 92, 0.2)', textSoft: '#9f6d7c' },
  '9': { bg: '#edf5f3', bgSoft: '#c9e3db', bgMid: '#acd8ca', surface: '#f6fcfa', ink: '#1f322d', muted: '#5b7f74', accent: '#67a998', accentDark: '#437d6f', line: 'rgba(66, 103, 93, 0.2)', textSoft: '#6f9086' },
  '10': { bg: '#f8eef1', bgSoft: '#ecc7ce', bgMid: '#e2afb9', surface: '#fff7f9', ink: '#372027', muted: '#855965', accent: '#bf6f83', accentDark: '#8f4a5d', line: 'rgba(112, 71, 83, 0.2)', textSoft: '#956a76' },
  '11': { bg: '#f2f2ea', bgSoft: '#dddac4', bgMid: '#cfc9ab', surface: '#faf9f3', ink: '#2f2b1f', muted: '#756f57', accent: '#a79b6b', accentDark: '#7c724b', line: 'rgba(99, 92, 64, 0.2)', textSoft: '#878066' },
  '12': { bg: '#efe5db', bgSoft: '#d8c1ab', bgMid: '#e5d2bf', surface: '#fff6ec', ink: '#2f1d13', muted: '#735643', accent: '#c7784a', accentDark: '#9b5734', line: 'rgba(110, 72, 49, 0.18)', textSoft: '#8c6b59' }
};

function ensureHoverCaptions() {
  const slots = document.querySelectorAll('.photo-slot');
  slots.forEach(slot => {
    const img = slot.querySelector('img');
    if (!img) return;

    // Reuse the finalized two-line copy already stored in title attributes.
    const captionRaw = img.getAttribute('title');
    if (!captionRaw) return;

    if (slot.querySelector('.photo-hover-caption')) return;

    const lines = captionRaw.split('\n').map(line => line.trim()).filter(Boolean);
    const caption = document.createElement('div');
    caption.className = 'photo-hover-caption';

    const lineOne = document.createElement('p');
    lineOne.className = 'photo-hover-line-main';
    lineOne.textContent = lines[0] || '';

    const lineTwo = document.createElement('p');
    lineTwo.className = 'photo-hover-line-meta';
    lineTwo.textContent = lines[1] || '';

    caption.appendChild(lineOne);
    caption.appendChild(lineTwo);
    slot.appendChild(caption);
  });
}

ensureHoverCaptions();

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section[id^="episode"]'));

function applyTheme(episodeNumber) {
  const theme = themes[episodeNumber] || themes['1'];
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--bg-soft', theme.bgSoft);
  root.style.setProperty('--bg-mid', theme.bgMid);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--ink', theme.ink);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-dark', theme.accentDark);
  root.style.setProperty('--line', theme.line);
  root.style.setProperty('--text-soft', theme.textSoft);
}

function setActiveNav(episodeId) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${episodeId}`;
    link.classList.toggle('active', isActive);
  });
}

function activateEpisode(episodeId) {
  const episodeNumber = episodeId.replace('episode', '');
  applyTheme(episodeNumber);
  setActiveNav(episodeId);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const episodeId = link.getAttribute('href').replace('#', '');
    activateEpisode(episodeId);
  });
});

if ('IntersectionObserver' in window && sections.length > 0) {
  const activeObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      activateEpisode(visible[0].target.id);
    }
  }, {
    threshold: [0.4, 0.6],
    rootMargin: '-20% 0px -35% 0px'
  });

  sections.forEach(section => activeObserver.observe(section));
}

const initialFromHash = window.location.hash.replace('#', '');
if (initialFromHash && initialFromHash.startsWith('episode')) {
  activateEpisode(initialFromHash);
} else {
  activateEpisode('episode1');
}
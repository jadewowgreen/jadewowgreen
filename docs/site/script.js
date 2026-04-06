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
  '1': { bg: '#f8ede3', bgSoft: '#f2e0d0', bgMid: '#f3e6d9', surface: '#fff7f1', ink: '#2f1f18', muted: '#7a5a48', accent: '#c96f47', accentDark: '#9f4d2f', line: 'rgba(95, 56, 37, 0.16)', textSoft: '#8a8a88' },
  '2': { bg: '#f6efe4', bgSoft: '#efd5bb', bgMid: '#f1e3d2', surface: '#fff8f0', ink: '#382018', muted: '#88634f', accent: '#d0825b', accentDark: '#ad5f3e', line: 'rgba(130, 86, 58, 0.18)', textSoft: '#9a7a67' },
  '3': { bg: '#f7ece7', bgSoft: '#e9d2c6', bgMid: '#f2e2d8', surface: '#fff8f5', ink: '#3c2016', muted: '#8d6656', accent: '#bf7a67', accentDark: '#995843', line: 'rgba(120, 80, 62, 0.18)', textSoft: '#a17d70' },
  '4': { bg: '#f4efe9', bgSoft: '#dfd0c2', bgMid: '#ede2d7', surface: '#fffbf8', ink: '#2f271f', muted: '#7d6a5a', accent: '#b68d6d', accentDark: '#8e664b', line: 'rgba(115, 92, 73, 0.18)', textSoft: '#928170' },
  '5': { bg: '#f8efe2', bgSoft: '#f1cfab', bgMid: '#f5e1ca', surface: '#fff8ef', ink: '#3e2416', muted: '#8f6a4f', accent: '#d58a52', accentDark: '#b56633', line: 'rgba(140, 94, 58, 0.18)', textSoft: '#a68266' },
  '6': { bg: '#f5efe7', bgSoft: '#e5d8c8', bgMid: '#efe4d8', surface: '#fffaf3', ink: '#332418', muted: '#7e6650', accent: '#c38e68', accentDark: '#956541', line: 'rgba(125, 93, 65, 0.18)', textSoft: '#967d65' },
  '7': { bg: '#f3eee7', bgSoft: '#dfd0c7', bgMid: '#ece3db', surface: '#fff9f4', ink: '#2f221c', muted: '#7a665d', accent: '#b48a79', accentDark: '#8f6758', line: 'rgba(110, 89, 80, 0.18)', textSoft: '#918077' },
  '8': { bg: '#f6efe9', bgSoft: '#e6d5cb', bgMid: '#f0e2da', surface: '#fff9f6', ink: '#35241e', muted: '#806860', accent: '#c8907f', accentDark: '#9f6555', line: 'rgba(123, 89, 78, 0.18)', textSoft: '#987971' },
  '9': { bg: '#f3efe8', bgSoft: '#e0d7ca', bgMid: '#ece5dc', surface: '#fffaf4', ink: '#30271f', muted: '#756a5f', accent: '#a8957f', accentDark: '#7c6a56', line: 'rgba(110, 99, 85, 0.18)', textSoft: '#8b8073' },
  '10': { bg: '#f7ebe9', bgSoft: '#efd1cb', bgMid: '#f2dfdc', surface: '#fff7f5', ink: '#3a1f1c', muted: '#8a5e58', accent: '#cb7d74', accentDark: '#a4544a', line: 'rgba(130, 82, 73, 0.18)', textSoft: '#9a726b' },
  '11': { bg: '#f4efe8', bgSoft: '#e0d4c2', bgMid: '#ece2d5', surface: '#fffaf2', ink: '#2f271f', muted: '#786b5c', accent: '#b79871', accentDark: '#896f4b', line: 'rgba(114, 97, 74, 0.18)', textSoft: '#8f8271' },
  '12': { bg: '#efe5db', bgSoft: '#d8c1ab', bgMid: '#e5d2bf', surface: '#fff6ec', ink: '#2f1d13', muted: '#735643', accent: '#c7784a', accentDark: '#9b5734', line: 'rgba(110, 72, 49, 0.18)', textSoft: '#8c6b59' }
};

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
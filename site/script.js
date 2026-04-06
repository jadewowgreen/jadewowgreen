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

// Theme switching on nav click
const themes = {
  '1': { bg: '#f8ede3', bgSoft: '#f2e0d0', surface: '#fff7f1', ink: '#2f1f18', muted: '#7a5a48', accent: '#c96f47', accentDark: '#9f4d2f', line: 'rgba(95, 56, 37, 0.16)', textSoft: '#8a8a88' },
  '2': { bg: '#e8f5e8', bgSoft: '#c8e6c9', surface: '#f1f8e9', ink: '#1b5e20', muted: '#4caf50', accent: '#66bb6a', accentDark: '#388e3c', line: 'rgba(76, 175, 80, 0.16)', textSoft: '#81c784' },
  '3': { bg: '#fce4ec', bgSoft: '#f8bbd9', surface: '#fce4ec', ink: '#880e4f', muted: '#e91e63', accent: '#f06292', accentDark: '#c2185b', line: 'rgba(233, 30, 99, 0.16)', textSoft: '#f48fb1' },
  '4': { bg: '#e3f2fd', bgSoft: '#bbdefb', surface: '#e3f2fd', ink: '#0d47a1', muted: '#2196f3', accent: '#42a5f5', accentDark: '#1976d2', line: 'rgba(33, 150, 243, 0.16)', textSoft: '#64b5f6' },
  '5': { bg: '#fff3e0', bgSoft: '#ffe0b2', surface: '#fff3e0', ink: '#e65100', muted: '#ff9800', accent: '#ffb74d', accentDark: '#f57c00', line: 'rgba(255, 152, 0, 0.16)', textSoft: '#ffcc02' },
  '6': { bg: '#f3e5f5', bgSoft: '#ce93d8', surface: '#f3e5f5', ink: '#4a148c', muted: '#9c27b0', accent: '#ba68c8', accentDark: '#7b1fa2', line: 'rgba(156, 39, 176, 0.16)', textSoft: '#ce93d8' },
  '7': { bg: '#e0f2f1', bgSoft: '#b2dfdb', surface: '#e0f2f1', ink: '#004d40', muted: '#009688', accent: '#26a69a', accentDark: '#00695c', line: 'rgba(0, 150, 136, 0.16)', textSoft: '#4db6ac' },
  '8': { bg: '#efebe9', bgSoft: '#d7ccc8', surface: '#efebe9', ink: '#3e2723', muted: '#795548', accent: '#a1887f', accentDark: '#5d4037', line: 'rgba(121, 85, 72, 0.16)', textSoft: '#bcaaa4' },
  '9': { bg: '#e8eaf6', bgSoft: '#c5cae9', surface: '#e8eaf6', ink: '#1a237e', muted: '#3f51b5', accent: '#7986cb', accentDark: '#303f9f', line: 'rgba(63, 81, 181, 0.16)', textSoft: '#9fa8da' },
  '10': { bg: '#fce4ec', bgSoft: '#f8bbd9', surface: '#fce4ec', ink: '#880e4f', muted: '#e91e63', accent: '#f06292', accentDark: '#c2185b', line: 'rgba(233, 30, 99, 0.16)', textSoft: '#f48fb1' },
  '11': { bg: '#f1f8e9', bgSoft: '#dcedc8', surface: '#f1f8e9', ink: '#33691e', muted: '#689f38', accent: '#aed581', accentDark: '#558b2f', line: 'rgba(104, 159, 56, 0.16)', textSoft: '#a4b441' },
  '12': { bg: '#e0f7fa', bgSoft: '#b2ebf2', surface: '#ffffff', ink: '#0d47a1', muted: '#546e7a', accent: '#00bcd4', accentDark: '#0097a7', line: 'rgba(0, 188, 212, 0.16)', textSoft: '#78909c' }
};

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const ep = href.replace('#episode', '');
    const theme = themes[ep];
    if (theme) {
      for (let prop in theme) {
        document.documentElement.style.setProperty(`--${prop}`, theme[prop]);
      }
    }
  });
});
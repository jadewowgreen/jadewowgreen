// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let rafId = null;
let activeEpisodeId = '';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

if (cursor && ring && !prefersReducedMotion && !coarsePointer) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      // Move ring in the same frame to avoid a continuous RAF loop.
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      rafId = null;
    });
  }, { passive: true });
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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// Week-based nav active state and CSS theme switching.

function ensureHoverCaptions() {
  const slots = document.querySelectorAll('.photo-slot');
  slots.forEach(slot => {
    const img = slot.querySelector('img');
    if (!img) return;

    // Reuse the finalized two-line copy already stored in title attributes.
    const captionRaw = img.getAttribute('title');
    if (!captionRaw) return;

    if (slot.querySelector('.photo-hover-caption')) return;

    const lines = captionRaw.replace(/&#10;/g, '\n').split('\n').map(line => line.trim()).filter(Boolean);
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

function setActiveNav(episodeId) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${episodeId}`;
    link.classList.toggle('active', isActive);
  });
}

function activateEpisode(episodeId) {
  if (episodeId === activeEpisodeId) return;
  activeEpisodeId = episodeId;
  const episodeNumber = episodeId.replace('episode', '');
  document.body.setAttribute('data-episode', episodeNumber);
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
    let topEntry = null;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!topEntry || entry.intersectionRatio > topEntry.intersectionRatio) {
        topEntry = entry;
      }
    });

    if (topEntry) {
      activateEpisode(topEntry.target.id);
    }
  }, {
    threshold: 0.55,
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
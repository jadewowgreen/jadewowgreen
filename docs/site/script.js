const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const trackedSections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveNav(sectionId) {
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${sectionId}`);
  });
}

function ensureHoverCaptions() {
  const slots = document.querySelectorAll('.photo-slot');
  slots.forEach(slot => {
    const img = slot.querySelector('img');
    if (!img || slot.querySelector('.photo-hover-caption')) return;

    const raw = img.getAttribute('title');
    if (!raw) return;

    const lines = raw
      .replace(/&#10;/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const caption = document.createElement('div');
    caption.className = 'photo-hover-caption';

    const main = document.createElement('p');
    main.className = 'photo-hover-line-main';
    main.textContent = lines[0] || '';

    const meta = document.createElement('p');
    meta.className = 'photo-hover-line-meta';
    meta.textContent = lines[1] || '';

    caption.append(main, meta);
    slot.appendChild(caption);
  });
}

function initActiveSectionTracking() {
  if (!('IntersectionObserver' in window) || trackedSections.length === 0) {
    setActiveNav('home');
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      let best = null;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      });
      if (best) {
        setActiveNav(best.target.id);
      }
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: '-15% 0px -45% 0px'
    }
  );

  trackedSections.forEach(section => observer.observe(section));

  const initial = window.location.hash.replace('#', '');
  if (initial && trackedSections.some(section => section.id === initial)) {
    setActiveNav(initial);
  } else {
    setActiveNav('home');
  }
}

ensureHoverCaptions();
initActiveSectionTracking();

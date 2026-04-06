const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

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

ensureHoverCaptions();

const initial = window.location.hash.replace('#', '');
setActiveNav(initial && navLinks.some(link => link.getAttribute('href') === `#${initial}`) ? initial : 'home');

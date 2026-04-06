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

function renderComingSoonPlaceholders() {
  const grid = document.getElementById('coming-grid');
  const summary = document.getElementById('coming-summary');
  if (!grid || !summary) return;

  const now = new Date();
  const target = new Date('2026-05-29T23:59:59');
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    summary.textContent = 'may 29 has arrived. this space is ready for the next drop.';
    grid.innerHTML = `
      <article class="work-card coming-card">
        <h3>out now</h3>
        <p>new work can go live any time.</p>
      </article>
    `;
    return;
  }

  const weeksLeft = Math.max(1, Math.ceil(diff / msPerWeek));
  summary.textContent = `${weeksLeft} week${weeksLeft === 1 ? '' : 's'} until may 29.`;

  const cards = Array.from({ length: weeksLeft }, (_, i) => {
    const weekNumber = i + 1;
    return `
      <article class="work-card coming-card">
        <h3>week ${weekNumber}</h3>
        <p>coming soon</p>
      </article>
    `;
  });

  grid.innerHTML = cards.join('');
}

ensureHoverCaptions();
renderComingSoonPlaceholders();

const initial = window.location.hash.replace('#', '');
setActiveNav(initial && navLinks.some(link => link.getAttribute('href') === `#${initial}`) ? initial : 'home');

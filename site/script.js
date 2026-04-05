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
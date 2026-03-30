/* ════════════════════════════════════════════
   ARYAN SABALE — PORTFOLIO JS
   ════════════════════════════════════════════ */

'use strict';

/* ── LOADER ── */
function dismissLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('hidden')) return;
  loader.classList.add('hidden');
  document.body.classList.add('page-ready');
  triggerInitialReveals();
}
// Dismiss as soon as DOM is ready — never waits on slow fonts/images
document.addEventListener('DOMContentLoaded', () => setTimeout(dismissLoader, 700));
// Fired if page fully loads faster
window.addEventListener('load', () => setTimeout(dismissLoader, 100));
// Absolute fallback — force dismiss after 1.5s no matter what
setTimeout(dismissLoader, 1500);

/* ── NAV SCROLL EFFECT ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Animate skill bars if inside a skill card
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          fill.style.width = fill.dataset.width + '%';
        }
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* Trigger hero reveals immediately after loader */
function triggerInitialReveals() {
  const heroReveals = document.querySelectorAll('#hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 140);
  });
}

/* ── SMOOTH SECTION ACTIVE LINK ── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
      });
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && !active.classList.contains('nav-cta')) {
        active.style.color = 'var(--white)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── SKILL BARS (also triggered by IntersectionObserver above) ── */
// Catch any bars already visible on load
document.querySelectorAll('.skill-fill').forEach(fill => {
  const card = fill.closest('.skill-card');
  if (card && card.classList.contains('visible')) {
    fill.style.width = fill.dataset.width + '%';
  }
});

/* ── PARALLAX HERO GLOW ── */
const heroGlow = document.querySelector('.hero-glow');
if (heroGlow) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    heroGlow.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

/* ── PROJECT CARD TILT ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
    card.style.transition = 'none';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

/* ── CONSOLE EASTER EGG ── */
console.log(
  '%c👋 Hey there, developer!',
  'font-size:18px; font-weight:bold; color:#f5a623;'
);
console.log(
  '%cThis portfolio was crafted by Aryan Sabale — AI & ML student.\nReach out: aryansabale1181@gmail.com',
  'color:#8888a0; font-size:13px;'
);

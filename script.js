/* ════════════════════════════════════════════
   ARYAN SABALE — PORTFOLIO JS v2.0
   Safe, crash-resistant, performance-optimised
   ════════════════════════════════════════════ */

'use strict';

/* ── UTILITY: safe element getter ── */
function $(id) {
  try { return document.getElementById(id); } catch { return null; }
}
function $$(sel) {
  try { return document.querySelectorAll(sel); } catch { return []; }
}

/* ════════════════════════════
   LOADER — triple-layered safety
════════════════════════════ */
(function initLoader() {
  try {
    const loader = $('loader');
    if (!loader) return;

    let dismissed = false;

    function dismissLoader() {
      if (dismissed) return;
      dismissed = true;
      try {
        loader.classList.add('hidden');
        document.body.classList.add('page-ready');
        triggerHeroReveals();
      } catch (e) {
        // Nuclear fallback: inline-style it away
        loader.style.cssText = 'opacity:0;visibility:hidden;pointer-events:none;';
        document.body.classList.add('page-ready');
      }
    }

    // Layer 1: DOM ready + small delay for paint
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(dismissLoader, 650);
    });

    // Layer 2: window load (faster if assets load quickly)
    window.addEventListener('load', function () {
      setTimeout(dismissLoader, 100);
    });

    // Layer 3: Hard timeout — no matter what, dismiss after 1.8s
    setTimeout(dismissLoader, 1800);

  } catch (e) {
    console.warn('[Portfolio] Loader init failed:', e);
  }
})();

/* ════════════════════════════
   NAV SCROLL EFFECT
════════════════════════════ */
(function initNav() {
  try {
    const nav = $('nav');
    if (!nav) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  } catch (e) {
    console.warn('[Portfolio] Nav init failed:', e);
  }
})();

/* ════════════════════════════
   HAMBURGER + MOBILE MENU
════════════════════════════ */
(function initMobileMenu() {
  try {
    const hamburger  = $('hamburger');
    const mobileMenu = $('mobileMenu');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on any nav link click
    $$('.mm-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on backdrop click
    const backdrop = mobileMenu.querySelector('.mm-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

  } catch (e) {
    console.warn('[Portfolio] Mobile menu init failed:', e);
  }
})();

/* ════════════════════════════
   SCROLL REVEAL
════════════════════════════ */
(function initReveal() {
  try {
    const revealEls = $$('.reveal');
    if (!revealEls.length) return;

    // Check IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal everything immediately
      revealEls.forEach(function (el) {
        el.classList.add('visible');
        animateSkillBar(el);
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || '0', 10) || 0;
        setTimeout(function () {
          try {
            entry.target.classList.add('visible');
            animateSkillBar(entry.target);
          } catch (e) { /* ignore */ }
        }, Math.min(delay, 600)); // cap delay at 600ms
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealEls.forEach(function (el) {
      // Don't observe hero elements — they're handled by triggerHeroReveals
      if (!el.closest('#hero')) {
        observer.observe(el);
      }
    });

  } catch (e) {
    console.warn('[Portfolio] Reveal init failed:', e);
    // Fallback: show everything
    try {
      $$('.reveal').forEach(function (el) { el.classList.add('visible'); });
    } catch (_) { /* ignore */ }
  }
})();

function animateSkillBar(el) {
  try {
    const fill = el.querySelector && el.querySelector('.skill-fill');
    if (fill && fill.dataset.width) {
      fill.style.width = fill.dataset.width + '%';
    }
  } catch (e) { /* ignore */ }
}

/* Hero reveals: staggered after loader dismiss */
function triggerHeroReveals() {
  try {
    const heroEls = $$('#hero .reveal');
    heroEls.forEach(function (el, i) {
      setTimeout(function () {
        try {
          el.classList.add('visible');
        } catch (_) { /* ignore */ }
      }, i * 130);
    });
  } catch (e) {
    console.warn('[Portfolio] Hero reveals failed:', e);
  }
}

/* ════════════════════════════
   ACTIVE NAV LINK (Intersection)
════════════════════════════ */
(function initActiveLinks() {
  try {
    const sections   = $$('section[id]');
    const navAnchors = $$('.nav-links a');
    if (!sections.length || !navAnchors.length) return;

    if (!('IntersectionObserver' in window)) return;

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            if (!a.classList.contains('nav-cta')) {
              a.classList.add('active');
            }
          }
        });
      });
    }, { threshold: 0.45 });

    sections.forEach(function (s) { sectionObserver.observe(s); });

  } catch (e) {
    console.warn('[Portfolio] Active links init failed:', e);
  }
})();

/* ════════════════════════════
   PARALLAX HERO GLOW
   (desktop only, throttled)
════════════════════════════ */
(function initParallax() {
  try {
    // Skip on touch/mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const heroGlow = document.querySelector('.hero-glow');
    if (!heroGlow) return;

    let rafId = null;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        try {
          const x = ((mx / window.innerWidth)  - 0.5) * 36;
          const y = ((my / window.innerHeight) - 0.5) * 26;
          heroGlow.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        } catch (_) { /* ignore */ }
        rafId = null;
      });
    }, { passive: true });

  } catch (e) {
    console.warn('[Portfolio] Parallax init failed:', e);
  }
})();

/* ════════════════════════════
   CARD TILT (desktop only)
════════════════════════════ */
(function initCardTilt() {
  try {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    $$('.project-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        try {
          const rect = card.getBoundingClientRect();
          const cx   = rect.left + rect.width  / 2;
          const cy   = rect.top  + rect.height / 2;
          const dx   = (e.clientX - cx) / (rect.width  / 2);
          const dy   = (e.clientY - cy) / (rect.height / 2);
          card.style.transform = 'translateY(-5px) rotateX(' + (-dy * 2.5) + 'deg) rotateY(' + (dx * 2.5) + 'deg)';
          card.style.transition = 'transform 0.05s linear, box-shadow var(--transition), border-color var(--transition)';
        } catch (_) { /* ignore */ }
      });

      card.addEventListener('mouseleave', function () {
        try {
          card.style.transform = '';
          card.style.transition = '';
        } catch (_) { /* ignore */ }
      });

      // Accessibility: reset on focus-out
      card.addEventListener('blur', function () {
        try {
          card.style.transform = '';
          card.style.transition = '';
        } catch (_) { /* ignore */ }
      }, true);
    });

  } catch (e) {
    console.warn('[Portfolio] Card tilt init failed:', e);
  }
})();

/* ════════════════════════════
   SMOOTH SCROLL (anchor override)
   Ensures offset for fixed nav
════════════════════════════ */
(function initSmoothScroll() {
  try {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = ($('nav') || {}).offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  } catch (e) {
    console.warn('[Portfolio] Smooth scroll init failed:', e);
  }
})();

/* ════════════════════════════
   CONSOLE EASTER EGG
════════════════════════════ */
try {
  console.log(
    '%c👋 Hey developer!',
    'font-size:18px; font-weight:bold; color:#f5a623; font-family:monospace;'
  );
  console.log(
    '%cThis portfolio was crafted by Aryan Sabale — AI & ML student.\nReach out: aryansabale1181@gmail.com',
    'color:#7f7f9a; font-size:13px; font-family:monospace;'
  );
} catch (_) { /* ignore */ }

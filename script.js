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
   PROJECTS DATA (JSON) & MODALS
════════════════════════════ */
const projectsData = [
  {
    title: "Hindustan General Stores",
    category: "E-Commerce \u00B7 Strategy",
    featured: true,
    description: "Launched an online retail journey via Amazon \u2014 managing listings, strategy, and customer experience. Planning multi-platform expansion and brand growth.",
    stack: ["Amazon Seller", "Business Strategy", "Market Research"],
    expandedDetails: "A comprehensive deep dive into supply chain structuring and multi-platform D2C strategy, scaling digital presence through data-driven Amazon ecosystem algorithms.",
    demoLink: "#",
    repoLink: null
  },
  {
    title: "BioVote System",
    category: "Civic Tech \u00B7 AI",
    featured: false,
    description: "Conceptualised a biometric-based voting platform using fingerprint & facial recognition to eliminate electoral fraud, ensure voter authenticity, and modernise the democratic process with secure AI-powered identity verification.",
    stack: ["Biometrics", "AI / ML", "System Design"],
    expandedDetails: "Leveraged advanced ML object detection (facial recognition) and biometric security hashing to construct a bulletproof identity verification system designed to revolutionize transparency in democratic environments.",
    demoLink: null,
    repoLink: "https://github.com/aryansabale"
  },
  {
    title: "Responsive Websites",
    category: "Web Dev",
    featured: false,
    description: "Built clean, structured web pages with HTML, CSS, and JavaScript \u2014 focused on semantic markup, mobile responsiveness, and polished UI.",
    stack: ["HTML", "CSS", "JavaScript"],
    expandedDetails: "Mastered fundamental web architectures including DOM manipulation, CSS Grid/Flexbox layouts, and semantic HTML5 to deliver responsive edge-to-edge experiences across any device.",
    demoLink: "#",
    repoLink: "#"
  },
  {
    title: "Limitless AI <span class='wip-badge'>In Progress</span>",
    category: "Vision \u00B7 AI",
    featured: false,
    description: "My long-term mission: build an advanced AI system that solves real-world problems at scale. Actively learning and laying the foundation now.",
    stack: ["Python", "ML", "Future Tech"],
    expandedDetails: "An ongoing explorative framework designed to integrate NLP and computer vision to solve generalized automation tasks in local industry workflows.",
    demoLink: null,
    repoLink: null
  }
];

(function initProjectsAndModals() {
  const grid = $('projects-grid');
  if (grid) {
    let html = '';
    projectsData.forEach((p, idx) => {
      let stackHtml = p.stack.map(s => `<li>${s}</li>`).join('');
      html += `
        <div class="project-card reveal ${p.featured ? 'featured' : ''}" data-index="${idx}" tabindex="0" role="button">
          <div class="project-tag">${p.category}</div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <ul class="project-stack" aria-label="Tech stack">
            ${stackHtml}
          </ul>
          <div class="project-arrow" aria-hidden="true">→</div>
        </div>
      `;
    });
    grid.innerHTML = html;
  }

  // Modals
  const modal = $('project-modal');
  const modalBody = $('modal-body');
  const closeBtn = document.querySelector('.modal-close');
  if (!modal || !modalBody || !closeBtn) return;

  function openModal(project) {
    let stackHtml = project.stack.map(s => `<li>${s}</li>`).join('');
    let linksHtml = '';
    if (project.demoLink) linksHtml += `<a href="${project.demoLink}" class="btn-primary magnetic" target="_blank">Live Demo</a>`;
    if (project.repoLink) linksHtml += `<a href="${project.repoLink}" class="btn-ghost magnetic" target="_blank">View GitHub</a>`;
    
    modalBody.innerHTML = `
      <div class="project-tag">${project.category}</div>
      <h3 style="font-family:var(--font-display);font-size:2rem;color:var(--white);margin:0.5rem 0 1rem;line-height:1.1">${project.title}</h3>
      <p style="color:var(--text-muted);line-height:1.8;margin-bottom:1.5rem">${project.expandedDetails}</p>
      <ul class="project-stack" style="margin-bottom:2.5rem">${stackHtml}</ul>
      <div class="hero-btns">${linksHtml}</div>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; 
    if (typeof initMagnetic === 'function') initMagnetic();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if(grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (card) {
        const idx = card.getAttribute('data-index');
        if (idx !== null) openModal(projectsData[idx]);
      }
    });
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

let typeWriterTriggered = false;
function triggerTypewriter() {
  if (typeWriterTriggered) return;
  typeWriterTriggered = true;
  try {
    const el = $('typewriter');
    if (!el) return;
    const text = el.getAttribute('data-text');
    if (!text) return;
    el.innerHTML = '';
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeChar, 30 + Math.random() * 40); // 30-70ms per char
      }
    }
    setTimeout(typeChar, 400); // Wait after reveal
  } catch (e) {
    console.warn('[Portfolio] Typewriter failed:', e);
  }
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
    triggerTypewriter();
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
   SCROLL PROGRESS BAR
════════════════════════════ */
(function initScrollProgress() {
  try {
    const progressBar = $('scroll-progress');
    if (!progressBar) return;
    window.addEventListener('scroll', function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  } catch (e) { console.warn(e); }
})();

/* ════════════════════════════
   NEURAL NETWORK CANVAS
════════════════════════════ */
(function initNetworkCanvas() {
  try {
    const canvas = $('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 30 : 70;
    let mouse = { x: null, y: null, radius: 120 };

    function resize() {
      const hero = $('hero');
      if(!hero) return;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', function(e) {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('mouseout', function() {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 1.5 + 1;
      }
      update() {
        if (this.x > width || this.x < 0) this.vx = -this.vx;
        if (this.y > height || this.y < 0) this.vy = -this.vy;
        this.x += this.vx;
        this.y += this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist/110) * 0.4})`; // soft lines
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        
        if (mouse.x != null && mouse.y != null) {
           const rect = canvas.getBoundingClientRect();
           const relativeMouseX = mouse.x - rect.left;
           const relativeMouseY = mouse.y - rect.top;
           const realDx = particles[i].x - relativeMouseX;
           const realDy = particles[i].y - relativeMouseY;
           const realDist = Math.sqrt(realDx * realDx + realDy * realDy);

           if (realDist < mouse.radius) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - realDist/mouse.radius) * 0.6})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(relativeMouseX, relativeMouseY);
              ctx.stroke();
           }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();

  } catch(e) {
    console.warn('[Portfolio] Network canvas failed: ', e);
  }
})();

/* ════════════════════════════
   COPY TO CLIPBOARD
════════════════════════════ */
(function initCopyEmail() {
  try {
    const copyBtn = document.querySelector('.copy-email');
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const email = 'aryansabale1181@gmail.com';
      navigator.clipboard.writeText(email).then(function() {
        const tooltip = copyBtn.querySelector('.copy-tooltip');
        if (tooltip) {
          const originalText = tooltip.textContent;
          tooltip.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(function() {
            copyBtn.classList.remove('copied');
            tooltip.textContent = originalText;
          }, 2000);
        }
      }).catch(function(err) {
        console.warn('[Portfolio] Could not copy text: ', err);
      });
    });
  } catch (e) {
    console.warn('[Portfolio] Copy email init failed:', e);
  }
})();

/* ════════════════════════════
   MAGNETIC UI BUTTONS
════════════════════════════ */
function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(el => {
    // Only bind once
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = "true";
    
    el.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, background 0.3s ease';

    el.addEventListener('mousemove', function(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Gently pull the button
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
    });
  });
}
initMagnetic();

/* ════════════════════════════
   CONTACT FORM SUBMISSION
════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const ogText = btn.textContent;
    btn.textContent = 'Sending...';

    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        status.textContent = 'Message sent successfully!';
        status.style.color = '#00f2fe';
        form.reset();
      } else {
        response.json().then(data => {
          if (data.errors) {
            status.textContent = data.errors.map(error => error.message).join(", ");
          } else {
            status.textContent = 'Oops! There was a problem submitting your form';
          }
          status.style.color = '#ff4a4a';
        })
      }
    }).catch(error => {
      status.textContent = 'Oops! There was a problem submitting your form';
      status.style.color = '#ff4a4a';
    }).finally(() => {
      btn.textContent = ogText;
    });
  });
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

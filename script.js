/* ==========================================================================
   UDAY S B — PORTFOLIO SCRIPT
   Vanilla JS only. Organised into small, focused functions initialised
   once on DOMContentLoaded.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileNav();
  initScrollSpy();
  initTypewriter();
  initRevealOnScroll();
  initSkillMeters();
  initScrollTopButton();
  initContactForm();
  initFooterYear();
});

/* -------------------------------- LOADER -------------------------------- */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hide = () => loader.classList.add('is-hidden');
  // Give the entrance animation a moment to play, then reveal the page.
  window.addEventListener('load', () => setTimeout(hide, 550));
  // Safety net in case 'load' fires very late (slow assets).
  setTimeout(hide, 2500);
}

/* -------------------------------- NAVBAR SCROLL STATE -------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggle = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* -------------------------------- MOBILE NAV TOGGLE -------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggleBtn || !links) return;

  const closeMenu = () => {
    links.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is used.
  links.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* -------------------------------- SCROLLSPY (active nav highlighting) -------------------------------- */
function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* -------------------------------- TYPEWRITER (hero role line) -------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Operations Associate',
    'Data Analytics Background',
    'Excel · SQL · Power BI · Python',
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 1600;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
    }
  }

  tick();
}

/* -------------------------------- REVEAL-ON-SCROLL -------------------------------- */
function initRevealOnScroll() {
  // Apply the reveal treatment to section headings and cards, then observe them.
  const targets = document.querySelectorAll(
    '.section__head, .about__card, .skill-card, .timeline__item, .project-card, .cert-card, .achieve-card, .contact__info, .contact__form'
  );

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* -------------------------------- SKILL PROGRESS BARS -------------------------------- */
function initSkillMeters() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  const fills = grid.querySelectorAll('.meter__fill');

  const animateFill = (fillEl) => {
    const value = fillEl.getAttribute('data-value') || 0;
    fillEl.style.width = `${value}%`;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateFill(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  fills.forEach((fill) => observer.observe(fill));
}

/* -------------------------------- SCROLL-TO-TOP BUTTON -------------------------------- */
function initScrollTopButton() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('is-visible', window.scrollY > 480);
  };
  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------- CONTACT FORM (frontend-only validation) -------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Please add a short subject.',
    message: (v) => v.trim().length >= 10 || 'Your message should be at least 10 characters.',
  };

  const showError = (field, message) => {
    const row = form.querySelector(`#${field}`).closest('.form__row');
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    row.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message && message !== true ? message : '';
  };

  // Live-validate on blur for quicker feedback.
  Object.keys(validators).forEach((field) => {
    const input = form.querySelector(`#${field}`);
    if (!input) return;
    input.addEventListener('blur', () => {
      const result = validators[field](input.value);
      showError(field, result === true ? '' : result);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    status.style.color = '';

    let isValid = true;
    Object.keys(validators).forEach((field) => {
      const input = form.querySelector(`#${field}`);
      const result = validators[field](input.value);
      if (result !== true) {
        isValid = false;
        showError(field, result);
      } else {
        showError(field, '');
      }
    });

    if (!isValid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = 'var(--danger)';
      return;
    }

    // Frontend-only: no backend is wired up, so simulate a successful send.
    status.textContent = 'Thanks — your message has been noted. This form is frontend-only, so connect it to an email service or backend to actually receive messages.';
    status.style.color = 'var(--success)';
    form.reset();
  });
}

/* -------------------------------- FOOTER YEAR -------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

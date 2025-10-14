// Theme initialization
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const isLight = stored ? stored === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.classList.toggle('light', isLight);
})();

// Theme toggle button
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? '☀️' : '🌙';
    });
    // Initialize icon
    themeToggle.textContent = document.documentElement.classList.contains('light') ? '☀️' : '🌙';
  }

  // Mobile nav
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${targetId}`);
      }
    });
  });

  // Typewriter rotating roles
  const roles = [
    'CSE Student',
    'Web Developer',
    'Java & C++ Learner',
    'Problem Solver'
  ];
  const typeEl = document.querySelector('.typewriter');
  if (typeEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 90;
    const pause = 1200;
    function tick() {
      const current = roles[roleIndex % roles.length];
      if (!deleting) {
        charIndex++;
        typeEl.textContent = '— ' + current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, pause);
          return;
        }
      } else {
        charIndex--;
        typeEl.textContent = '— ' + current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex++;
        }
      }
      setTimeout(tick, deleting ? typeSpeed / 2 : typeSpeed);
    }
    tick();
  }

  // Active section highlight on scroll
  const sections = Array.from(document.querySelectorAll('main .section')).map(s => ({ id: s.id, top: 0 }));
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
  function recalc() {
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      s.top = el ? el.offsetTop - 100 : 0;
    });
  }
  function highlight() {
    const y = window.scrollY;
    let current = sections[0]?.id;
    for (const s of sections) {
      if (y >= s.top) current = s.id;
    }
    navLinks.forEach(a => {
      const on = a.getAttribute('href') === `#${current}`;
      a.style.background = on ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : '';
    });
  }
  recalc();
  highlight();
  window.addEventListener('scroll', highlight, { passive: true });
  window.addEventListener('resize', recalc);

  // Project search and filter
  const searchInput = document.getElementById('project-search');
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('.project');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const activeChip = document.querySelector('.chip[aria-pressed="true"]');
    const filter = activeChip ? activeChip.getAttribute('data-filter') : 'all';
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const text = card.textContent.toLowerCase();
      const matchesTag = filter === 'all' || tags.includes(filter);
      const matchesQuery = !q || tags.includes(q) || text.includes(q);
      card.style.display = matchesTag && matchesQuery ? '' : 'none';
    });
  }
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    applyFilters();
  }));
  searchInput?.addEventListener('input', applyFilters);
  applyFilters();

  // Contact form validation + mailto fallback
  const form = document.getElementById('contact-form');
  const status = document.querySelector('.form-status');
  const mailto = document.getElementById('mailto-fallback');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !email || !message) {
      status.textContent = 'Please complete all fields.';
      return;
    }
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    const href = `mailto:navyajonnalagadda2005@gmail.com?subject=${subject}&body=${body}`;
    if (mailto) mailto.setAttribute('href', href);
    window.location.href = href;
    status.textContent = 'Opening your email app...';
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal], .card, .section h2');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
});



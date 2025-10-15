// Background Animations
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    // Random size
    const size = 1 + Math.random() * 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    particlesContainer.appendChild(particle);
  }
}

// Cursor trail effect
function createCursorTrail() {
  const trail = [];
  const trailLength = 20;
  
  document.addEventListener('mousemove', (e) => {
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    dot.style.width = '4px';
    dot.style.height = '4px';
    dot.style.background = 'var(--accent)';
    dot.style.borderRadius = '50%';
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '9999';
    dot.style.opacity = '0.6';
    dot.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(dot);
    trail.push(dot);
    
    if (trail.length > trailLength) {
      const oldDot = trail.shift();
      oldDot.style.opacity = '0';
      setTimeout(() => oldDot.remove(), 300);
    }
    
    setTimeout(() => {
      dot.style.opacity = '0';
      setTimeout(() => dot.remove(), 300);
    }, 100);
  });
}

// Interactive background elements
function makeShapesInteractive() {
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach(shape => {
    shape.addEventListener('mouseenter', () => {
      shape.style.animationPlayState = 'paused';
      shape.style.transform = 'scale(1.2)';
      shape.style.opacity = '0.2';
    });
    
    shape.addEventListener('mouseleave', () => {
      shape.style.animationPlayState = 'running';
      shape.style.transform = '';
      shape.style.opacity = '0.1';
    });
  });
}

// Parallax scrolling for background elements
function initParallaxBackground() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    const orbs = document.querySelectorAll('.gradient-orb');
    
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.1);
      shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    orbs.forEach((orb, index) => {
      const speed = 0.3 + (index * 0.1);
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

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

  // Animated counters
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = current.toFixed(1);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
    });
  }

  // Skills progress bars animation
  function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 500);
    });
  }

  // Project modal functionality
  const modal = document.getElementById('project-modal');
  const projectBtns = document.querySelectorAll('.project-btn');
  const modalClose = document.querySelector('.modal-close');

  const projectData = {
    ecommerce: {
      title: 'E-Commerce Website',
      tags: ['Web', 'React', 'Node.js', 'MySQL'],
      description: 'A comprehensive online shopping platform built with modern web technologies.',
      features: [
        'User authentication and authorization',
        'Product catalog with search and filtering',
        'Shopping cart and checkout process',
        'Order tracking and management',
        'Admin dashboard for inventory management',
        'Payment gateway integration'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'Express', 'MySQL', 'JWT'],
      demo: '#',
      code: '#'
    },
    banking: {
      title: 'Online Banking System',
      tags: ['Java', 'Web', 'Database'],
      description: 'A secure digital banking platform for managing financial transactions.',
      features: [
        'Account balance viewing',
        'Fund transfers between accounts',
        'Bill payment system',
        'Transaction history',
        'Customer support portal',
        'Security features and encryption'
      ],
      tech: ['Java', 'Spring Boot', 'MySQL', 'HTML/CSS', 'JavaScript', 'REST API'],
      demo: '#',
      code: '#'
    }
  };

  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-tags').innerHTML = data.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      document.getElementById('modal-description').innerHTML = `<p>${data.description}</p>`;
      document.getElementById('modal-features').innerHTML = `
        <h4>Key Features:</h4>
        <ul>${data.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
      `;
      document.getElementById('modal-tech').innerHTML = `
        <h4>Technologies Used:</h4>
        <div class="tech-grid">${data.tech.map(tech => `<div class="tech-item"><span>${tech}</span></div>`).join('')}</div>
      `;
      
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Scroll reveal with enhanced animations
  const revealEls = document.querySelectorAll('[data-reveal], .card, .section h2');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger specific animations based on element type
        if (entry.target.classList.contains('stat-card')) {
          animateCounters();
        }
        if (entry.target.classList.contains('skill-item')) {
          animateSkills();
        }
        
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Enhanced hover effects for tech items
  document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.animation = 'float 2s ease-in-out infinite';
    });
    item.addEventListener('mouseleave', () => {
      item.style.animation = '';
    });
  });

  // Initialize background animations
  createParticles();
  createCursorTrail();
  makeShapesInteractive();
  initParallaxBackground();
});



// ── Mobile nav toggle ───────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navEl = document.querySelector('nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navEl.classList.toggle('nav-open');
  });
}

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navEl.classList.remove('nav-open'));
});

// ── Active nav link ──────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}
setActiveNav();

// ── Scroll fade-up animations ────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Counter animation ────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseInt(entry.target.dataset.target);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Form submission (Formspree compatible) ───
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        form.innerHTML = `
          <div style="text-align:center; padding: 48px 0;">
            <div style="font-size:2.5rem; margin-bottom:16px;">✓</div>
            <p style="font-family:var(--font-display); font-size:1.4rem; color:var(--blue); margin-bottom:8px;">Message envoyé avec succès</p>
            <p style="font-size:0.9rem; color:var(--mid);">Je vous répondrai dans les 24 heures.</p>
          </div>
        `;
      } else {
        throw new Error('Formspree error');
      }
    } catch {
      btn.textContent = original;
      btn.disabled = false;
      alert('Une erreur est survenue. Contactez-moi directement par téléphone.');
    }
  });
}

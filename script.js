/* ===================================================
   KOFLUENCE — PREMIUM REDESIGN — SCRIPT.JS
   =================================================== */

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

/* ─── HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── HERO PARTICLES ─── */
(function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 12}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
})();

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── STATS COUNTER ─── */
const statItems = document.querySelectorAll('.stat-item');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateStats();
    }
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

statItems.forEach(item => statsObserver.observe(item));

function animateStats() {
  const items = [
    { el: document.getElementById('stat-0'), target: 750, suffix: 'K+', decimal: false },
    { el: document.getElementById('stat-1'), target: 7.5, suffix: 'B+', decimal: true },
    { el: document.getElementById('stat-2'), target: 3000, suffix: '+', decimal: false },
    { el: document.getElementById('stat-3'), target: 25, suffix: '+', decimal: false },
  ];

  items.forEach(({ el, target, suffix, decimal }) => {
    if (!el) return;
    const duration = 2200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (decimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.round(current).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ─── AI DASHBOARD BARS ANIMATION ─── */
const dashboardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.dm-bar').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 150);
      });
      dashboardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const dashCard = document.querySelector('.dashboard-card');
if (dashCard) dashboardObserver.observe(dashCard);

/* ─── CREATOR FILTER ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const creatorCards = document.querySelectorAll('.creator-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    creatorCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── CAMPAIGN BUILDER ─── */
let currentStep = 1;
const totalSteps = 3;
const selections = { goal: null, audience: null, budget: 10 };

const steps = {
  1: document.getElementById('builder-step-1'),
  2: document.getElementById('builder-step-2'),
  3: document.getElementById('builder-step-3'),
};
const prevBtn = document.getElementById('builder-prev');
const nextBtn = document.getElementById('builder-next');
const submitBtn = document.getElementById('builder-submit');
const dots = [
  document.getElementById('bpd-1'),
  document.getElementById('bpd-2'),
  document.getElementById('bpd-3'),
];

function showStep(step) {
  Object.values(steps).forEach(s => s && s.classList.remove('active'));
  if (steps[step]) steps[step].classList.add('active');

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i < step);
  });

  if (prevBtn) prevBtn.style.display = step > 1 ? 'block' : 'none';
  if (nextBtn) nextBtn.style.display = step < totalSteps ? 'block' : 'none';
  if (submitBtn) submitBtn.style.display = step === totalSteps ? 'block' : 'none';
}

// Option selection toggle
document.querySelectorAll('#goal-options .builder-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#goal-options .builder-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selections.goal = btn.dataset.val;
  });
});

document.querySelectorAll('#audience-options .builder-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#audience-options .builder-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selections.audience = btn.dataset.val;
  });
});

// Budget slider
const budgetSlider = document.getElementById('budget-slider');
const budgetDisplay = document.getElementById('budget-display');
const bpCreators = document.getElementById('bp-creators');
const bpReach = document.getElementById('bp-reach');
const bpContent = document.getElementById('bp-content');

if (budgetSlider) {
  budgetSlider.addEventListener('input', () => {
    const val = parseInt(budgetSlider.value);
    selections.budget = val;
    budgetDisplay.textContent = val >= 50 ? '₹50 Lakhs+' : `₹${val} Lakhs`;

    // Update slider gradient
    const pct = ((val - 5) / 95) * 100;
    budgetSlider.style.background = `linear-gradient(90deg, var(--lime) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;

    // Estimate creators/reach based on budget
    const baseCreators = Math.round(val * 2);
    const maxCreators = Math.round(val * 4.5);
    const baseReach = (val * 0.5).toFixed(0);
    const maxReach = (val * 1.5).toFixed(0);

    if (bpCreators) bpCreators.textContent = `${baseCreators}–${maxCreators}`;
    if (bpReach) bpReach.textContent = `${baseReach}M–${maxReach}M`;
    if (bpContent) bpContent.textContent = `${baseCreators * 2}–${maxCreators * 2}`;
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });
}

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    submitBtn.textContent = '✓ Campaign Brief Sent!';
    submitBtn.style.background = 'rgba(200,248,75,0.2)';
    submitBtn.style.border = '1.5px solid var(--lime)';
    submitBtn.style.color = 'var(--lime)';
    setTimeout(() => {
      submitBtn.textContent = 'Build My Campaign 🚀';
      submitBtn.style.background = '';
      submitBtn.style.border = '';
      submitBtn.style.color = '';
      currentStep = 1;
      showStep(1);
    }, 3000);
  });
}

// Initialize
showStep(1);

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─── SMOOTH HOVER ON CASE CARDS ─── */
document.querySelectorAll('.case-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 6;
    const tiltY = (x - 0.5) * -6;
    card.style.transform = `translateY(-6px) scale(1.01) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── ADD REVEAL CLASSES DYNAMICALLY ─── */
(function addRevealClasses() {
  const selectors = [
    '.section-eyebrow', '.section-title', '.section-sub',
    '.how-step', '.ai-feat', '.testi-card',
    '.insight-card', '.creator-card',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 4 === 1) el.classList.add('reveal-delay-1');
      if (i % 4 === 2) el.classList.add('reveal-delay-2');
      if (i % 4 === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  });
})();

/* ─── CURSOR GLOW EFFECT ON HERO ─── */
const hero = document.getElementById('hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
}

/* ─── INIT BUDGET SLIDER GRADIENT ─── */
if (budgetSlider) {
  const pct = ((10 - 5) / 95) * 100;
  budgetSlider.style.background = `linear-gradient(90deg, var(--lime) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

console.log('%c🚀 Kofluence — Premium Redesign Loaded', 'color: #c8f84b; font-size: 14px; font-weight: bold;');

/* ─── TIMELINE NODE HIGHLIGHT ON SCROLL ─── */
const timelineNodes = document.querySelectorAll('.timeline-node');
if (timelineNodes.length > 0) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        // Optional: Remove active class when scrolled out of view to re-trigger
        // entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });
  
  timelineNodes.forEach(node => timelineObserver.observe(node));
}

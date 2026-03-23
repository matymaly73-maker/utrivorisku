/* ============================================================
   U Tří voříšků – Veterinární klinika
   JavaScript
   ============================================================ */

'use strict';

/* ---------- Sticky header ---------- */
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile nav ---------- */
const burger = document.getElementById('navBurger');
const navList = document.getElementById('navList');

burger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  // Animate burger → X
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navList.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, observerOpts);

sections.forEach(s => sectionObserver.observe(s));

/* ---------- Set min date for booking ---------- */
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pad = n => String(n).padStart(2, '0');
  dateInput.min = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  // Disable Sundays (0) in date picker via input event
  dateInput.addEventListener('change', () => {
    const chosen = new Date(dateInput.value + 'T00:00:00');
    if (chosen.getDay() === 0) { // Sunday
      dateInput.value = '';
      showFieldError('dateError', 'Neděle je zavřeno. Vyberte prosím jiný den.');
      dateInput.classList.add('error');
    }
  });
}

/* ---------- Booking form validation & submission ---------- */
const form          = document.getElementById('bookingForm');
const successBox    = document.getElementById('bookingSuccess');
const newBookingBtn = document.getElementById('newBookingBtn');
const submitBtn     = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });
}

if (newBookingBtn) {
  newBookingBtn.addEventListener('click', () => {
    form.reset();
    clearAllErrors();
    successBox.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function validateForm() {
  clearAllErrors();
  let valid = true;

  // Service
  const service = document.getElementById('service');
  if (!service.value) {
    showFieldError('serviceError', 'Vyberte prosím typ služby.');
    service.classList.add('error');
    valid = false;
  }

  // Date
  const date = document.getElementById('date');
  if (!date.value) {
    showFieldError('dateError', 'Vyberte prosím datum návštěvy.');
    date.classList.add('error');
    valid = false;
  } else {
    const chosen = new Date(date.value + 'T00:00:00');
    if (chosen.getDay() === 0) {
      showFieldError('dateError', 'Neděle je zavřeno. Vyberte prosím jiný den.');
      date.classList.add('error');
      valid = false;
    }
  }

  // Time
  const time = document.getElementById('time');
  if (!time.value) {
    showFieldError('timeError', 'Vyberte prosím preferovaný čas.');
    time.classList.add('error');
    valid = false;
  }

  // Pet name
  const petName = document.getElementById('petName');
  if (!petName.value.trim()) {
    showFieldError('petNameError', 'Zadejte jméno vašeho mazlíčka.');
    petName.classList.add('error');
    valid = false;
  }

  // Pet species
  const petSpecies = document.getElementById('petSpecies');
  if (!petSpecies.value) {
    showFieldError('petSpeciesError', 'Vyberte prosím druh zvířete.');
    petSpecies.classList.add('error');
    valid = false;
  }

  // Owner name
  const ownerName = document.getElementById('ownerName');
  if (!ownerName.value.trim()) {
    showFieldError('ownerNameError', 'Zadejte vaše jméno a příjmení.');
    ownerName.classList.add('error');
    valid = false;
  }

  // Phone
  const phone = document.getElementById('phone');
  const phoneClean = phone.value.replace(/\s/g, '');
  if (!phoneClean) {
    showFieldError('phoneError', 'Zadejte telefonní číslo.');
    phone.classList.add('error');
    valid = false;
  } else if (!/^(\+420|00420)?[0-9]{9}$/.test(phoneClean)) {
    showFieldError('phoneError', 'Zadejte platné české telefonní číslo.');
    phone.classList.add('error');
    valid = false;
  }

  // Email (optional but validate format if provided)
  const email = document.getElementById('email');
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showFieldError('emailError', 'Zadejte platnou e-mailovou adresu.');
    email.classList.add('error');
    valid = false;
  }

  // GDPR
  const gdpr = document.getElementById('gdpr');
  if (!gdpr.checked) {
    showFieldError('gdprError', 'Pro odeslání formuláře musíte souhlasit se zpracováním osobních údajů.');
    valid = false;
  }

  if (!valid) {
    // Scroll to first error
    const firstError = form.querySelector('.error, .form__error:not(:empty)');
    if (firstError) firstError.closest('.form__group, .form__section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

function submitForm() {
  // Simulate async submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
    Odesílám…
  `;

  setTimeout(() => {
    form.hidden = true;
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      Odeslat rezervaci
    `;
  }, 1400);
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearAllErrors() {
  document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Clear error on input change
form && form.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errId = el.id + 'Error';
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  });
  el.addEventListener('change', () => {
    el.classList.remove('error');
    const errId = el.id + 'Error';
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  });
});

/* ---------- Spinner animation ---------- */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin .8s linear infinite; }
  .nav__link.active { color: var(--green-700); background: var(--green-50); }
`;
document.head.appendChild(style);

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Scroll-in animations ---------- */
const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add animation classes
const animStyle = document.createElement('style');
animStyle.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: none;
  }
`;
document.head.appendChild(animStyle);

document.querySelectorAll(
  '.service-card, .team-card, .about__feature, .contact__item, .hours__table-wrap'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  animateOnScroll.observe(el);
});

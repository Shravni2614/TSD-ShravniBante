const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const backToTop = document.querySelector('.back-to-top');
const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');

navToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 420) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealElements = document.querySelectorAll('.reveal-up, .reveal-right');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const showFormMessage = (message, isError = false) => {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.style.color = isError ? '#f87171' : '#a5f3fc';
};

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = contactForm.querySelector('#name')?.value.trim();
  const email = contactForm.querySelector('#email')?.value.trim();
  const message = contactForm.querySelector('#message')?.value.trim();

  if (!name || !email || !message) {
    showFormMessage('Please complete all fields before sending your message.', true);
    return;
  }

  if (!isValidEmail(email)) {
    showFormMessage('Please enter a valid email address.', true);
    return;
  }

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await response.json();

    if (result.success) {
      showFormMessage(result.message);
      contactForm.reset();
    } else {
      showFormMessage(result.message || 'Unable to send your message at this time.', true);
    }
  } catch (error) {
    showFormMessage('Unable to send your message. Please try again later.', true);
  }
});

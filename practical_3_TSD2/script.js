const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const backToTop = document.querySelector('.back-to-top');
const contactForm = document.querySelector('#contactForm');

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

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = contactForm.querySelector('#name')?.value.trim();
  const email = contactForm.querySelector('#email')?.value.trim();
  const message = contactForm.querySelector('#message')?.value.trim();

  if (!name || !email || !message) {
    alert('Please complete all fields before sending your message.');
    return;
  }

  alert('Thank you, ' + name + '! Your message is ready to be sent. Connect a backend service to submit it live.');
  contactForm.reset();
});

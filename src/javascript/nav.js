/**
 * EduLearn Mobile Navigation
 * Handles the responsive hamburger menu without a framework.
 */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');

  if (!hamburger || !nav) {
    return;
  }

  function closeMenu() {
    nav.classList.remove('mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.textContent = '☰';
  }

  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');

    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.textContent = isOpen ? '✕' : '☰';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
})();

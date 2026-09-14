/**
 * EduLearn Theme Management
 * Handles light/dark mode and saves the user's preference.
 */
(function () {
  const STORAGE_KEY = 'edulearn_theme';
  const toggleButtons = document.querySelectorAll('.theme-toggle');

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return saved;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function updateIcons(theme) {
    toggleButtons.forEach((button) => {
      button.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      button.setAttribute(
        'aria-label',
        `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
      );
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcons(theme);
  }

  setTheme(getInitialTheme());

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentTheme =
        document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      setTheme(nextTheme);
    });
  });
})();

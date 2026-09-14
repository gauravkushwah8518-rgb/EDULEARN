/**
 * EduLearn Frontend Authentication
 * Uses localStorage for a simple frontend-only demo account system.
 */
(function () {
  const USER_KEY = 'edulearn_user';
  const USERS_KEY = 'edulearn_users';

  function readUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function titleCase(value) {
    return String(value || '')
      .replace(/[._-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }

  function nameFromEmail(email) {
    const localPart = String(email || '')
      .split('@')[0]
      .replace(/\d+/g, ' ')
      .trim();

    return titleCase(localPart || 'Learner');
  }

  function initials(name) {
    const parts = titleCase(name).split(' ').filter(Boolean);

    return (
      parts
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'EL'
    );
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function setUser(user) {
    const cleanUser = {
      name: titleCase(user.name) || nameFromEmail(user.email),
      email: String(user.email || '').trim().toLowerCase()
    };

    localStorage.setItem(USER_KEY, JSON.stringify(cleanUser));
    hydrateUser(cleanUser);
  }

  function hydrateUser(user) {
    if (!user) {
      return;
    }

    const name = titleCase(user.name) || nameFromEmail(user.email);
    const email = user.email || '';
    const firstName = name.split(' ')[0] || name;
    const userInitials = initials(name);

    document.querySelectorAll('[data-user-name], .user-name').forEach((element) => {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = name;
      } else {
        element.textContent = name;
      }
    });

    document
      .querySelectorAll('[data-user-first-name]')
      .forEach((element) => {
        element.textContent = firstName;
      });

    document
      .querySelectorAll('.user-avatar, .profile-avatar-large, [data-user-avatar]')
      .forEach((element) => {
        element.textContent = userInitials;
      });

    document.querySelectorAll('[data-user-email]').forEach((element) => {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = email;
      } else {
        element.textContent = email;
      }
    });

    // Replace legacy demo text so the logged-in user's name stays consistent.
    document.querySelectorAll('h1, h2, h3, h4, h5, p, span, div').forEach((element) => {
      if (
        element.children.length === 0 &&
        /Alex Johnson|Alex\b/.test(element.textContent)
      ) {
        element.textContent = element.textContent.replace(
          /Alex Johnson|Alex\b/g,
          name
        );
      }
    });
  }

  function showStatus(id, message) {
    const box = document.getElementById(id);

    if (!box) {
      return;
    }

    box.textContent = message;
    box.classList.add('is-visible');
  }

  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const firstName =
        document.getElementById('firstName')?.value.trim() || '';
      const lastName =
        document.getElementById('lastName')?.value.trim() || '';
      const email =
        document.getElementById('registerEmail')?.value.trim().toLowerCase() ||
        '';
      const password =
        document.getElementById('registerPassword')?.value || '';

      const name =
        titleCase([firstName, lastName].filter(Boolean).join(' ')) ||
        nameFromEmail(email);

      if (!email) {
        showStatus('registerStatus', 'Please enter your email address.');
        return;
      }

      const users = readUsers();
      users[email] = { name, email, password };

      saveUsers(users);
      setUser({ name, email });
      window.location.href = 'dashboard.html';
    });
  }

  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email =
        document.getElementById('loginEmail')?.value.trim().toLowerCase() || '';
      const password =
        document.getElementById('loginPassword')?.value || '';
      const users = readUsers();
      const account = users[email];

      if (!email) {
        showStatus('loginStatus', 'Please enter your email address.');
        return;
      }

      if (account && account.password !== password) {
        showStatus('loginStatus', 'Incorrect password. Please try again.');
        return;
      }

      setUser({
        name: account?.name || nameFromEmail(email),
        email
      });

      window.location.href = 'dashboard.html';
    });
  }

  document.querySelectorAll('[data-social]').forEach((button) => {
    button.addEventListener('click', function () {
      const form = this.closest('.auth-card')?.querySelector('form');
      const statusId =
        form?.id === 'loginForm' ? 'loginStatus' : 'registerStatus';

      showStatus(
        statusId,
        `${this.dataset.social} sign-in needs OAuth credentials; use email login for this frontend-only demo.`
      );
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    hydrateUser(getUser());
  });

  hydrateUser(getUser());
})();

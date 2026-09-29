/* ==========================================================================
   app.js — Inicialización global
   Sidebar toggle, auth guard, nav activa, menú de usuario.
   Se ejecuta en TODAS las páginas al cargarse el DOM.
   Depende de: storage.js
   ========================================================================== */

const App = {

  /**
   * Inicializa el sidebar colapsable.
   * Toggle con botón hamburguesa, cierre con overlay y botón X.
   */
  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const openBtn = document.getElementById('sidebar-open-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (!sidebar || !overlay || !openBtn) return;

    const openSidebar = () => {
      sidebar.classList.add('sidebar--open');
      overlay.classList.add('sidebar__overlay--visible');
      Storage.setItem('sidebar_open', true);
    };

    const closeSidebar = () => {
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('sidebar__overlay--visible');
      Storage.setItem('sidebar_open', false);
    };

    openBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
  },

  /**
   * Auth guard: protege admin.html.
   * Si no hay sesión activa, redirige a login.html.
   */
  initAuthGuard() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'admin.html') return;

    const session = Storage.getItem('auth_session');
    if (!session || session.loggedIn !== true) {
      window.location.href = '/login.html';
    }
  },

  /**
   * Marca el link activo del sidebar según la URL actual.
   */
  setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar__link');

    navLinks.forEach(link => {
      link.classList.remove('sidebar__link--active');
      const href = link.getAttribute('href');
      if (href) {
        const linkPage = href.split('/').pop();
        if (linkPage === currentPage) {
          link.classList.add('sidebar__link--active');
        }
      }
    });
  },

  /**
   * Actualiza el UI del header según el estado de sesión.
   * Si hay sesión: muestra nombre de usuario y botón logout.
   * Si no: muestra botón "Iniciar sesión".
   */
  initUserMenu() {
    const session = Storage.getItem('auth_session');
    const loginBtn = document.getElementById('header-login-btn');
    const userMenu = document.getElementById('header-user-menu');
    const userName = document.getElementById('header-user-name');
    const logoutBtn = document.getElementById('header-logout-btn');
    const sidebarLoginBtn = document.getElementById('sidebar-login-btn');

    if (session && session.loggedIn) {
      /* Sesión activa */
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userName) userName.textContent = session.user;
      if (sidebarLoginBtn) sidebarLoginBtn.textContent = session.user;

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          Storage.removeItem('auth_session');
          window.location.reload();
        });
      }
    } else {
      /* Sin sesión */
      if (loginBtn) loginBtn.style.display = '';
      if (userMenu) userMenu.style.display = 'none';
    }
  },

  /**
   * Inicializa la barra de búsqueda del header.
   */
  initSearchBar() {
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchBar = document.getElementById('search-bar');
    const searchInput = document.getElementById('search-input');

    if (!searchToggle || !searchBar || !searchInput) return;

    searchToggle.addEventListener('click', () => {
      const isActive = searchBar.classList.toggle('search-bar--active');
      if (isActive) {
        searchInput.focus();
      }
    });

    /* Cerrar con Escape */
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchBar.classList.remove('search-bar--active');
        searchInput.value = '';
        /* Disparar evento para limpiar resultados */
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  }
};

/* ── Ejecutar al cargar el DOM ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  App.initSidebar();
  App.initAuthGuard();
  App.setActiveNav();
  App.initUserMenu();
  App.initSearchBar();
});

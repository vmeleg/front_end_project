/* ==========================================================================
   favorites.js — Lógica de favoritos
   Toggle, verificar y renderizar noticias guardadas.
   Favoritos separados por usuario: clave favorites_<slug_usuario>.
   Si no hay sesión activa, solicita autenticación antes de guardar.
   Depende de: storage.js, news-service.js, news-renderer.js
   ========================================================================== */

const Favorites = {

  /**
   * Genera la clave de localStorage específica para el usuario activo.
   * Retorna null si no hay sesión iniciada.
   * @returns {string|null}
   */
  _getStorageKey() {
    const session = typeof Storage !== 'undefined' ? Storage.getItem('auth_session') : null;
    if (!session || !session.loggedIn) return null;
    /* Slug seguro del nombre de usuario */
    const slug = (session.user || 'guest').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `favorites_${slug}`;
  },

  /**
   * Redirige al login cuando se intenta usar favoritos sin sesión.
   */
  _requireAuth() {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = '/login.html?redirect=' + encodeURIComponent(currentPath);
  },

  /**
   * Alterna el estado de favorito de una noticia.
   * Requiere sesión activa; redirige a login si no la hay.
   * @param {string} id — ID de la noticia.
   * @returns {boolean} — Nuevo estado: true si es favorito, false si se removió.
   */
  toggleFavorite(id) {
    const key = this._getStorageKey();
    if (!key) {
      this._requireAuth();
      return false;
    }

    const favorites = Storage.getItem(key) || [];
    const index = favorites.indexOf(id);

    if (index !== -1) {
      favorites.splice(index, 1);
      Storage.setItem(key, favorites);
      return false;
    } else {
      favorites.push(id);
      Storage.setItem(key, favorites);
      return true;
    }
  },

  /**
   * Verifica si una noticia está marcada como favorita para el usuario activo.
   * @param {string} id — ID de la noticia.
   * @returns {boolean}
   */
  isFavorite(id) {
    const key = this._getStorageKey();
    if (!key) return false;
    const favorites = Storage.getItem(key) || [];
    return favorites.includes(id);
  },

  /**
   * Obtiene todos los IDs de noticias favoritas del usuario activo.
   * @returns {string[]}
   */
  getFavoriteIds() {
    const key = this._getStorageKey();
    if (!key) return [];
    return Storage.getItem(key) || [];
  },

  /**
   * Obtiene el conteo de favoritos del usuario activo.
   * @returns {number}
   */
  getCount() {
    return this.getFavoriteIds().length;
  },

  /**
   * Carga y renderiza las noticias favoritas en un contenedor.
   * Si no hay sesión, muestra mensaje solicitando inicio de sesión.
   * @param {string} containerSelector — Selector del contenedor.
   */
  async renderFavorites(containerSelector) {
    const key = this._getStorageKey();

    if (!key) {
      /* Sin sesión: mostrar CTA de login */
      const container = document.querySelector(containerSelector);
      if (!container) return;
      container.innerHTML = '';

      const empty = document.createElement('section');
      empty.classList.add('empty-state');

      const icon = document.createElement('span');
      icon.classList.add('empty-state__icon');
      icon.textContent = '🔒';
      empty.appendChild(icon);

      const title = document.createElement('h3');
      title.classList.add('empty-state__title');
      title.textContent = 'Inicia sesión para ver tus favoritos';
      empty.appendChild(title);

      const msg = document.createElement('p');
      msg.classList.add('empty-state__message');
      msg.textContent = 'Los favoritos se guardan por cuenta de usuario. Inicia sesión para acceder a los tuyos.';
      empty.appendChild(msg);

      const loginCta = document.createElement('a');
      loginCta.classList.add('btn', 'btn--primary');
      loginCta.href = '/login.html?redirect=/favoritos.html';
      loginCta.textContent = 'Iniciar sesión';
      empty.appendChild(loginCta);

      container.appendChild(empty);
      return;
    }

    const ids = this.getFavoriteIds();

    if (ids.length === 0) {
      NewsRenderer.renderEmptyState(
        'No tienes artículos guardados aún. Explora las noticias y marca las que te interesen.',
        containerSelector
      );
      return;
    }

    /* Cargar datos completos de cada favorito */
    const articles = [];
    for (const id of ids) {
      const article = await NewsService.getNewsById(id);
      if (article) articles.push(article);
    }

    if (articles.length === 0) {
      NewsRenderer.renderEmptyState(
        'Las noticias guardadas ya no están disponibles.',
        containerSelector
      );
      return;
    }

    NewsRenderer.renderCards(articles, containerSelector);
  }
};

/* ==========================================================================
   favorites.js — Lógica de favoritos
   Toggle, verificar y renderizar noticias guardadas.
   Depende de: storage.js, news-service.js, news-renderer.js
   ========================================================================== */

const Favorites = {
  /** Clave de localStorage para favoritos */
  STORAGE_KEY: 'favorites',

  /**
   * Alterna el estado de favorito de una noticia.
   * @param {string} id — ID de la noticia.
   * @returns {boolean} — Nuevo estado: true si es favorito, false si se removió.
   */
  toggleFavorite(id) {
    const favorites = Storage.getItem(this.STORAGE_KEY) || [];
    const index = favorites.indexOf(id);

    if (index !== -1) {
      favorites.splice(index, 1);
      Storage.setItem(this.STORAGE_KEY, favorites);
      return false;
    } else {
      favorites.push(id);
      Storage.setItem(this.STORAGE_KEY, favorites);
      return true;
    }
  },

  /**
   * Verifica si una noticia está marcada como favorita.
   * @param {string} id — ID de la noticia.
   * @returns {boolean}
   */
  isFavorite(id) {
    const favorites = Storage.getItem(this.STORAGE_KEY) || [];
    return favorites.includes(id);
  },

  /**
   * Obtiene todos los IDs de noticias favoritas.
   * @returns {string[]}
   */
  getFavoriteIds() {
    return Storage.getItem(this.STORAGE_KEY) || [];
  },

  /**
   * Obtiene el conteo de favoritos.
   * @returns {number}
   */
  getCount() {
    return this.getFavoriteIds().length;
  },

  /**
   * Carga y renderiza las noticias favoritas en un contenedor.
   * @param {string} containerSelector — Selector del contenedor.
   */
  async renderFavorites(containerSelector) {
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

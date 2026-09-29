/* ==========================================================================
   news-service.js — Servicio de noticias
   Fetch noticias.json + merge con news_custom + CRUD en memoria/storage.
   Depende de: storage.js
   ========================================================================== */

const NewsService = {
  /** Cache interna del seed (noticias.json) */
  _seedCache: null,

  /**
   * Carga el seed de noticias.json (con cache).
   * @returns {Promise<Array>}
   */
  async _fetchSeed() {
    if (this._seedCache) return this._seedCache;
    try {
      const response = await fetch('/data/noticias.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this._seedCache = await response.json();
      return this._seedCache;
    } catch (e) {
      console.error('NewsService._fetchSeed: error al cargar noticias.json', e);
      return [];
    }
  },

  /**
   * Obtiene todas las noticias: seed + custom, excluyendo eliminadas.
   * Ordenadas por fecha descendente.
   * @returns {Promise<Array>}
   */
  async getAllNews() {
    const seed = await this._fetchSeed();
    const custom = Storage.getItem('news_custom') || [];
    const deletedIds = Storage.getItem('deleted_news') || [];

    const filteredSeed = seed.filter(n => !deletedIds.includes(n.id));
    const merged = [...filteredSeed, ...custom];

    return merged.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  },

  /**
   * Busca una noticia por ID en el merge completo.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getNewsById(id) {
    const all = await this.getAllNews();
    return all.find(n => n.id === id) || null;
  },

  /**
   * Filtra noticias por categoría.
   * @param {string} category
   * @returns {Promise<Array>}
   */
  async getNewsByCategory(category) {
    const all = await this.getAllNews();
    return all.filter(n => n.categoria === category);
  },

  /**
   * Obtiene noticias marcadas como destacadas.
   * @returns {Promise<Array>}
   */
  async getFeaturedNews() {
    const all = await this.getAllNews();
    return all.filter(n => n.destacada === true);
  },

  /**
   * Busca noticias por título (case-insensitive, coincidencia parcial).
   * @param {string} query — Término de búsqueda.
   * @returns {Promise<Array>}
   */
  async searchByTitle(query) {
    const all = await this.getAllNews();
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return all;
    return all.filter(n => n.titulo.toLowerCase().includes(normalizedQuery));
  },

  /**
   * Añade una nueva noticia a news_custom en localStorage.
   * Genera un ID automático.
   * @param {Object} article — Datos de la noticia (sin id).
   * @returns {Object} La noticia con ID generado.
   */
  addNews(article) {
    const newArticle = {
      ...article,
      id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
    };
    Storage.appendToArray('news_custom', newArticle);
    return newArticle;
  },

  /**
   * Actualiza una noticia existente en news_custom.
   * @param {string} id — ID de la noticia.
   * @param {Object} data — Campos a actualizar.
   */
  updateNews(id, data) {
    const custom = Storage.getItem('news_custom') || [];
    const index = custom.findIndex(n => n.id === id);

    if (index !== -1) {
      /* Noticia custom: actualizar en el array */
      custom[index] = { ...custom[index], ...data };
      Storage.setItem('news_custom', custom);
    } else {
      /* Noticia del seed: crear copia editada en custom */
      const seedCopy = { ...data, id };
      Storage.appendToArray('news_custom', seedCopy);
    }
  },

  /**
   * Elimina una noticia.
   * - Si es custom: la elimina de news_custom.
   * - Si es del seed: la marca en deleted_news.
   * @param {string} id
   */
  deleteNews(id) {
    const custom = Storage.getItem('news_custom') || [];
    const isCustom = custom.some(n => n.id === id);

    if (isCustom) {
      Storage.removeFromArray('news_custom', id);
    } else {
      Storage.appendToArray('deleted_news', id);
    }
  },

  /**
   * Verifica si una noticia es del seed (no custom).
   * @param {string} id
   * @returns {boolean}
   */
  isSeedNews(id) {
    return this._seedCache ? this._seedCache.some(n => n.id === id) : !id.startsWith('custom-');
  }
};

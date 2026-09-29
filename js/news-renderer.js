/* ==========================================================================
   news-renderer.js — Renderizado dinámico de cards, detalle y modal
   Construye DOM con createElement (sin innerHTML con datos de usuario).
   Depende de: favorites.js (para estado de favoritos)
   ========================================================================== */

const NewsRenderer = {

  /**
   * Mapa de categorías a clases CSS para badges.
   */
  _categoryClass: {
    'Deportes': 'badge--deportes',
    'Finanzas': 'badge--finanzas',
    'Educación': 'badge--educacion',
    'Tecnología': 'badge--tecnologia',
    'Política': 'badge--politica',
    'Cultura': 'badge--cultura',
    'Salud': 'badge--salud',
    'Últimas Noticias': 'badge--ultimas'
  },

  /**
   * Formatea una fecha ISO a formato legible: "16 sep 2026".
   * @param {string} isoDate
   * @returns {string}
   */
  _formatDate(isoDate) {
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const d = new Date(isoDate + 'T00:00:00');
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  /**
   * Crea un elemento badge de categoría.
   * @param {string} category
   * @returns {HTMLElement}
   */
  _createBadge(category) {
    const badge = document.createElement('span');
    badge.classList.add('badge', this._categoryClass[category] || 'badge--ultimas');
    badge.textContent = category;
    return badge;
  },

  /**
   * Renderiza un array de noticias como cards en un contenedor.
   * @param {Array} articles — Array de noticias.
   * @param {string} containerSelector — Selector del contenedor.
   */
  renderCards(articles, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';

    if (articles.length === 0) {
      this.renderEmptyState('No se encontraron noticias.', containerSelector);
      return;
    }

    articles.forEach(article => {
      const card = this._createCard(article);
      container.appendChild(card);
    });
  },

  /**
   * Crea un elemento card para una noticia.
   * @param {Object} article
   * @returns {HTMLElement}
   */
  _createCard(article) {
    const card = document.createElement('article');
    card.classList.add('card');
    card.dataset.id = article.id;

    /* Wrapper de imagen */
    const imageWrapper = document.createElement('figure');
    imageWrapper.classList.add('card__image-wrapper');

    const img = document.createElement('img');
    img.classList.add('card__image');
    img.alt = article.titulo;
    img.loading = 'lazy';
    /* Referencia a /assets/img/ — si no existe, muestra placeholder */
    img.src = article.imagen;
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const placeholder = document.createElement('span');
      placeholder.classList.add('card__image-placeholder');
      placeholder.textContent = '📰';
      imageWrapper.appendChild(placeholder);
    });
    imageWrapper.appendChild(img);

    /* Badge de categoría */
    const badgeWrapper = document.createElement('span');
    badgeWrapper.classList.add('card__badge');
    badgeWrapper.appendChild(this._createBadge(article.categoria));
    imageWrapper.appendChild(badgeWrapper);

    /* Botón de favorito */
    const favBtn = document.createElement('button');
    favBtn.classList.add('card__fav-btn');
    favBtn.setAttribute('aria-label', 'Alternar favorito');
    favBtn.dataset.id = article.id;
    const isFav = typeof Favorites !== 'undefined' && Favorites.isFavorite(article.id);
    favBtn.textContent = isFav ? '★' : '☆';
    if (isFav) favBtn.classList.add('card__fav-btn--active');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof Favorites !== 'undefined') {
        const newState = Favorites.toggleFavorite(article.id);
        favBtn.textContent = newState ? '★' : '☆';
        favBtn.classList.toggle('card__fav-btn--active', newState);
      }
    });
    imageWrapper.appendChild(favBtn);

    card.appendChild(imageWrapper);

    /* Body */
    const body = document.createElement('section');
    body.classList.add('card__body');

    const title = document.createElement('h3');
    title.classList.add('card__title');
    title.textContent = article.titulo;
    body.appendChild(title);

    const excerpt = document.createElement('p');
    excerpt.classList.add('card__excerpt');
    excerpt.textContent = article.resumen;
    body.appendChild(excerpt);

    /* Meta: autor · fecha · tiempo lectura */
    const meta = document.createElement('footer');
    meta.classList.add('card__meta');

    const authorSpan = document.createElement('span');
    authorSpan.textContent = article.autor;
    meta.appendChild(authorSpan);

    const sep1 = document.createElement('span');
    sep1.classList.add('card__meta-separator');
    meta.appendChild(sep1);

    const dateSpan = document.createElement('span');
    dateSpan.textContent = this._formatDate(article.fecha);
    meta.appendChild(dateSpan);

    const sep2 = document.createElement('span');
    sep2.classList.add('card__meta-separator');
    meta.appendChild(sep2);

    const timeSpan = document.createElement('span');
    timeSpan.textContent = `${article.tiempoLectura || 3} min`;
    meta.appendChild(timeSpan);

    body.appendChild(meta);

    /* Botón "Ver más detalles →" */
    const actionWrapper = document.createElement('nav');
    actionWrapper.classList.add('card__action');

    const detailBtn = document.createElement('button');
    detailBtn.classList.add('btn', 'btn--outline', 'btn--block');
    detailBtn.textContent = 'Ver más detalles →';
    detailBtn.addEventListener('click', () => {
      this.openDetailModal(article);
    });
    actionWrapper.appendChild(detailBtn);
    body.appendChild(actionWrapper);

    card.appendChild(body);
    return card;
  },

  /**
   * Renderiza la vista detalle en un contenedor (para detalle.html).
   * @param {Object} article
   * @param {string} containerSelector
   */
  renderDetail(article, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container || !article) return;
    container.innerHTML = '';

    /* Hero image */
    const hero = document.createElement('figure');
    hero.classList.add('modal__hero');

    const heroImg = document.createElement('img');
    heroImg.classList.add('modal__hero-image');
    heroImg.src = article.imagen;
    heroImg.alt = article.titulo;
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
      const placeholder = document.createElement('span');
      placeholder.classList.add('modal__hero-placeholder');
      placeholder.textContent = '📰';
      hero.appendChild(placeholder);
    });
    hero.appendChild(heroImg);

    const overlay = document.createElement('figcaption');
    overlay.classList.add('modal__hero-overlay');

    const badgeWrap = document.createElement('span');
    badgeWrap.classList.add('modal__hero-badge');
    badgeWrap.appendChild(this._createBadge(article.categoria));
    overlay.appendChild(badgeWrap);

    const heroTitle = document.createElement('h1');
    heroTitle.classList.add('modal__hero-title');
    heroTitle.textContent = article.titulo;
    overlay.appendChild(heroTitle);

    hero.appendChild(overlay);
    container.appendChild(hero);

    /* Author row */
    const authorRow = document.createElement('section');
    authorRow.classList.add('modal__author-row');

    const avatar = document.createElement('span');
    avatar.classList.add('modal__author-avatar');
    avatar.textContent = article.autor.charAt(0).toUpperCase();
    authorRow.appendChild(avatar);

    const authorInfo = document.createElement('span');
    const authorName = document.createElement('span');
    authorName.classList.add('modal__author-name');
    authorName.textContent = article.autor;
    authorInfo.appendChild(authorName);
    authorRow.appendChild(authorInfo);

    const metaInfo = document.createElement('span');
    metaInfo.classList.add('modal__author-meta');
    metaInfo.textContent = `📅 ${this._formatDate(article.fecha)}   ⏱ ${article.tiempoLectura || 3} min de lectura`;
    authorRow.appendChild(metaInfo);

    const saveBtn = document.createElement('button');
    saveBtn.classList.add('modal__save-btn');
    saveBtn.dataset.id = article.id;
    const isFav = typeof Favorites !== 'undefined' && Favorites.isFavorite(article.id);
    saveBtn.textContent = isFav ? '★ Guardado' : '☆ Guardar';
    if (isFav) saveBtn.classList.add('modal__save-btn--active');
    saveBtn.addEventListener('click', () => {
      if (typeof Favorites !== 'undefined') {
        const newState = Favorites.toggleFavorite(article.id);
        saveBtn.textContent = newState ? '★ Guardado' : '☆ Guardar';
        saveBtn.classList.toggle('modal__save-btn--active', newState);
      }
    });
    authorRow.appendChild(saveBtn);

    container.appendChild(authorRow);

    /* Content body */
    const body = document.createElement('section');
    body.classList.add('modal__body');
    /* contenido puede tener HTML básico seguro (es del seed, no de usuario) */
    body.innerHTML = article.contenido;
    container.appendChild(body);
  },

  /**
   * Abre un modal overlay con la vista detalle de una noticia.
   * @param {Object} article
   */
  openDetailModal(article) {
    /* Remover modal previo si existe */
    const existing = document.getElementById('news-detail-modal');
    if (existing) existing.remove();

    const modal = document.createElement('aside');
    modal.id = 'news-detail-modal';
    modal.classList.add('modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Detalle de noticia');

    /* Overlay */
    const overlay = document.createElement('span');
    overlay.classList.add('modal__overlay');
    overlay.addEventListener('click', () => this.closeDetailModal());
    modal.appendChild(overlay);

    /* Content */
    const content = document.createElement('section');
    content.classList.add('modal__content');

    /* Close button */
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('modal__close');
    closeBtn.setAttribute('aria-label', 'Cerrar modal');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => this.closeDetailModal());
    content.appendChild(closeBtn);

    /* Render detail inside modal content */
    this.renderDetail(article, null);

    /* We need to build it manually since renderDetail expects a container selector */
    /* Hero */
    const hero = document.createElement('figure');
    hero.classList.add('modal__hero');
    const heroImg = document.createElement('img');
    heroImg.classList.add('modal__hero-image');
    heroImg.src = article.imagen;
    heroImg.alt = article.titulo;
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
      const ph = document.createElement('span');
      ph.classList.add('modal__hero-placeholder');
      ph.textContent = '📰';
      hero.appendChild(ph);
    });
    hero.appendChild(heroImg);

    const heroOverlay = document.createElement('figcaption');
    heroOverlay.classList.add('modal__hero-overlay');
    const badgeW = document.createElement('span');
    badgeW.classList.add('modal__hero-badge');
    badgeW.appendChild(this._createBadge(article.categoria));
    heroOverlay.appendChild(badgeW);
    const heroTitle = document.createElement('h2');
    heroTitle.classList.add('modal__hero-title');
    heroTitle.textContent = article.titulo;
    heroOverlay.appendChild(heroTitle);
    hero.appendChild(heroOverlay);
    content.appendChild(hero);

    /* Author row */
    const authorRow = document.createElement('section');
    authorRow.classList.add('modal__author-row');
    const avatar = document.createElement('span');
    avatar.classList.add('modal__author-avatar');
    avatar.textContent = article.autor.charAt(0).toUpperCase();
    authorRow.appendChild(avatar);
    const authorName = document.createElement('span');
    authorName.classList.add('modal__author-name');
    authorName.textContent = article.autor;
    authorRow.appendChild(authorName);
    const metaSpan = document.createElement('span');
    metaSpan.classList.add('modal__author-meta');
    metaSpan.textContent = `📅 ${this._formatDate(article.fecha)}   ⏱ ${article.tiempoLectura || 3} min de lectura`;
    authorRow.appendChild(metaSpan);

    const saveBtn = document.createElement('button');
    saveBtn.classList.add('modal__save-btn');
    const isFav = typeof Favorites !== 'undefined' && Favorites.isFavorite(article.id);
    saveBtn.textContent = isFav ? '★ Guardado' : '☆ Guardar';
    if (isFav) saveBtn.classList.add('modal__save-btn--active');
    saveBtn.addEventListener('click', () => {
      if (typeof Favorites !== 'undefined') {
        const newState = Favorites.toggleFavorite(article.id);
        saveBtn.textContent = newState ? '★ Guardado' : '☆ Guardar';
        saveBtn.classList.toggle('modal__save-btn--active', newState);
      }
    });
    authorRow.appendChild(saveBtn);
    content.appendChild(authorRow);

    /* Body */
    const body = document.createElement('section');
    body.classList.add('modal__body');
    body.innerHTML = article.contenido;
    content.appendChild(body);

    /* Footer */
    const footer = document.createElement('footer');
    footer.classList.add('modal__footer');
    const closeFooter = document.createElement('button');
    closeFooter.classList.add('modal__footer-close');
    closeFooter.textContent = 'Cerrar';
    closeFooter.addEventListener('click', () => this.closeDetailModal());
    footer.appendChild(closeFooter);
    content.appendChild(footer);

    modal.appendChild(content);
    document.body.appendChild(modal);

    /* Activar con delay para animación */
    requestAnimationFrame(() => {
      modal.classList.add('modal--active');
    });

    /* Bloquear scroll del body */
    document.body.style.overflow = 'hidden';

    /* Cerrar con ESC */
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeDetailModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  },

  /**
   * Cierra el modal de detalle.
   */
  closeDetailModal() {
    const modal = document.getElementById('news-detail-modal');
    if (!modal) return;
    modal.classList.remove('modal--active');
    document.body.style.overflow = '';
    setTimeout(() => modal.remove(), 300);
  },

  /**
   * Renderiza un estado vacío en un contenedor.
   * @param {string} message
   * @param {string} containerSelector
   */
  renderEmptyState(message, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';

    const empty = document.createElement('section');
    empty.classList.add('empty-state');

    const icon = document.createElement('span');
    icon.classList.add('empty-state__icon');
    icon.textContent = '📭';
    empty.appendChild(icon);

    const title = document.createElement('h3');
    title.classList.add('empty-state__title');
    title.textContent = 'Sin resultados';
    empty.appendChild(title);

    const msg = document.createElement('p');
    msg.classList.add('empty-state__message');
    msg.textContent = message;
    empty.appendChild(msg);

    const cta = document.createElement('a');
    cta.classList.add('btn', 'btn--primary');
    cta.href = '/index.html';
    cta.textContent = 'Ir al inicio';
    empty.appendChild(cta);

    container.appendChild(empty);
  }
};

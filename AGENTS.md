# AGENTS.md — Portal Web de Noticias

> Archivo canónico de directrices de desarrollo. Todo agente de IA o desarrollador que genere código en este proyecto **debe** leer y respetar este documento antes de producir cualquier artefacto.

---

## 1. Rol y Propósito del Proyecto

**Portal Web de Noticias multipágina interactivo.**
Entrega 2 — Prototipo Funcional (Semana 5).

- Permite explorar noticias, ver detalle, filtrar por categoría, gestionar favoritos y administrar noticias mediante un mini CRUD.
- Replica con exactitud la guía docente y el diseño funcional del mockup Figma: **paleta blanco/azul**, navegación por sidebar colapsable, header y footer persistentes en todas las páginas.
- Sin frameworks de UI ni bundlers. Sin dependencias externas de JavaScript.

---

## 2. Tech Stack Obligatorio

| Capa | Tecnología | Restricción |
|---|---|---|
| **Markup** | HTML5 semántico | `<header>` `<nav>` `<main>` `<article>` `<aside>` `<footer>`. ❌ Prohibido `<div>` sin propósito semántico. |
| **Estilos** | CSS3 nativo — Grid + Flexbox + Variables CSS | Responsive-first. Breakpoint mobile ≤ 768px. ❌ Sin Tailwind, Bootstrap ni librerías externas. |
| **Lógica** | Vanilla JavaScript ES6+ modular | Funciones puras, `async/await`, módulos ES6 o IIFE. ❌ Sin React, Vue, Angular, Alpine ni similares. |
| **Estado** | `localStorage` | Favoritos (`favorites`) + noticias custom del CRUD (`news_custom`) + sesión (`auth_session`). |
| **Datos** | `fetch('/data/noticias.json')` | Semilla inicial de solo lectura. El CRUD opera en memoria + `localStorage`. |

---

## 3. Estructura de Directorios Estricta

```text
front_end/
├── AGENTS.md                   # Este archivo
├── index.html                  # Home: bienvenida, noticias destacadas, filtro por categoría
├── detalle.html                # Vista detallada de noticia (?id=...)
├── favoritos.html              # Noticias guardadas en localStorage
├── contacto.html               # Formulario de contacto con validación
├── login.html                  # Autenticación (login y registro via usuarios.json)
├── admin.html                  # Mini CRUD — gestión de noticias (requiere sesión activa)
├── css/
│   ├── variables.css           # Paleta, tipografías, espaciados, z-index globales
│   ├── layout.css              # Header, sidebar colapsable, footer, grid principal
│   └── components.css          # Cards, badges, botones, modales, alertas, formularios
├── js/
│   ├── app.js                  # Inicialización global: sidebar toggle, auth guard, active nav
│   ├── storage.js              # Helper: get/set/remove en localStorage (tipado y seguro)
│   ├── news-service.js         # Fetch noticias.json + merge con news_custom + CRUD en memoria
│   ├── news-renderer.js        # Renderizado dinámico de cards y vista detalle
│   ├── favorites.js            # Toggle, guardar y renderizar favoritos
│   └── validations.js          # Validación de formularios (contacto y admin)
├── data/
│   ├── noticias.json           # Semilla de noticias (≥ 14 ítems, todas las categorías)
│   └── usuarios.json           # Semilla de usuarios (login y registro)
└── assets/
    └── img/                    # Imágenes de noticias y recursos gráficos
```

> ❌ No crear archivos fuera de esta estructura sin actualizarla aquí primero.

---

## 4. Esquema de Datos — `noticias.json`

Cada objeto del array debe respetar este esquema estrictamente:

```json
{
  "id": "string",
  "titulo": "string",
  "resumen": "string (máx. 200 caracteres)",
  "contenido": "string (texto completo, puede contener HTML básico)",
  "categoria": "Deportes | Finanzas | Educación | Tecnología | Política | Cultura | Salud",
  "imagen": "string (ruta relativa: /assets/img/nombre.webp)",
  "autor": "string",
  "fecha": "string (ISO 8601: YYYY-MM-DD)",
  "destacada": "boolean",
  "tiempoLectura": "number (minutos estimados de lectura)"
}
```

**Claves de `localStorage`:**

| Clave | Contenido |
|---|---|
| `favorites` | `string[]` — array de IDs de noticias marcadas como favoritas |
| `news_custom` | `object[]` — noticias creadas/editadas desde `admin.html` |
| `auth_session` | `{ loggedIn: boolean, user: string, rol: string }` — sesión activa |
| `users_custom` | `object[]` — usuarios registrados desde `login.html` |
| `deleted_news` | `string[]` — IDs de noticias del seed marcadas como eliminadas |

---

## 5. Convenciones de Código

### HTML
- Un único `<main>` por página con `id` descriptivo (`id="home-main"`, `id="detail-main"`, etc.).
- Todos los elementos interactivos deben tener `id` únicos y descriptivos.
- Navegaciones con `aria-label` (`aria-label="Sidebar principal"`, `aria-label="Navegación de header"`).
- Cada HTML incluye en `<head>`:
  ```html
  <link rel="stylesheet" href="/css/variables.css">
  <link rel="stylesheet" href="/css/layout.css">
  <link rel="stylesheet" href="/css/components.css">
  ```
- Cada HTML incluye antes de `</body>`:
  ```html
  <script src="/js/storage.js"></script>
  <script src="/js/app.js"></script>
  <script src="/js/[modulo-especifico-de-la-pagina].js"></script>
  ```

### CSS
- **Todas** las variables centralizadas en `variables.css`. Sin valores de color, fuente o espaciado hardcoded en otros archivos.
- Convención de clases: BEM simplificado — `.card`, `.card__title`, `.card--featured`.
- ❌ Prohibido `!important`.
- ❌ Prohibido `style=""` inline en HTML generado por JS (usar clases con `classList`).

### JavaScript
- ❌ Prohibido `var`. Usar `const` por defecto, `let` solo cuando la variable muta.
- ❌ Prohibido `innerHTML` con strings de usuario sin sanitizar (XSS). Usar `textContent` o `createElement`.
- ❌ Prohibido eventos `onclick=""` inline en HTML. Usar `addEventListener`.
- ❌ Prohibido callbacks anidados. Usar `async/await` con `try/catch`.
- Cada módulo JS expone su API mediante funciones nombradas exportadas o en el scope global (sin IIFE que oculte la API pública).
- Responsabilidad única por módulo: no duplicar lógica entre archivos.

---

## 6. Diseño Visual — Variables Canónicas

```css
/* /css/variables.css */
:root {
  /* Paleta principal */
  --color-primary:       #1a73e8;   /* Azul principal — botones, links activos */
  --color-primary-dark:  #0d47a1;   /* Hover, activo, focus */
  --color-primary-light: #e8f0fe;   /* Fondos sutiles, badges */
  --color-surface:       #ffffff;   /* Fondo de tarjetas y modales */
  --color-bg:            #f0f4f8;   /* Fondo general de la página */
  --color-border:        #dadce0;   /* Bordes de inputs y cards */
  --color-text:          #212121;   /* Texto principal */
  --color-text-muted:    #757575;   /* Texto secundario, fechas, metadatos */
  --color-danger:        #d93025;   /* Errores, eliminar */
  --color-success:       #1e8e3e;   /* Confirmaciones */

  /* Layout */
  --sidebar-width:       260px;
  --sidebar-collapsed:   0px;
  --header-height:       64px;
  --footer-height:       56px;

  /* Tipografía */
  --font-primary: 'Inter', 'Segoe UI', sans-serif;
  --font-size-xs:   0.75rem;
  --font-size-sm:   0.875rem;
  --font-size-base: 1rem;
  --font-size-lg:   1.125rem;
  --font-size-xl:   1.25rem;
  --font-size-2xl:  1.5rem;

  /* Espaciados */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;
  --space-2xl: 48px;

  /* Efectos */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  16px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
  --shadow-modal: 0 8px 24px rgba(0,0,0,0.18);
  --transition-base: 200ms ease;

  /* Z-index */
  --z-sidebar: 100;
  --z-header:  200;
  --z-modal:   300;
  --z-overlay: 290;
}
```

---

## 7. Comportamiento de Páginas

### `index.html` — Home
- Carga noticias via `news-service.js` (merge de `noticias.json` + `news_custom` en `localStorage`).
- Renderiza cards destacadas (`destacada: true`) en una sección hero.
- Filtro por categoría: botones/tabs, filtra sin recarga de página (`news-renderer.js`).
- Cada card enlaza a `detalle.html?id=...`.

### `detalle.html` — Vista Detalle
- Lee `?id=` de `URLSearchParams`.
- Carga la noticia via `news-service.js`. Si no existe, redirige a `index.html`.
- Muestra título, imagen, autor, fecha, categoría y contenido completo.
- Botón "Guardar en favoritos" que alterna estado via `favorites.js`.

### `favoritos.html` — Favoritos
- Lee IDs del array `favorites` en `localStorage`.
- Carga los datos completos de cada ID via `news-service.js`.
- Si no hay favoritos, muestra estado vacío con CTA a `index.html`.

### `contacto.html` — Contacto
- Formulario con campos: Nombre, Email, Asunto, Mensaje.
- Validación inline en tiempo real via `validations.js` (required, formato email, longitud mínima).
- Al enviar correctamente: muestra mensaje de éxito y limpia el formulario. No hay backend real.

### `login.html` — Login / Registro
- Dos tabs: **Iniciar Sesión** y **Registrarse**.
- **Login**: valida contra `data/usuarios.json` (seed) + `users_custom` en `localStorage`.
- **Registro**: persiste nuevos usuarios en `users_custom` en `localStorage`.
- Al autenticar: escribe `auth_session` en `localStorage` y redirige a `index.html`.
- Si ya hay sesión activa, redirige directamente a `index.html`.

### `admin.html` — Panel de Administración
- **Auth guard**: si `auth_session.loggedIn !== true`, redirige a `login.html`.
- **Listar** noticias (seed + custom) en tabla.
- **Crear** nueva noticia: formulario modal, validado via `validations.js`, persiste en `news_custom`.
- **Editar** noticia existente: abre modal precargado, actualiza en `news_custom`.
- **Eliminar** noticia: confirmación, elimina de `news_custom` (las del seed son solo ocultables).

---

## 8. Módulos JavaScript — Responsabilidades

### `storage.js`
```javascript
// API pública
getItem(key)                    // Parsea JSON de localStorage, retorna null si no existe
setItem(key, value)             // Serializa a JSON y guarda
removeItem(key)                 // Elimina la clave
appendToArray(key, item)        // Añade item a un array almacenado
removeFromArray(key, id)        // Elimina item por id de un array almacenado
```

### `news-service.js`
```javascript
getAllNews()                     // fetch noticias.json + merge news_custom → Promise<Article[]>
getNewsById(id)                  // Busca en el merge completo → Promise<Article|null>
getNewsByCategory(cat)           // Filtra por categoría → Promise<Article[]>
addNews(article)                 // Añade a news_custom en localStorage
updateNews(id, data)             // Actualiza en news_custom
deleteNews(id)                   // Elimina de news_custom (o marca deleted para el seed)
```

### `news-renderer.js`
```javascript
renderCards(articles, containerSelector)     // Inserta cards en el DOM
renderDetail(article, containerSelector)     // Inserta vista detalle en el DOM
renderEmptyState(message, containerSelector) // Estado vacío
```

### `favorites.js`
```javascript
toggleFavorite(id)                           // Añade/quita ID del array favorites
isFavorite(id)                               // Retorna boolean
renderFavorites(containerSelector)           // Carga IDs, obtiene datos, renderiza cards
```

### `validations.js`
```javascript
validateRequired(value)                      // Retorna { valid, message }
validateEmail(value)                         // Retorna { valid, message }
validateMinLength(value, min)                // Retorna { valid, message }
validateForm(formElement)                    // Valida todos los campos, retorna boolean
showFieldError(inputElement, message)        // Muestra error inline
clearFieldError(inputElement)               // Limpia error inline
```

### `app.js`
```javascript
// Se ejecuta en todas las páginas al cargarse el DOM
initSidebar()    // Toggle sidebar en mobile, estado persistido en localStorage
initAuthGuard()  // Protege admin.html (redirige si no hay sesión)
setActiveNav()   // Marca el link activo del sidebar según la URL actual
```

---

## 9. Reglas Estrictas para el Agente de IA

1. **No romper la estructura de directorios** definida en §3. Cualquier nuevo archivo debe ubicarse en la carpeta correspondiente.
2. **No usar frameworks JS** (React, Vue, Angular, Alpine, Svelte, htmx, etc.).
3. **No usar `var`**, `innerHTML` con input de usuario sin sanitizar, ni eventos `onclick=""` inline en HTML.
4. **No duplicar lógica** entre módulos. Si una función ya existe en un módulo, llamarla; no reescribirla.
5. **No hardcodear colores, fuentes o espaciados** fuera de `variables.css`.
6. **Toda nueva noticia** creada desde `admin.html` persiste en `localStorage` bajo la clave `news_custom`.
7. **El sidebar es colapsable** en mobile. El estado se guarda en `localStorage` bajo `sidebar_open`.
8. **El acceso a `admin.html`** siempre debe verificar `auth_session.loggedIn` al cargar la página.
9. **Cada HTML** debe incluir los 3 `<link>` CSS y los `<script>` de `storage.js` + `app.js` + el JS específico de la página.
10. **Responsive obligatorio**: el layout no debe romperse en 320px, 768px ni 1280px de ancho.
11. **Semántica HTML**: `<article>` para noticias, `<nav>` para navegaciones, `<form>` para formularios, `<button>` para acciones, `<a>` solo para navegación a URLs.
12. **No eliminar noticias del seed** (`noticias.json`). El CRUD de eliminación solo actúa sobre `news_custom` o marca la noticia del seed con un flag `deleted: true` en `localStorage`.

---

## 10. Criterios de Aceptación

- [ ] Las 6 páginas renderizan sin errores en consola del navegador.
- [ ] El filtro por categoría en `index.html` opera sin recarga de página.
- [ ] Agregar/quitar favoritos persiste correctamente al recargar el navegador.
- [ ] El CRUD en `admin.html` crea, edita y elimina noticias con persistencia en `localStorage`.
- [ ] El formulario de `contacto.html` valida todos los campos antes de permitir el envío.
- [ ] `admin.html` redirige a `login.html` si no hay sesión activa.
- [ ] El sidebar es colapsable en pantallas ≤ 768px.
- [ ] El diseño es visualmente correcto en 320px, 768px y 1280px (sin scroll horizontal, sin elementos rotos).
- [ ] Todas las variables CSS se consumen desde `variables.css`; ningún valor de color está hardcoded.
- [ ] Los módulos JS respetan la responsabilidad única definida en §8.

---

*Última actualización: Semana 5 — Entrega 2. Actualizar este documento si cambia el stack, la estructura o los criterios de aceptación.*

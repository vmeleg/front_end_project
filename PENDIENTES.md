# 📌 Funcionalidades Pendientes, Mejoras y Correcciones

Este documento detalla las funcionalidades planificadas para entregas posteriores, mejoras técnicas sugeridas y ajustes de UX/UI identificados durante la Entrega 2.

---

## 🚀 1. Funcionalidades Pendientes por Desarrollar

### 📄 Paginación y Carga Infinita
- [ ] Implementar paginación o scroll infinito ("Cargar más noticias") en `index.html` para manejar volúmenes altos de noticias de manera eficiente.
- [ ] Agregar selector de noticias por página (8, 12, 16 noticias) en el panel de administración.

### 🖼️ Carga Real de Imágenes (File Upload)
- [ ] Sustituir el campo de entrada de texto de URL de imagen en `admin.html` por un selector de archivos (`<input type="file">`) con vista previa local codificada en Base64 o mediante URLs temporales de Blob (`URL.createObjectURL`).

### 💬 Sección de Comentarios en Vista Detalle
- [ ] Implementar sistema de comentarios en `detalle.html` permitiendo a usuarios autenticados publicar y eliminar opiniones por noticia.
- [ ] Guardar los comentarios en `localStorage` bajo la clave `news_comments`.

### 🔍 Ordenamiento Avanzado y Filtros Combinados
- [ ] Añadir filtro secundario por fecha (más recientes / más antiguas) y por popularidad/lectura.
- [ ] Permitir combinación simultánea de filtro por categoría y búsqueda textual.

### 🌙 Modo Oscuro (Dark Mode Toggle)
- [ ] Agregar un interruptor de tema (Claro / Oscuro) en el header global.
- [ ] Definir el set de variables CSS oscuras en `variables.css` (`[data-theme="dark"]`).

---

## 🔒 2. Mejoras de Seguridad y Autenticación

- [ ] **Encriptación/Hash de Contraseñas**: Actualmente las contraseñas se validan en texto plano en `localStorage` y `usuarios.json`. Para producción se debe integrar Hashing (e.g. SHA-256 o bcrypt en backend).
- [ ] **Expiración de Sesión (JWT / Tokens)**: Implementar expiración automática de la clave `auth_session` tras un período de inactividad (e.g. 24 horas).
- [ ] **Sanitización Estricta de HTML**: Aunque el código actual utiliza `textContent` para prevenir XSS, en la renderización del campo `contenido` en `detalle.html` se soporta HTML básico; se sugiere integrar una librería como `DOMPurify` para contenido enriquecido.

---

## 🛠️ 3. Deuda Técnica y Correcciones Identificadas

- [ ] **Persistencia Completa en Backend**: Migrar el almacenamiento temporal de `localStorage` (`news_custom`, `favorites`, `auth_session`) hacia una API RESTful o GraphQL real con base de datos SQL/NoSQL.
- [ ] **Tests Automatizados (Unitarios y E2E)**:
  - Crear pruebas unitarias con Jest / Vitest para `validations.js`, `storage.js` y `news-service.js`.
  - Crear pruebas E2E con Playwright o Cypress para validar el flujo completo de Login -> CRUD Admin -> Detalle -> Favoritos.
- [ ] **Manejo Offline (Service Workers / PWA)**: Convertir la aplicación en PWA (Progressive Web App) añadiendo un `manifest.json` y Service Worker para almacenamiento en caché offline de artículos leídos.

---

## ♿ 4. Accesibilidad (a11y) y UX

- [ ] **Navegación por Teclado (Focus Trapping)**: Mejorar la gestión del foco al abrir y cerrar los modales en `admin.html`.
- [ ] **Soporte para Lectores de Pantalla**: Añadir atributos `aria-expanded` dinámicos en los botones del sidebar y tabs de categoría.
- [ ] **Mensajes Toast / Notificaciones**: Implementar notificaciones flotantes (Toasts) para confirmar acciones (ej. *"Noticia guardada en favoritos"*, *"Noticia eliminada correctamente"*).

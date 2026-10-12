# PoliPress — Single Page Application (SPA) en Angular

> **Portal Web de Noticias Interactivo**  
> Implementación moderna basada en la arquitectura Single Page Application (SPA) construida con **Angular 21** (`Standalone Components`, `Signals`, `RxJS` y `ReactiveFormsModule`), garantizando una experiencia de usuario fluida sin recargas de página, diseño responsive y persistencia local completa.

---

## 1. Tecnologías y Herramientas Utilizadas

El proyecto fue desarrollado utilizando el ecosistema oficial y más reciente de Angular, sin frameworks de CSS pesados ni librerías externas superfluas:

| Categoría | Tecnología / Herramienta | Versión / Detalle | Propósito |
|---|---|---|---|
| **Core Framework** | Angular (Standalone Components) | `^21.2.0` | Arquitectura desacoplada basada en componentes independientes sin `NgModule`. |
| **Lenguaje** | TypeScript | `~5.9.2` | Tipado estático estricto para modelos, interfaces y controladores. |
| **Programación Reactiva** | RxJS & Angular Signals | `~7.8.0` / Signals nativos | Manejo de flujos de datos asíncronos (`BehaviorSubject`, `Observable`, `combineLatest`) e interoperabilidad con Signals (`toSignal`, `toObservable`). |
| **Enrutamiento** | Angular Router | `@angular/router` | SPA pura, navegación con rutas hijas/parámetros (`/noticia/:id`, `?cat=...`), lazy redirects y guardas de seguridad. |
| **Formularios** | ReactiveFormsModule | `@angular/forms` | Formularios reactivos fuertemente tipados con validadores sincrónicos personalizados y control granular de errores inline. |
| **Cliente HTTP** | HttpClient (`provideHttpClient`) | `@angular/common/http` | Carga asíncrona de recursos locales y semillas JSON (`noticias.json`, `usuarios.json`). |
| **Estilos & Diseño** | CSS3 Nativo Puro | Variables CSS, Flexbox, Grid | Sistema de diseño institucional basado en tokens `:root`, convención BEM y paridad visual completa con el diseño de referencia. |
| **Persistencia** | Web Storage API (`localStorage`) | Nativo del navegador | Almacenamiento local persistente para usuarios, noticias personalizadas, favoritos y estados de UI. |
| **Tooling & Build** | Angular CLI / `@angular/build` | `^21.2.26` | Entorno de compilación ultra rápido basado en Vite / esbuild. |

---

## 2. Estructura del Proyecto

El código fuente sigue la práctica de modularidad por características y separación de responsabilidades:

```text
polipress-angular/
├── angular.json                      # Configuración de compilación, assets, estilos y dev-server
├── package.json                      # Dependencias, scripts de npm y versiones
├── tsconfig.json                     # Opciones de compilación TypeScript estricto
├── README.md                         # Documentación técnica completa
└── src/
    ├── index.html                    # Entrada HTML con metadatos y fuente Inter de Google Fonts
    ├── main.ts                       # Bootstrap de la aplicación con bootstrapApplication()
    ├── styles.css                    # Sistema de diseño global: variables :root, reset, layout y BEM
    ├── assets/
    │   ├── data/
    │   │   ├── noticias.json         # Semilla JSON inicial de noticias (15 artículos)
    │   │   └── usuarios.json         # Semilla JSON de usuarios (admin y demo)
    │   ├── icons/                    # Íconos SVG/vectoriales (logo, home, search, etc.)
    │   └── img/                      # Banco de imágenes locales de artículos (n01 a n15)
    └── app/
        ├── app.component.html        # Shell maestro: <app-header>, <app-sidebar>, <router-outlet>, <app-footer>
        ├── app.component.ts          # Controlador raíz con registro de componentes shell
        ├── app.config.ts             # Proveedores globales: provideRouter, provideHttpClient
        ├── app.routes.ts             # Tabla de rutas y asignación de AuthGuard
        ├── components/               # Componentes visuales reutilizables
        │   ├── header/               # Barra superior con buscador integrado, selector de categorías y sesión
        │   ├── sidebar/              # Menú lateral colapsable responsive con navegación principal
        │   ├── footer/               # Pie de página institucional y enlaces
        │   ├── news-card/            # Tarjeta de noticia con badge de categoría y acción de favorito
        │   ├── news-detail-modal/    # Modal interactivo superpuesto para lectura rápida de noticias
        │   └── news-detail-content/  # Renderizador semántico del cuerpo y metadatos de un artículo
        ├── pages/                    # Vistas asociadas a rutas principales
        │   ├── home/                 # Vista de inicio: listado, filtros, buscador y destacados
        │   ├── detail/               # Vista de página completa de una noticia (/noticia/:id)
        │   ├── favorites/            # Vista de noticias guardadas por el usuario (/favoritos)
        │   ├── contact/              # Formulario de contacto institucional validado (/contacto)
        │   ├── login/                # Autenticación dual (Login y Registro) (/login)
        │   └── admin/                # Panel de administración y Mini CRUD (/admin)
        ├── guards/
        │   └── auth.guard.ts         # Guardia funcional canActivate para proteger rutas privadas
        ├── models/
        │   ├── news.model.ts         # Interfaces de Noticia, Categoria y utilidades de badges
        │   └── user.model.ts         # Interfaces de Usuario, Rol y AuthSession
        ├── services/
        │   ├── news.service.ts       # Orquestador del ciclo de vida de noticias y Mini CRUD
        │   ├── auth.service.ts       # Gestión de autenticación, registro y sesiones de usuario
        │   ├── favorites.service.ts  # Control reactivo de favoritos asociados al usuario
        │   ├── layout.service.ts     # Manejo del estado visual reactivo (sidebar, buscador, modal)
        │   └── storage.service.ts    # Capa de abstracción segura para operaciones con localStorage
        ├── validators/
        │   └── form-validators.ts    # Validadores de formularios reactivos (email, required, teléfono)
        └── pipes/
            └── date-es.pipe.ts       # Transformación de fechas ISO a formato legible en español
```

---

## 3. Arquitectura de Componentes y Páginas

### 3.1. Componentes Globales (Shell)
- **`HeaderComponent` (`app-header`)**:
  - Integra el logotipo principal, enlace a inicio y barra de navegación por categorías horizontal.
  - Incluye un buscador expandible con campo de texto vinculado reactivamente a `LayoutService`.
  - Muestra el estado de la sesión actual (nombre del usuario autenticado o botón "Iniciar sesión") y acción de cierre de sesión.
- **`SidebarComponent` (`app-sidebar`)**:
  - Menú lateral deslizante optimizado para pantallas táctiles y móviles (breakpoint $\le 768\text{px}$).
  - Cierre automático al seleccionar una ruta mediante suscripción a `NavigationEnd`.
  - Enlaces directos a Inicio, Favoritos, Contacto y Panel Admin.
- **`FooterComponent` (`app-footer`)**:
  - Estructura semántica con derechos de autor, enlaces a categorías y branding del portal.
- **`NewsDetailModalComponent` (`app-news-detail-modal`)**:
  - Permite abrir cualquier noticia en un modal accesible sin abandonar la página actual.
  - Soporta cierre mediante clic en backdrop, botón de cierre o tecla `Escape` con bloqueo temporal del scroll del documento (`overflow: hidden`).

### 3.2. Componentes Reutilizables de Dominio
- **`NewsCardComponent` (`app-news-card`)**:
  - Recibe el input `noticia: InputSignal<Noticia>`.
  - Renderiza imagen de portada con fallback de error, badge coloreado según categoría, autor, tiempo de lectura y fecha formateada con `DateEsPipe`.
  - Contiene botón para agregar o remover de favoritos en un solo clic, delegando el evento a `FavoritesService`.
  - Al hacer clic en la tarjeta, abre el modal rápido mediante `LayoutService.openDetail()`.
- **`NewsDetailContentComponent` (`app-news-detail-content`)**:
  - Componente puramente presentacional reutilizado tanto dentro del modal emergente como en la página completa `/noticia/:id`.
  - Presenta encabezado semántico, autor, fecha, imagen expandida y cuerpo de texto enriquecido con párrafos.

### 3.3. Páginas (Vistas de Enrutador)
- **`HomeComponent` (`/`)**:
  - Combina query parameters (`?cat=...`) con el flujo del buscador con debounce de 300ms.
  - Renderiza la grilla de artículos según la categoría elegida ("Todas", "Tecnología", "Deportes", etc.) o los resultados de búsqueda en tiempo real.
- **`DetailComponent` (`/noticia/:id`)**:
  - Carga el ID desde la ruta activa (`ActivatedRoute.snapshot.paramMap`).
  - Consulta `NewsService.getNewsById(id)`. Si la noticia no existe, redirige automáticamente a inicio.
  - Actualiza dinámicamente el título de la pestaña del navegador con el servicio `Title`.
- **`FavoritesComponent` (`/favoritos`)**:
  - Reacciona a la sesión y a la lista de favoritos en tiempo real.
  - Maneja cuatro estados UI claramente diferenciados:
    1. *No autenticado*: Muestra invitación para iniciar sesión.
    2. *Vacío*: Indica que no hay noticias guardadas con botón hacia el catálogo.
    3. *No disponible*: Si los IDs guardados fueron eliminados del sistema.
    4. *Listado activo*: Grilla de tarjetas con las noticias favoritas.
- **`ContactComponent` (`/contacto`)**:
  - Protegido por `authGuard`. Requiere autenticación previa.
  - Formulario reactivo con campos: Nombre, Correo, Teléfono (formato colombiano opcional `+57 3xx`), Asunto y Mensaje.
  - Precarga automática del nombre y correo del usuario desde la sesión activa.
  - Validación en blur y al enviar con mensajes de error contextuales.
- **`LoginComponent` (`/login`)**:
  - Interfaz de dos pestañas: **Iniciar Sesión** y **Registrarse**.
  - Valida credenciales contra `usuarios.json` y cuentas creadas dinámicamente en `users_custom`.
  - Redirección inteligente: si el usuario intentaba ingresar a una ruta protegida (ej: `/admin`), es redirigido a ella inmediatamente tras autenticarse mediante el query param `?redirect=...`.
- **`AdminComponent` (`/admin`)**:
  - Protegido por `authGuard`. Si el usuario no tiene rol `admin` (ej: rol `user`), despliega un modal de acceso restringido impidiendo modificaciones.
  - **Mini CRUD completo de noticias**:
    - **Crear**: Formulario modal para titular, resumen, contenido, categoría, imagen, autor, fecha y checkbox destacada.
    - **Editar**: Carga previa de datos en el formulario modal para su actualización instantánea.
    - **Eliminar**: Modal de confirmación para evitar borrados accidentales.
    - Cálculo automático de tiempo de lectura (aprox. 200 palabras por minuto).

---

## 4. Servicios y Flujo de Datos

```text
┌─────────────────┐       ┌────────────────────┐       ┌──────────────────────┐
│  noticias.json  │──────▶│                    │◀─────▶│     localStorage     │
│  (Semilla HTTP) │       │    NewsService     │       │ (news_custom,        │
└─────────────────┘       │                    │       │  deleted_news)       │
                          └─────────┬──────────┘       └──────────────────────┘
                                    │
                                    ▼ Observable<Noticia[]>
                    ┌───────────────────────────────┐
                    │  Home / Detail / Admin / Favs │
                    └───────────────────────────────┘
```

1. **`StorageService`**:
   - Servicio inyectable que provee métodos seguros `getItem<T>()`, `setItem<T>()`, `removeItem()`, `appendToArray<T>()` y `removeFromArray<T>()`.
   - Previene excepciones por JSON malformado encapsulando lecturas en bloques `try/catch`.

2. **`NewsService`**:
   - Carga la semilla `assets/data/noticias.json` una sola vez mediante `HttpClient` con operador `shareReplay(1)`.
   - Fusiona reactivamente las noticias originales con las creadas en `news_custom`, excluyendo aquellas marcadas en `deleted_news`.
   - Emite cambios de inmediato a todos los suscriptores mediante un `BehaviorSubject` de refresco (`refresh$`).

3. **`AuthService`**:
   - Controla el inicio de sesión, registro y cierre de sesión.
   - Mantiene un observable `currentUser$` con la información de la sesión activa (`AuthSession`).
   - Valida permisos mediante `isLoggedIn()` y `hasAdminRole()`.

4. **`FavoritesService`**:
   - Almacena favoritos de forma segmentada por usuario bajo la clave `favorites_<correo>`.
   - Ofrece métodos síncronos y reactivos: `isFavorite(id)`, `toggleFavorite(id)`, `getFavoriteIds()` y `getFavoritesCount()`.
   - Si un usuario anónimo intenta guardar un favorito, lo redirige a `/login` preservando la URL de origen.

5. **`LayoutService`**:
   - Concentra el estado de la interfaz gráfica a través de Angular Signals: apertura/cierre del sidebar responsive, apertura del buscador superior, query de búsqueda y noticia actualmente abierta en el modal emergente.

---

## 5. Esquema de Persistencia (`localStorage`)

| Clave | Tipo / Interfaz | Descripción |
|---|---|---|
| `auth_session` | `{ loggedIn: boolean, user: string, email: string, rol: 'admin' \| 'user' }` | Datos de la sesión activa actual |
| `news_custom` | `Noticia[]` | Noticias creadas o editadas desde el panel de administración |
| `deleted_news` | `string[]` | Identificadores de noticias originales del seed marcadas como eliminadas |
| `favorites_<email>` | `string[]` | Lista de IDs de noticias favoritas asociadas a una cuenta específica |
| `users_custom` | `Usuario[]` | Cuentas registradas localmente desde el formulario de registro |
| `sidebar_open` | `boolean` | Estado persistido del menú lateral en navegación |

---

## 6. Guía de Instalación y Ejecución

### 6.1. Requisitos Previos del Sistema
- **Node.js**: Versión `v20.x` o `v22.x` recomendada (LTS).
- **NPM**: Versión `v10.x` o superior (incluido con Node.js).
- Navegador web moderno con soporte para ES2022 y CSS Grid (Chrome, Firefox, Edge, Safari).

Verifica tus versiones instaladas ejecutando:
```bash
node -v
npm -v
```

---

### 6.2. Instalación de Dependencias

Ingresa al directorio del proyecto e instala los paquetes necesarios:

```bash
cd polipress-angular
npm install
```

---

### 6.3. Ejecución en Entorno de Desarrollo

Inicia el servidor local de desarrollo de Angular:

```bash
npm start
```
> *Comando alternativo:* `npx ng serve`

Una vez finalizada la compilación, abre tu navegador en:
```text
http://localhost:4200/
```

El servidor cuenta con **Live Reload** habilitado: cualquier cambio guardado en archivos TypeScript, HTML o CSS actualizará automáticamente la vista en el navegador.

---

### 6.4. Compilación para Producción

Para generar el bundle optimizado y minificado listo para despliegue:

```bash
npm run build
```
> *Comando alternativo:* `npx ng build`

Los artefactos finales se compilarán en la carpeta:
```text
polipress-angular/dist/polipress-angular/browser/
```
Esta carpeta puede ser servida directamente por cualquier servidor estático web como Nginx, Apache, Vercel, Netlify o GitHub Pages.

---

### 6.5. Ejecución de Pruebas Unitarias

Para ejecutar el suite de pruebas unitarias configurado:

```bash
npm test
```

---

## 7. Cuentas de Prueba Preconfiguradas

Para validar los flujos de autenticación, control de accesos y el CRUD, se proporcionan las siguientes cuentas en la semilla inicial:

| Usuario | Correo Electrónico | Contraseña | Rol Asignado | Permisos y Comportamiento |
|---|---|---|---|---|
| **Administrador** | `admin@portal.com` | `admin123` | `admin` | Acceso total al panel `/admin`. Puede crear, editar y eliminar noticias. |
| **Usuario Estándar** | `demo@portal.com` | `demo123` | `user` | Acceso a `/contacto` y `/favoritos`. Al entrar a `/admin`, el sistema muestra el modal de *Acceso Restringido*. |

> **Nota:** Puedes crear nuevos usuarios en cualquier momento desde la pestaña **Registrarse** en `/login`. Todo nuevo registro recibe automáticamente el rol `user`.

---

## 8. Rutas de la Aplicación y Seguridad

| Ruta | Componente | Título de Página | Acceso / Guard | Descripción |
|---|---|---|---|---|
| `/` | `HomeComponent` | `PoliPress — Inicio` | Público | Portada de noticias, filtros por categoría y buscador |
| `/noticia/:id` | `DetailComponent` | Dinámico según noticia | Público | Lectura detallada individual de una noticia |
| `/favoritos` | `FavoritesComponent` | `PoliPress — Favoritos` | Público / Requiere Login para añadir | Panel con las noticias guardadas del usuario |
| `/contacto` | `ContactComponent` | `PoliPress — Contacto` | **Protegido** (`authGuard`) | Formulario de contacto con validación colombiana |
| `/login` | `LoginComponent` | `PoliPress — Iniciar Sesión` | Público (Redirige si ya hay sesión) | Pestañas de autenticación y nuevo registro |
| `/admin` | `AdminComponent` | `PoliPress — Administración` | **Protegido** (`authGuard`) | Mini CRUD completo con protección de rol `admin` |
| `/**` | — | — | Redirección automática | Redirige cualquier ruta inexistente a `/` |

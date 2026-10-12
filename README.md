# PoliPress — Portal Web de Noticias

> **Portal Web de Noticias Interactivo y Responsivo**  
> Proyecto académico y profesional desarrollado bajo el eslogan *"Conectando ideas, tendencias y actualidad."*

Este repositorio contiene dos implementaciones del sistema:
1. **`polipress-v1/`**: Prototipo inicial desarrollado con **Vanilla HTML5, CSS3 y JavaScript ES6+**.
2. **`polipress-angular/`**: Aplicación moderna **Single Page Application (SPA)** desarrollada con **Angular 21** (`Standalone Components`, `Signals`, `RxJS`, `ReactiveFormsModule`).

---

## 📁 Estructura General del Repositorio

El directorio raíz `front_end` está organizado de la siguiente manera:

```text
front_end/
├── README.md                 # Documentación general del repositorio (este archivo)
├── polipress-v1/             # Versión 1 — Prototipo Vanilla Web (Entrega 2)
│   ├── index.html            # Portada de noticias, filtros y búsqueda
│   ├── detalle.html          # Vista detallada de artículo
│   ├── favoritos.html        # Gestión de artículos guardados por el usuario
│   ├── contacto.html         # Formulario de contacto con validaciones
│   ├── login.html            # Autenticación (Login y Registro)
│   ├── admin.html            # Panel Mini CRUD de noticias (Protegido por sesión)
│   ├── css/                  # Estilos: variables.css, layout.css, components.css
│   ├── js/                   # Lógica modular: news-service, storage, validations, etc.
│   ├── data/                 # Semillas JSON (noticias.json, usuarios.json)
│   ├── assets/               # Recursos multimedia (imágenes e íconos)
│   ├── AGENTS.md             # Guía canónica de directrices de desarrollo
│   ├── FIXES.md              # Bitácora de ajustes de diseño y correcciones
│   └── PENDIENTES.md         # Hoja de ruta de mejoras
└── polipress-angular/        # Versión 2 — SPA en Angular 21 (Entrega 3)
    ├── README.md             # Documentación técnica exhaustiva de la versión Angular
    ├── package.json          # Dependencias y scripts npm
    ├── angular.json          # Configuración de compilación y assets
    ├── vercel.json           # Configuración de despliegue en Vercel
    └── src/
        ├── app/              # Componentes Standalone, servicios, guards, modelos
        ├── assets/           # Recursos estáticos locales
        └── styles.css        # Sistema de diseño global y variables :root
```

---

## 🚀 Proyectos Incluidos

### 1. `polipress-v1` (Vanilla JavaScript)
- **Tecnologías**: HTML5 Semántico, CSS3 Nativo (Grid, Flexbox, BEM, CSS Variables), Vanilla JS (ES6+ modular), `localStorage`.
- **Características**:
  - Navegación multipágina tradicional con componentes de layout persistentes.
  - Carga asíncrona de datos desde `data/noticias.json` y `data/usuarios.json`.
  - Filtro por categorías sin recarga de página y búsqueda en tiempo real.
  - Persistencia de sesión de usuario y favoritos particionados por usuario en `localStorage`.
  - Panel administrativo con Mini CRUD funcional para crear, editar y eliminar noticias.
- **Ejecución**:
  Puede abrirse directamente con cualquier servidor web estático (como la extensión Live Server de VS Code) apuntando a la carpeta `polipress-v1/`.

### 2. `polipress-angular` (Single Page Application - SPA)
- **Tecnologías**: Angular 21, TypeScript, RxJS, Angular Signals, ReactiveFormsModule, HttpClient (`provideHttpClient`), CSS3 puro.
- **Características**:
  - Arquitectura SPA completa con enrutador dinámico (`@angular/router`) y transiciones sin recargas.
  - Componentes Standalone desacoplados (`NewsCardComponent`, `NewsDetailModalComponent`, `HeaderComponent`, etc.).
  - Guardas funcionales de autenticación (`authGuard`) para rutas `/admin` y `/contacto`.
  - Soporte para modal emergente interactivo de lectura rápida con tecla `Esc` y control de scroll.
  - Validación de números telefónicos de Colombia (`+57`) y correos electrónicos con mensajes de error contextuales.
- **Ejecución**:
  ```bash
  cd polipress-angular
  npm install
  npm start
  ```
  Acceso en el navegador: `http://localhost:4200/`

---

## 🔑 Cuentas de Acceso Preconfiguradas

Ambas implementaciones comparten las mismas credenciales de prueba:

| Rol | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|
| **Administrador** | `admin@portal.com` | `admin123` | Acceso total al panel administrativo `/admin` (Crear, editar y eliminar noticias). |
| **Usuario Estándar** | `demo@portal.com` | `demo123` | Acceso a `/contacto` y `/favoritos`. En `/admin` muestra advertencia de acceso restringido. |

---

## 🌐 Despliegue en Vercel

Para desplegar la aplicación SPA en **Vercel**:
1. Conecta el repositorio a Vercel.
2. En la configuración de tu proyecto (**Settings** > **General**), establece:
   - **Root Directory**: `polipress-angular`
   - **Framework Preset**: `Angular`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/polipress-angular/browser`
3. El archivo `polipress-angular/vercel.json` se encargará de gestionar las rutas SPA para evitar errores 404.

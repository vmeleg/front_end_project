# PoliPress — Portal Web de Noticias (Entrega 2 - Prototipo Funcional)

**PoliPress** es un portal web de noticias multipágina interactivo, responsivo y modular, desarrollado bajo el eslogan *"Conectando ideas, tendencias y actualidad."* para la **Entrega 2 (Semana 5)**. 

El sistema permite explorar noticias de actualidad nacional e internacional, buscar por palabras clave sin interferencias visuales, filtrar por categorías temáticas, consultar artículos detallados, gestionar noticias favoritas segmentadas por usuario con verificación de sesión, validar formularios de contacto con estándar telefónico de Colombia (+57) y administrar el contenido mediante un panel CRUD protegido por autenticación.

---

## 📋 Tabla de Contenidos

1. [Identidad y Marca](#-identidad-y-marca)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Componentes y Arquitectura](#-componentes-y-arquitectura)
5. [Flujo de Datos y Persistencia](#-flujo-de-datos-y-persistencia)
6. [Funcionalidades por Página](#-funcionalidades-por-página)
7. [Validaciones y Reglas de Negocio](#-validaciones-y-reglas-de-negocio)
8. [Instalación y Ejecución](#-instalación-y-ejecución)
9. [Credenciales de Prueba](#-credenciales-de-prueba)
10. [Sistema de Diseño (CSS)](#-sistema-de-diseño-css)

---

## 🏷️ Identidad y Marca

- **Nombre Oficial**: PoliPress
- **Eslogan**: *"Conectando ideas, tendencias y actualidad."*
- **Sede y Dirección de Contacto**: Calle 57 # 13-40, Bogotá D.C., Colombia.
- **Líneas de Atención**: (+57) 601 744 0000 | (+57) 300 123 4567
- **Recursos Gráficos**:
  - **Logo & Favicon**: `assets/icons/logo.jpg`
  - **Icono de Inicio**: `assets/icons/home.jpg`
  - **Icono de Búsqueda**: `assets/icons/search.jpg`
  - **Fotografías y Portadas**: 15 artículos de noticias actuales (`assets/img/n01.jpg` a `n15.jpg`).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico**: Empleo riguroso de elementos estructurales (`<header>`, `<nav>`, `<aside>`, `<main>`, `<article>`, `<footer>`, `<figure>`).
- **CSS3 Nativo**: Grid Layout, Flexbox y Variables CSS centralizadas en tokens. Diseño responsive-first sin dependencias externas (sin Bootstrap, Tailwind o librerías ajenas).
- **Vanilla JavaScript (ES6+)**: Arquitectura modular con funciones puras, async/await, manipulación eficiente del DOM y manejo robusto de eventos.
- **Almacenamiento Local (`localStorage`)**: Persistencia de sesiones de usuario, noticias dinámicas del CRUD, noticias eliminadas del seed y listas de favoritos particionadas por usuario.
- **Fetch API & Datos Semilla**: Carga asíncrona de fuentes de datos estáticas en formato JSON (`data/noticias.json` y `data/usuarios.json`).

---

## 📁 Estructura del Proyecto

```text
front_end/
├── index.html              # Home: Hero de destacadas, buscador interactivo y filtros por categoría
├── detalle.html            # Vista detallada de noticia (?id=...) con gestión de favoritos
├── favoritos.html          # Vista de noticias guardadas para el usuario autenticado
├── contacto.html           # Formulario de contacto con validaciones inline en tiempo real
├── login.html              # Autenticación: Iniciar Sesión y Registro con control de sesión
├── admin.html              # Panel de administración CRUD de noticias (Protegido por Auth Guard)
├── AGENTS.md               # Guía canónica de directrices de desarrollo y reglas del proyecto
├── FIXES.md                # Bitácora de correcciones, ajustes y especificaciones de diseño
├── PENDIENTES.md           # Hoja de ruta de funcionalidades futuras y mejoras
├── README.md               # Documentación general del proyecto (este archivo)
├── css/
│   ├── variables.css       # Tokens de diseño: paleta PoliPress, tipografía, espaciados y z-index
│   ├── layout.css          # Estructura del layout global, header unificado, sidebar y footer
│   └── components.css      # Componentes UI: tarjetas, botones, badges, modales y formularios
├── js/
│   ├── storage.js          # Helper centralizado para get/set/remove en localStorage
│   ├── news-service.js     # Servicio de datos (Fetch JSON + merge con noticias creadas/editadas)
│   ├── news-renderer.js    # Motor de renderizado dinámico en el DOM
│   ├── favorites.js        # Gestión de favoritos particionada por usuario con validación de login
│   ├── validations.js      # Motor de validación de formularios (contacto y admin)
│   └── app.js              # Inicialización global (sidebar toggle, header auth, guardián de ruta)
├── data/
│   ├── noticias.json       # Semilla estática con 15 noticias de actualidad nacional e internacional
│   └── usuarios.json       # Semilla estática de usuarios y credenciales iniciales
└── assets/
    ├── icons/              # Iconografía corporativa (logo.jpg, home.jpg, search.jpg)
    └── img/                # Fotografías de noticias (n01.jpg a n15.jpg, ntest.jpg)
```

---

## 🧩 Componentes y Arquitectura

El proyecto adopta un patrón **Layered Vanilla Architecture**, garantizando separación de responsabilidades y modularidad limpia:

1. **Capa de Persistencia (`storage.js`)**: Abstracción para interactuar con `localStorage`, parseo de JSON seguro y manejo de colecciones en memoria.
2. **Capa de Servicios (`news-service.js`)**: Encargada de:
   - Cargar la semilla estática de noticias vía `fetch('/data/noticias.json')`.
   - Excluir artículos eliminados registrados en `deleted_news`.
   - Fusionar las noticias personalizadas o editadas (`news_custom`).
   - Servir filtros de búsqueda, categorías y noticias destacadas.
3. **Capa de Favoritos (`favorites.js`)**:
   - Requiere autenticación previa: si un visitante anónimo intenta guardar un artículo, solicita iniciar sesión redirigiéndolo a `login.html`.
   - Persistencia segregada por usuario: almacena favoritos bajo la clave `favorites_<userEmail>` para evitar colisiones entre cuentas.
4. **Capa de Presentación (`news-renderer.js`)**:
   - Renderiza tarjetas dinámicas de noticias con imagen, badges de categoría, fechas formateadas y tiempo de lectura.
   - Renderiza la vista detalle y estados vacíos con llamados a la acción (CTA).
5. **Capa de Validaciones (`validations.js`)**:
   - Valida campos obligatorios, correos electrónicos con regex estándar y números telefónicos según el formato de Colombia (+57 o celular de 10 dígitos).
6. **Capa Global y Navegación (`app.js`)**:
   - Coordina el sidebar colapsable (persiste estado en `sidebar_open`).
   - Sincroniza el header según el estado de la sesión activa (`auth_session`).
   - Aplica el **Auth Guard** para restringir el acceso a `admin.html`.

---

## 🔄 Flujo de Datos y Persistencia

```mermaid
flowchart TD
    A[Navegador / Cliente] -->|Fetch HTTP GET| B[data/noticias.json]
    A -->|Fetch HTTP GET| C[data/usuarios.json]
    A <-->|Lectura / Escritura| D[(localStorage)]
    
    subgraph Claves de Persistencia Local
        D1[auth_session]
        D2[favorites_usuario@correo.com]
        D3[news_custom]
        D4[deleted_news]
        D5[users_custom]
        D6[sidebar_open]
    end
```

### Reglas de Integración de Noticias:
- Las noticias del archivo `noticias.json` actúan como datos base de lectura.
- Las noticias creadas o editadas desde `admin.html` se guardan en `localStorage` (`news_custom`).
- Las noticias del seed que sean eliminadas no modifican el JSON original; se registran en `deleted_news` para ser filtradas en tiempo de ejecución.

---

## ⚙️ Funcionalidades por Página

### 1. Inicio (`index.html`)
- **Header Global Estandarizado**: Logo corporativo, nombre del portal PoliPress, eslogan y controles de sesión/perfil limpios.
- **Sección Hero**: Destaca la noticia principal marcada como destacada.
- **Buscador Interactivo**: Búsqueda por coincidencia de texto en título en tiempo real con z-index configurado para evitar superposiciones.
- **Filtros por Categoría**: Botones de filtrado rápido (*Todas, Deportes, Finanzas, Educación, Tecnología, Política, Cultura, Salud*) sin recarga de página.

### 2. Detalle de Noticia (`detalle.html`)
- Lectura dinámica del parámetro de URL `?id=...`.
- Presentación de encabezado, imagen destacada, autor, fecha, tiempo de lectura y contenido completo.
- Botón interactivo para alternar estado de favorito con comprobación de sesión.

### 3. Favoritos (`favoritos.html`)
- Carga exclusivamente los artículos guardados por el usuario en sesión.
- Mensaje amigable de estado vacío en caso de no contar con elementos guardados.
- Retiro inmediato de favoritos con actualización visual en tiempo real.

### 4. Contacto (`contacto.html`)
- Formulario con campos de Nombre, Email, Teléfono (opcional con validación Colombia +57), Asunto y Mensaje.
- Mensajes de validación y alerta inline con estados de error y confirmación.
- Datos de contacto institucional actualizados con ubicación en Bogotá, Colombia.

### 5. Acceso y Registro (`login.html`)
- Pestañas conmutables de **Iniciar Sesión** y **Registrarse**.
- Validación de credenciales contra `data/usuarios.json` y cuentas registradas en `users_custom`.
- Creación de sesión activa (`auth_session`) y redirección a `index.html`.

### 6. Panel de Administración (`admin.html`)
- **Control de Acceso (Auth Guard)**: Bloquea accesos anónimos y redirige a `login.html`.
- **Mini CRUD de Noticias**:
  - **Crear**: Modal interactivo con validación de campos, selección de categoría y persistencia en `news_custom`.
  - **Editar**: Modal con datos precargados para actualizar contenido o estado destacado.
  - **Eliminar**: Confirmación de eliminación con exclusión inmediata de la tabla y del portal.

---

## 📝 Validaciones y Reglas de Negocio

- **Autenticación en Favoritos**: Los visitantes no autenticados no pueden guardar noticias; son guiados a iniciar sesión.
- **Teléfono Colombia**: En el formulario de contacto, el teléfono es opcional. Si se diligencia, debe coincidir con formatos válidos de Colombia:
  - Formato internacional: `+57 300 123 4567` o `+573001234567`.
  - Formato nacional móvil: `3001234567` (10 dígitos iniciando por 3).
- **Control de Acceso Admin**: Solo usuarios autenticados con rol autorizado pueden gestionar contenidos en `admin.html`.

---

## 🚀 Instalación y Ejecución

Debido a que el navegador restringe peticiones `fetch()` a través del protocolo `file://` (CORS), el proyecto debe levantarse en un servidor HTTP local:

### Opción 1: Python (Recomendada)
En la raíz del proyecto (`front_end`):
```bash
python3 -m http.server 8000
```
Ingresa desde el navegador a: [http://localhost:8000](http://localhost:8000)

### Opción 2: Node.js (`npx`)
```bash
npx serve .
```

### Opción 3: Extensión Live Server
Abre la carpeta en VS Code / Cursor, haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

---

## 🔑 Credenciales de Prueba

| Perfil | Correo Electrónico | Contraseña | Rol |
|---|---|---|---|
| **Administrador** | `admin@portal.com` | `admin123` | Administrador |
| **Usuario Demo** | `demo@portal.com` | `demo123` | Lector |

*También es posible crear usuarios adicionales desde la pestaña "Registrarse" en `login.html`.*

---

## 🎨 Sistema de Diseño (CSS)

El sistema visual utiliza una paleta blanco/azul con variables centralizadas en [`css/variables.css`](file:///Users/vmeleg/front_end/css/variables.css):

```css
:root {
  /* Paleta Corporativa PoliPress */
  --color-primary:       #1a73e8;   /* Azul institucional */
  --color-primary-dark:  #0d47a1;   /* Hover, estados activos y focus */
  --color-primary-light: #e8f0fe;   /* Fondos suaves y badges */
  --color-surface:       #ffffff;   /* Fondo de tarjetas y modales */
  --color-bg:            #f0f4f8;   /* Fondo general */
  --color-border:        #dadce0;   /* Bordes de inputs y cards */
  --color-text:          #212121;   /* Tipografía principal */
  --color-text-muted:    #757575;   /* Fechas y metadatos */

  /* Dimensiones del Layout */
  --header-height:       100px;     /* Altura optimizada para logo y eslogan */
  --sidebar-width:       260px;     /* Ancho de barra lateral en escritorio */
  --content-max-width:   1280px;    /* Ancho máximo de contenido */
}
```

---

*Proyecto desarrollado para la Entrega 2 de Frontend.*

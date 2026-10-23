# Portal CIE-BOH — Centro de Investigación Escolar

Sitio web **informativo** del Centro de Investigación Escolar de la IE Barrio Olaya Herrera, construido con **HTML, CSS y JavaScript nativos** (sin frameworks, sin dependencias y sin paso de compilación), a partir del diseño de Stitch (`../stitch_portal_centro_de_investigaci_n_escolar`).

El sitio no tiene formularios, no usa cookies ni `localStorage` y no recopila datos de los visitantes.

## Despliegue en GitHub Pages

1. Crea un repositorio y sube **el contenido de esta carpeta** a la raíz de la rama `main`. Todas las rutas son relativas, así que funciona tanto en `usuario.github.io` como en `usuario.github.io/repositorio/`.
2. En el repositorio ve a **Settings → Pages**, elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
3. Activa **Enforce HTTPS** en la misma pantalla.
4. Cuando esté publicado, revisa el rendimiento en <https://pagespeed.web.dev/>.

`.nojekyll` evita que GitHub procese el sitio con Jekyll, y `404.html` se muestra automáticamente para las rutas que no existen.

## Ver en local

Los módulos ES no cargan con `file://`, así que hay que servir la carpeta por HTTP:

```powershell
powershell -ExecutionPolicy Bypass -File server.ps1 -Port 8080
```

Luego abre <http://localhost:8080>. `server.ps1` es **solo para desarrollo**: escucha únicamente en localhost y se comporta como GitHub Pages (sirve `404.html` para las rutas inexistentes). No hace falta subirlo al repositorio.

## Estructura

```
portal-cie/
├── index.html                 Página principal (sin scripts ni estilos inline)
├── 404.html                   Página de error para GitHub Pages
├── .nojekyll · robots.txt
├── server.ps1                 Servidor local de desarrollo (opcional)
├── assets/img/                Logo y favicon (SVG)
├── assets/docs/               (crear) Formatos descargables del repositorio EDS
├── css/                       tokens · base · layout · components · sections
└── js/
    ├── main.js                Raíz de composición e inyección de dependencias
    ├── config/app.config.js   Configuración central (congelada)
    ├── data/                  Contenido editable: semilleros y documentos
    ├── core/                  dom (fábrica segura de elementos), safe-url
    ├── services/notifier.js   Avisos tipo toast
    └── components/            navigation, scroll-spy, modal, semilleros,
                               documents, external-links
```

## Seguridad en GitHub Pages

GitHub Pages **no permite configurar cabeceras HTTP**, así que los controles se aplicaron dentro de la propia página:

| Control | Implementación |
|---|---|
| CSP estricta con `default-src 'none'`: solo scripts propios, solo Google Fonts como origen externo, sin `fetch`/XHR (`connect-src 'none'`) ni envío de formularios (`form-action 'none'`) | `<meta>` en `index.html` y `404.html` |
| **Trusted Types** (`require-trusted-types-for 'script'`): el navegador bloquea `innerHTML` y sumideros similares | `<meta>` CSP |
| Sin `innerHTML`: el contenido dinámico se crea con `createElement` y `textContent`; los atributos `on*`/`style` están prohibidos | `js/core/dom.js` |
| Anti-clickjacking: la página se oculta si se carga dentro de un iframe (`frame-ancestors` no funciona en `<meta>`) | `js/main.js` |
| HTTPS obligatorio + HSTS: el dominio `github.io` ya está en la lista de precarga HSTS de los navegadores | Settings → Pages |
| `Referrer-Policy: strict-origin-when-cross-origin` | `<meta>` |
| Lista blanca de dominios externos (solo `https`) y de rutas de descarga (`assets/docs/`) | `safe-url.js`, `app.config.js` |
| `rel="noopener noreferrer"` en todos los enlaces externos | HTML y `external-links.js` |
| `base-uri 'none'` y `object-src 'none'` | CSP |
| No hay datos de usuario, cookies ni almacenamiento local que proteger | — |

**Limitaciones de GitHub Pages:** las cabeceras `X-Content-Type-Options`, `Permissions-Policy` y `X-Frame-Options` no se pueden configurar. Si más adelante se necesitan, publica el sitio detrás de Cloudflare (Transform Rules) o en Netlify o Cloudflare Pages, que permiten un archivo `_headers`.

**Privacidad:** las fuentes se cargan desde Google Fonts, lo que expone la IP del visitante a Google. Para evitarlo, descarga los `.woff2`, guárdalos en `assets/fonts/` y cambia la CSP a `font-src 'self'` y `style-src 'self'`.

## Rendimiento

Optimizaciones aplicadas:
- **Íconos en subconjunto:** Google Fonts entrega solo los 75 glifos usados (`icon_names=`) y no la fuente completa de Material Symbols, que pesa varios cientos de KB.
- **Solo los pesos tipográficos usados:** Hanken Grotesk 600–800 + 800 cursiva, Public Sans 400–700 y JetBrains Mono 500–700.
- **`modulepreload`** para todos los módulos: se descargan en paralelo, sin cascada de imports.
- CSS propio (~40 KB sin comprimir) en lugar del CDN de Tailwind que usaba Stitch (un compilador en JavaScript que genera los estilos en cada visita).
- IntersectionObserver para el resaltado del menú (no se escucha el evento `scroll`).
- SVG con `width`/`height` declarados → **CLS = 0**.
- `preconnect` a Google Fonts y `display=swap` para el texto.

Medición en local (servidor de desarrollo, sin compresión): 22 peticiones, ~110 KB transferidos sin contar las fuentes, `DOMContentLoaded` en ~220 ms, `load` en ~370 ms, CLS 0. GitHub Pages añade gzip/brotli y CDN, así que en producción el peso real será menor. Los tiempos de pintado (FCP/LCP) no se pudieron medir en el navegador integrado; mídelos con PageSpeed Insights después de publicar.

## Patrones de diseño y principios SOLID

- **Factory** (`h()` en `dom.js`): una sola forma, y segura, de crear nodos.
- **Composition Root / Inyección de dependencias** (`main.js`): solo aquí se crean las clases concretas.
- **Data-driven rendering**: semilleros y documentos se generan desde `js/data`; agregar uno no requiere tocar componentes (principio Abierto/Cerrado).
- **S**: cada módulo tiene una sola responsabilidad (navegar, resaltar sección, mostrar modal, renderizar, notificar).
- **I / D**: los componentes reciben dependencias mínimas (por ejemplo, `{ show }` del notificador, o el `Modal`) en lugar de crearlas.

## Tareas pendientes

1. **Documentos:** coloca los archivos en `assets/docs/` y pon su ruta en `href` dentro de `js/data/documentos.data.js` (por ejemplo, `assets/docs/guia-preguntas.pdf`).
2. **Enlaces por confirmar:** agrega las URL de Master2000 y del Manual de Convivencia en `app.config.js`, y sus dominios a `allowedHosts`.
3. **Contenido:** valida con la institución las cifras, los horarios y los datos de contacto.

/**
 * Raíz de composición (Composition Root).
 *
 * 1. Carga en paralelo todos los JSON de /content.
 * 2. Pinta cada sección con su renderizador (registro de abajo).
 * 3. Activa la interactividad (menú, scroll-spy).
 *
 * Para agregar una sección nueva: crea content/<nombre>.json, un renderizador en
 * js/sections/<nombre>.js, un contenedor <section data-section="<nombre>"> en index.html
 * y una entrada en SECTIONS. No hay que modificar nada más (principio Abierto/Cerrado).
 */
import { APP_CONFIG } from './config/app.config.js';
import { h, qs, qsa } from './core/dom.js';
import { ContentRepository } from './services/content.repository.js';
import { ToastNotifier } from './services/notifier.js';
import { createLinkFactory } from './ui/kit.js';
import { MobileNavigation } from './components/navigation.js';
import { ScrollSpy } from './components/scroll-spy.js';
import { Modal } from './components/modal.js';
import { renderAnchorHub, renderHeader } from './sections/header.js';
import { renderHero } from './sections/hero.js';
import { renderGeneralidades } from './sections/generalidades.js';
import { renderEds } from './sections/eds.js';
import { renderLineas } from './sections/lineas.js';
import { renderConvergencia } from './sections/convergencia.js';
import { renderSemilleros } from './sections/semilleros.js';
import { renderRepositorio } from './sections/repositorio.js';
import { renderEncuentro } from './sections/encuentro.js';
import { renderFooter } from './sections/footer.js';

/** Registro de secciones: nombre del JSON (= data-section en el HTML) → renderizador. */
const SECTIONS = Object.freeze([
  { name: 'hero', render: renderHero },
  { name: 'generalidades', render: renderGeneralidades },
  { name: 'eds', render: renderEds },
  { name: 'lineas', render: renderLineas },
  { name: 'convergencia', render: renderConvergencia },
  { name: 'semilleros', render: renderSemilleros },
  { name: 'repositorio', render: renderRepositorio },
  { name: 'encuentro', render: renderEncuentro },
  { name: 'footer', render: renderFooter },
]);

/** Textos mínimos de respaldo por si site.json no se puede cargar. */
const FALLBACK_UI = Object.freeze({
  menuOpen: 'Abrir menú',
  menuClose: 'Cerrar menú',
  close: 'Cerrar',
  closeNotification: 'Cerrar notificación',
  notifications: 'Notificaciones',
  newTab: '(se abre en una pestaña nueva)',
  linkPending: '(enlace por confirmar)',
  sectionError: 'No se pudo cargar esta sección.',
});

function renderError(message) {
  return h('div', { className: 'container' }, [h('p', { className: 'section-error', attrs: { role: 'alert' }, text: message })]);
}

/** Aplica las etiquetas generales a los elementos estáticos del HTML. */
function applyStaticLabels(site, ui) {
  if (site.meta?.title) document.title = site.meta.title;
  const skip = qs('[data-label="skipLink"]');
  if (skip && ui.skipLink) skip.textContent = ui.skipLink;
  qs('[data-modal-close]')?.setAttribute('aria-label', ui.close);
  qs('[data-toast-region]')?.setAttribute('aria-label', ui.notifications);
  qs('[data-region="anchor-hub"]')?.setAttribute('aria-label', site.anchorHub?.label ?? '');
}

async function bootstrap() {
  const config = APP_CONFIG;
  const repository = new ContentRepository(config.content.baseUrl, config.content);
  const results = await repository.loadAll(['site', ...SECTIONS.map((s) => s.name)]);

  const siteResult = results.get('site');
  const site = siteResult.ok ? siteResult.data : {};
  if (!siteResult.ok) console.error('[CIE] site.json', siteResult.error);
  const ui = { ...FALLBACK_UI, ...(site.ui ?? {}) };

  // --- Servicios compartidos que reciben los renderizadores (inyección de dependencias) ---
  const ctx = Object.freeze({
    ui,
    link: createLinkFactory(config.links, ui),
    notifier: new ToastNotifier(qs('[data-toast-region]'), { durationMs: config.toast.durationMs, closeLabel: ui.closeNotification }),
    modal: new Modal({
      dialog: qs('[data-modal]'),
      title: qs('[data-modal-title]'),
      body: qs('[data-modal-body]'),
      closeButton: qs('[data-modal-close]'),
    }).init(),
  });

  applyStaticLabels(site, ui);

  // --- Encabezado y menú ---
  let navLinks = [];
  if (siteResult.ok) {
    const header = renderHeader(site, ctx);
    qs('[data-region="header"]').replaceChildren(...header.nodes);
    qs('[data-region="anchor-hub"]').replaceChildren(...renderAnchorHub(site, ctx));
    new MobileNavigation(header.refs, window.matchMedia(config.desktopNavQuery), ui).init();
    navLinks = header.refs.links;
  }

  // --- Secciones: cada una se pinta de forma aislada; si un JSON falla, las demás siguen ---
  SECTIONS.forEach(({ name, render }) => {
    const mount = qs(`[data-section="${name}"]`);
    if (!mount) return;
    const result = results.get(name);
    try {
      if (!result.ok) throw result.error;
      mount.append(...render(result.data, ctx));
    } catch (error) {
      console.error(`[CIE] Sección "${name}"`, error);
      mount.append(renderError(ui.sectionError));
    }
  });

  new ScrollSpy(qsa('[data-spy-section]'), navLinks, config.scrollSpy).init();
  document.documentElement.classList.remove('is-loading');

  // Si se llegó con un ancla (#eds-flujo), desplaza ahora que el contenido existe.
  const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
  target?.scrollIntoView();
}

/**
 * Anti-clickjacking: GitHub Pages no permite enviar X-Frame-Options ni CSP frame-ancestors
 * (no funciona en <meta>), así que si el portal se carga dentro de un iframe ajeno se oculta.
 */
function isFramed() {
  try {
    return window.top !== window.self;
  } catch {
    return true;
  }
}

if (isFramed()) {
  document.documentElement.hidden = true;
} else {
  bootstrap().catch((error) => {
    console.error('[CIE] Error al iniciar', error);
    document.documentElement.classList.remove('is-loading');
  });
}

/**
 * Raíz de composición (Composition Root).
 * Aquí, y solo aquí, se crean las dependencias concretas y se inyectan en los componentes.
 */
import { APP_CONFIG } from './config/app.config.js';
import { DOCUMENTOS } from './data/documentos.data.js';
import { SEMILLEROS } from './data/semilleros.data.js';
import { h, qs, qsa } from './core/dom.js';
import { ToastNotifier } from './services/notifier.js';
import { MobileNavigation } from './components/navigation.js';
import { ScrollSpy } from './components/scroll-spy.js';
import { Modal } from './components/modal.js';
import { SemillerosSection } from './components/semilleros.js';
import { DocumentsSection } from './components/documents.js';
import { renderExternalLinks } from './components/external-links.js';

function bootstrap() {
  const config = APP_CONFIG;

  // --- Servicios compartidos ---
  const notifier = new ToastNotifier(qs('[data-toast-region]'), config.toast);
  const modal = new Modal({
    dialog: qs('[data-modal]'),
    title: qs('[data-modal-title]'),
    body: qs('[data-modal-body]'),
    closeButton: qs('[data-modal-close]'),
  }).init();

  // --- Navegación ---
  new MobileNavigation(
    {
      toggle: qs('[data-nav-toggle]'),
      nav: qs('[data-nav]'),
      icon: qs('[data-nav-toggle-icon]'),
      label: qs('[data-nav-toggle-label]'),
    },
    window.matchMedia('(min-width: 1280px)'),
  ).init();

  new ScrollSpy(qsa('[data-spy-section]'), qsa('[data-spy-link]'), config.scrollSpy).init();

  // --- Contenido dinámico ---
  new SemillerosSection(
    { list: qs('[data-semilleros-list]'), summaryButton: qs('[data-open-cupos]') },
    SEMILLEROS,
    modal,
  ).init();

  const semillerosMetric = qs('[data-metric="semilleros"]');
  if (semillerosMetric) semillerosMetric.textContent = String(SEMILLEROS.length);

  new DocumentsSection(
    qs('[data-documents-list]'),
    DOCUMENTOS,
    { allowedPathPrefix: config.documents.allowedPathPrefix, contactEmail: config.contact.email },
    notifier,
  ).init();

  renderExternalLinks(qs('[data-external-links]'), config.externalLinks);

  // --- Política de privacidad ---
  qs('[data-open-privacy]')?.addEventListener('click', (event) => {
    event.preventDefault();
    modal.open({
      title: 'Política de Privacidad',
      content: [
        h('p', {
          text: 'Este portal es exclusivamente informativo: no tiene formularios, no usa cookies y no recopila ni almacena datos personales de sus visitantes.',
        }),
        h('p', {
          className: 'modal__note',
          text: `Para consultas sobre el tratamiento de datos personales (Ley 1581 de 2012) escribe a ${config.contact.email}.`,
        }),
      ],
    });
  });

  // --- Año dinámico en el pie ---
  const year = qs('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
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
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

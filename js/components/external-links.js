import { h, icon } from '../core/dom.js';
import { isAllowedExternalUrl } from '../core/safe-url.js';

/**
 * Enlaces externos del pie de página.
 * Solo se convierten en <a> las URL https de dominios en lista blanca, siempre con
 * rel="noopener noreferrer" (evita tabnabbing y fuga de Referer).
 */
export function renderExternalLinks(list, { items, allowedHosts }) {
  if (!list) return;
  list.replaceChildren(
    ...items.map(({ label, url }) => {
      if (!isAllowedExternalUrl(url, allowedHosts)) {
        return h('li', {}, [
          h('span', { className: 'footer-muted', text: `${label} (enlace por confirmar)` }),
        ]);
      }
      return h('li', {}, [
        h('a', { attrs: { href: url, target: '_blank', rel: 'noopener noreferrer' } }, [
          h('span', { text: label }),
          icon('arrow_outward', 'icon--sm'),
          h('span', { className: 'visually-hidden', text: ' (se abre en una pestaña nueva)' }),
        ]),
      ]);
    }),
  );
}

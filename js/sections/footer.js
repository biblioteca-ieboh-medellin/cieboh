import { h, icon } from '../core/dom.js';
import { format } from '../core/template.js';
import { badgeList } from '../ui/kit.js';

function openPrivacy(privacy, modal) {
  modal.open({
    title: privacy.title,
    content: [
      ...(privacy.paragraphs ?? []).map((text) => h('p', { text })),
      privacy.note ? h('p', { className: 'modal__note', text: privacy.note }) : null,
    ].filter(Boolean),
  });
}

/** Acciones que un enlace legal puede disparar (lista blanca). */
const LEGAL_ACTIONS = Object.freeze({ privacy: (data, { modal }) => openPrivacy(data.privacy ?? {}, modal) });

function renderLegalItem(item, data, ctx) {
  if (item.action && Object.hasOwn(LEGAL_ACTIONS, item.action)) {
    const button = h('button', { className: 'link-button', attrs: { type: 'button', 'aria-haspopup': 'dialog' }, text: item.label });
    button.addEventListener('click', () => LEGAL_ACTIONS[item.action](data, ctx));
    return h('li', {}, [button]);
  }
  return h('li', {}, [ctx.link(item.href, [item.label])]);
}

export function renderFooter(data, ctx) {
  const { link } = ctx;
  const contact = data.contact ?? {};

  const columns = (data.columns ?? []).map((col, i) => {
    const titleId = `footer-col-${i}`;
    return h('nav', { attrs: { 'aria-labelledby': titleId } }, [
      h('h2', { className: 'footer-title', text: col.title, attrs: { id: titleId } }),
      h('ul', { className: 'footer-links' }, (col.links ?? []).map((item) => {
        const external = typeof item.href === 'string' && item.href.startsWith('https://');
        return h('li', {}, [
          link(item.href, [h('span', { text: item.label }), external ? icon('arrow_outward', 'icon--sm') : null], { plainClass: 'footer-muted' }),
        ]);
      })),
    ]);
  });

  return [
    h('div', { className: 'container' }, [
      h('div', { className: 'footer-grid' }, [
        h('div', { className: 'stack-md' }, [
          h('div', { className: 'brand brand--footer' }, [
            h('img', { className: 'brand__logo', attrs: { src: 'assets/img/logo.svg', alt: '', width: 40, height: 40, loading: 'lazy' } }),
            h('span', { className: 'brand__name', text: data.brandName }),
          ]),
          h('p', { className: 'text-sm footer-muted', text: data.description }),
          badgeList(data.badges, { small: true }),
        ]),
        ...columns,
        h('div', {}, [
          h('h2', { className: 'footer-title', text: contact.title }),
          h('address', { className: 'contact-list' }, (contact.items ?? []).map((item) =>
            h('p', {}, [icon(item.icon, 'icon--sm'), link(item.href, [item.label])]),
          )),
        ]),
      ]),
      h('div', { className: 'footer-bottom' }, [
        h('p', { text: format(data.copyright, { year: new Date().getFullYear() }) }),
        h('ul', { className: 'footer-legal' }, (data.legal ?? []).map((item) => renderLegalItem(item, data, ctx))),
      ]),
    ]),
  ];
}

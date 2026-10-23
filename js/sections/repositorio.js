import { h, icon } from '../core/dom.js';
import { format } from '../core/template.js';
import { eyebrow } from '../ui/kit.js';

function renderDocument(doc, labels, { link, notifier }) {
  const content = [icon('download', 'icon--sm'), h('span', { text: doc.actionLabel })];
  const accessibleName = format(labels.download, doc);
  const pendingMessage = format(labels.pending, { ...doc, email: labels.email });

  // Si el archivo está publicado (ruta permitida) se genera un enlace de descarga;
  // si no, un botón que avisa que estará disponible pronto.
  let action = doc.href ? link(doc.href, content, { className: 'btn btn--primary btn--sm', attrs: { 'aria-label': accessibleName } }) : null;
  if (!action || action.tagName !== 'A') {
    action = h('button', { className: 'btn btn--primary btn--sm', attrs: { type: 'button', 'aria-label': accessibleName } }, content);
    action.addEventListener('click', () => notifier.show(pendingMessage, 'info'));
  }

  return h('li', { className: 'doc' }, [
    h('div', { className: 'doc__info' }, [
      h('span', { className: 'doc__icon' }, [icon(doc.icon)]),
      h('div', { className: 'doc__text' }, [
        h('span', { className: 'doc__title', text: doc.title }),
        h('span', { className: 'mono doc__meta', text: [doc.format, doc.size, doc.step].filter(Boolean).join(' • ') }),
      ]),
    ]),
    action,
  ]);
}

function renderContact(contact, { link }) {
  return h('aside', { className: 'info-card', attrs: { id: 'contacto', 'aria-labelledby': 'contacto-title' } }, [
    h('header', { className: 'stack-xs' }, [
      eyebrow(contact.eyebrow),
      h('h3', { className: 'headline-md', text: contact.title, attrs: { id: 'contacto-title' } }),
      h('p', { className: 'text-muted text-sm', text: contact.text }),
    ]),
    h('ul', { className: 'info-list' }, (contact.items ?? []).map((item) =>
      h('li', {}, [icon(item.icon, 'text-secondary'), link(item.href, [item.label])]),
    )),
  ]);
}

export function renderRepositorio(data, ctx) {
  const labels = data.labels ?? {};
  return [
    h('div', { className: 'container repo-grid' }, [
      h('div', { className: 'stack-lg' }, [
        h('header', { className: 'stack-xs' }, [
          eyebrow(data.eyebrow),
          h('h2', { className: 'headline-lg', text: data.title, attrs: { id: 'repo-title' } }),
          h('p', { className: 'text-muted', text: data.intro }),
        ]),
        h('ul', { className: 'doc-list' }, (data.documents ?? []).map((doc) => renderDocument(doc, labels, ctx))),
      ]),
      data.contact ? renderContact(data.contact, ctx) : null,
    ]),
  ];
}

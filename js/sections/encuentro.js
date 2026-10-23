import { h } from '../core/dom.js';
import { actionButton, badge } from '../ui/kit.js';

export function renderEncuentro(data, { link }) {
  return [
    h('div', { className: 'container cta-band__inner' }, [
      h('div', { className: 'stack-sm cta-band__copy' }, [
        data.badge ? badge(data.badge, { tag: 'p' }) : null,
        h('h2', { className: 'headline-lg', text: data.title, attrs: { id: 'ccc-title' } }),
        h('p', { text: data.text }),
      ]),
      h('div', { className: 'cta-band__actions' }, (data.actions ?? []).map((action) => actionButton(link, action))),
    ]),
  ];
}

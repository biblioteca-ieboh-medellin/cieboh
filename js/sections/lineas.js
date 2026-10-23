import { h, icon } from '../core/dom.js';
import { badge, eyebrow, iconList, sectionHead, variant } from '../ui/kit.js';

const LINE_STYLES = Object.freeze({
  social: { card: 'card--line-social', focus: '', tone: 'secondary' },
  natural: { card: 'card--line-natural', focus: 'focus-grid--amber', tone: 'amber' },
});

function renderLine(line) {
  const style = variant(LINE_STYLES, line.variant, LINE_STYLES.social);
  return h('article', { className: `card card--padded card--line ${style.card}` }, [
    h('div', { className: 'stack-md' }, [
      h('div', { className: 'card__meta' }, [
        badge(line.badge, { small: true }),
        h('span', { className: 'mono text-muted', text: line.code }),
      ]),
      h('h3', { className: 'headline-md', text: line.title }),
      h('p', { className: 'text-muted', text: line.description }),
      iconList(line.focus, { className: `focus-grid ${style.focus}`.trim(), iconTone: style.tone }),
    ]),
    h('footer', { className: 'card__footer' }, [
      h('span', { className: 'text-muted text-sm', text: line.coordinator }),
      h('span', { className: 'card__count' }, [line.count, icon('arrow_forward', 'icon--sm')]),
    ]),
  ]);
}

export function renderLineas(data) {
  return [
    h('div', { className: 'container stack-2xl' }, [
      sectionHead({ eyebrow: eyebrow(data.eyebrow), title: data.title, titleId: 'lineas-title', intro: data.intro }),
      h('div', { className: 'grid grid--2' }, (data.lines ?? []).map(renderLine)),
    ]),
  ];
}

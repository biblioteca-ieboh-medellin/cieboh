import { h, icon, s } from '../core/dom.js';
import { richText } from '../core/rich-text.js';
import { actionButton, badgeList, eyebrow, tone } from '../ui/kit.js';

/** Diagrama del emblema: la geometría es fija, los textos vienen del JSON. */
function renderDiagram(diagram = {}, description = '') {
  const [b1 = '', b2 = '', b3 = ''] = diagram.bottom ?? [];
  const text = (x, y, value, extra = '') => s('text', { class: `dg-text ${extra}`.trim(), x, y, 'text-anchor': 'middle' }, [value]);

  return s('svg', { class: 'emblem__diagram', viewBox: '0 0 320 220', role: 'img', 'aria-labelledby': 'emblem-desc' }, [
    s('title', { id: 'emblem-desc' }, [description]),
    s('path', { class: 'dg-line dg-line--dashed', d: 'M160 44 L160 80' }),
    s('path', { class: 'dg-line dg-line--mint', d: 'M70 101 L90 101' }),
    s('path', { class: 'dg-line dg-line--amber', d: 'M230 101 L250 101' }),
    s('path', { class: 'dg-line', d: 'M160 122 L160 160 M80 160 L240 160 M80 160 L80 164 M160 160 L160 164 M240 160 L240 164' }),
    s('rect', { class: 'dg-fill-primary', x: 90, y: 80, width: 140, height: 42, rx: 8 }),
    text(160, 106, diagram.core, 'dg-text--white dg-text--bold'),
    s('rect', { class: 'dg-fill-secondary', x: 115, y: 10, width: 90, height: 34, rx: 17 }),
    text(160, 32, diagram.top, 'dg-text--white dg-text--mono'),
    s('rect', { class: 'dg-fill-mint', x: 10, y: 85, width: 60, height: 32, rx: 6 }),
    text(40, 105, diagram.left, 'dg-text--sm'),
    s('rect', { class: 'dg-fill-amber', x: 250, y: 85, width: 60, height: 32, rx: 6 }),
    text(280, 105, diagram.right, 'dg-text--sm dg-text--brown'),
    s('circle', { class: 'dg-fill-high', cx: 80, cy: 180, r: 16 }),
    text(80, 184, b1, 'dg-text--sm'),
    s('circle', { class: 'dg-fill-primary', cx: 160, cy: 180, r: 16 }),
    text(160, 184, b2, 'dg-text--sm dg-text--white'),
    s('circle', { class: 'dg-fill-secondary-soft', cx: 240, cy: 180, r: 16 }),
    text(240, 184, b3, 'dg-text--xs dg-text--green'),
  ]);
}

function renderEmblem(emblem = {}) {
  const foot = emblem.foot ?? {};
  return h('figure', { className: 'emblem' }, [
    h('figcaption', { className: 'emblem__head' }, [
      h('span', { className: 'emblem__title' }, [icon(emblem.icon, 'icon--sm text-mint'), emblem.title]),
      emblem.tag ? h('span', { className: 'tag-mono', text: emblem.tag }) : null,
    ]),
    renderDiagram(emblem.diagram, emblem.description),
    h('div', { className: 'emblem__foot' }, [
      h('span', {}, [icon(foot.icon, 'icon--sm text-mint'), foot.label]),
      h('span', { className: 'mono text-secondary', text: foot.value }),
    ]),
  ]);
}

function renderMetric({ icon: iconName, tone: t, tag, value, label }) {
  return h('li', { className: 'metric' }, [
    h('div', { className: `metric__head ${tone(t)}` }, [icon(iconName, 'icon--md'), h('span', { className: 'mono', text: tag })]),
    h('span', { className: 'metric__value', text: value }),
    h('span', { className: 'metric__label', text: label }),
  ]);
}

export function renderHero(data, { link }) {
  return [
    h('div', { className: 'container stack-xl' }, [
      badgeList(data.badges, { label: data.badgesLabel }),
      h('div', { className: 'hero__grid' }, [
        h('div', { className: 'hero__copy' }, [
          eyebrow({ label: data.eyebrow }, { rule: true }),
          h('h1', { className: 'display', attrs: { id: 'hero-title' } }, richText(data.title)),
          h('p', { className: 'lead' }, richText(data.lead)),
          h('div', { className: 'button-row' }, (data.actions ?? []).map((action) => actionButton(link, action))),
        ]),
        renderEmblem(data.emblem),
      ]),
      h('ul', { className: 'metrics', attrs: { 'aria-label': data.metricsLabel } }, (data.metrics ?? []).map(renderMetric)),
    ]),
  ];
}

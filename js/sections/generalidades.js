import { h, icon } from '../core/dom.js';
import { badge, eyebrow, iconTile, sectionHead, tone } from '../ui/kit.js';

function renderPillar(p) {
  const inverse = p.variant === 'inverse';
  return h('article', { className: `card card--padded card--split${inverse ? ' card--inverse' : ''}` }, [
    h('div', { className: 'stack-md' }, [
      iconTile(p.icon, p.tile),
      h('h3', { className: 'headline-sm', text: p.title }),
      h('p', { className: inverse ? '' : 'text-muted', text: p.text }),
    ]),
    p.foot ? h('p', { className: 'card__foot' }, [icon(p.foot.icon, 'icon--sm'), p.foot.label]) : null,
  ]);
}

function renderLevel(level) {
  return h('article', { className: `card card--padded-lg stack-md${level.highlighted ? ' card--ring' : ''}` }, [
    h('div', { className: 'card__meta' }, [
      badge(level.badge, { small: true }),
      h('span', { className: `mono ${level.highlighted ? 'text-primary' : 'text-muted'}`, text: level.cycle }),
    ]),
    h('h4', { className: 'headline-sm', text: level.title }),
    h('ul', { className: 'feature-list' }, (level.features ?? []).map((f) =>
      h('li', {}, [
        icon(f.icon, tone(f.tone)),
        h('p', {}, [h('strong', { text: f.title }), ` ${f.text}`]),
      ]),
    )),
  ]);
}

export function renderGeneralidades(data) {
  const levels = data.levels ?? {};
  return [
    h('div', { className: 'container stack-2xl' }, [
      sectionHead({
        eyebrow: eyebrow(data.eyebrow),
        title: data.title,
        titleId: 'pei-title',
        intro: data.intro,
        aside: data.pill ? h('p', { className: 'pill-note' }, [icon(data.pill.icon, 'icon--sm text-primary'), data.pill.label]) : null,
      }),
      h('div', { className: 'grid grid--3' }, (data.pillars ?? []).map(renderPillar)),
      h('div', { className: 'panel stack-lg' }, [
        h('div', { className: 'stack-xs' }, [
          eyebrow(levels.eyebrow),
          h('h3', { className: 'headline-md', text: levels.title }),
          h('p', { className: 'text-muted measure', text: levels.intro }),
        ]),
        h('div', { className: 'grid grid--3' }, (levels.items ?? []).map(renderLevel)),
      ]),
    ]),
  ];
}

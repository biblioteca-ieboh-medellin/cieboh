import { h } from '../core/dom.js';
import { badge, iconList, iconTile, sectionHead, variant } from '../ui/kit.js';

const BLOCK_STYLES = Object.freeze({
  primary: { card: 'card--top-primary', kicker: '' },
  amber: { card: 'card--top-amber', kicker: 'kicker--amber' },
  secondary: { card: 'card--top-secondary', kicker: '' },
  terracotta: { card: 'card--top-terracotta', kicker: 'kicker--terracotta' },
});

function renderBlock(block) {
  const style = variant(BLOCK_STYLES, block.variant, BLOCK_STYLES.primary);
  const list = Array.isArray(block.tags)
    ? h('ul', { className: 'tag-cloud' }, block.tags.map((t) => h('li', { text: t })))
    : iconList(block.items, { className: 'mini-list', iconClass: 'icon--sm' });

  return h('article', { className: `card card--padded-lg card--split ${style.card}` }, [
    h('div', { className: 'stack-sm' }, [
      iconTile(block.icon, block.tile, ''),
      h('p', { className: `kicker ${style.kicker}`.trim(), text: block.kicker }),
      h('h3', { className: 'headline-sm', text: block.title }),
      h('p', { className: 'text-muted text-sm', text: block.text }),
    ]),
    list,
  ]);
}

export function renderConvergencia(data) {
  return [
    h('div', { className: 'container stack-2xl' }, [
      sectionHead({
        eyebrow: badge({ ...data.badge, variant: 'solid' }, { tag: 'p' }),
        title: data.title,
        titleId: 'convergen-title',
        intro: data.intro,
        center: true,
      }),
      h('div', { className: 'grid grid--4' }, (data.blocks ?? []).map(renderBlock)),
    ]),
  ];
}

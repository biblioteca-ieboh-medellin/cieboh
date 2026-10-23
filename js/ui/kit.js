import { h, icon } from '../core/dom.js';
import { richText } from '../core/rich-text.js';
import { resolveHref } from '../core/safe-url.js';

/**
 * Piezas de interfaz reutilizables por todos los renderizadores de sección.
 *
 * Los JSON eligen variantes por NOMBRE ("mint", "amber"…), nunca clases CSS libres:
 * cada mapa de abajo es una lista blanca. Un valor desconocido cae en un estilo por defecto,
 * así el contenido no puede inyectar clases ni romper el sistema de diseño.
 */
const pick = (map, key, fallback = '') => (typeof key === 'string' && Object.hasOwn(map, key) ? map[key] : fallback);

const TONES = Object.freeze({
  primary: 'text-primary',
  secondary: 'text-secondary',
  mint: 'text-mint',
  amber: 'text-amber',
  'warm-amber': 'text-warm-amber',
  terracotta: 'text-terracotta',
  muted: 'text-muted',
});

const BADGES = Object.freeze({
  solid: 'badge--solid',
  mint: 'badge--mint',
  neutral: 'badge--neutral',
  amber: 'badge--amber',
  'amber-solid': 'badge--amber-solid',
  'on-dark': 'badge--on-dark',
});

const BUTTONS = Object.freeze({
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  soft: 'btn--soft',
  amber: 'btn--amber',
  'amber-soft': 'btn--amber-soft',
  'ghost-light': 'btn--ghost-light',
});

const TILES = Object.freeze({
  mint: 'icon-tile--mint',
  high: 'icon-tile--high',
  'mint-bright': 'icon-tile--mint-bright',
  amber: 'icon-tile--amber',
  terracotta: 'icon-tile--terracotta',
});

const EYEBROWS = Object.freeze({ primary: 'eyebrow--primary', amber: 'eyebrow--amber' });

export const tone = (name) => pick(TONES, name);
export const variant = pick;

export function badge({ label, icon: iconName, variant: v, iconTone } = {}, { tag = 'span', small = false } = {}) {
  const className = `badge ${pick(BADGES, v, 'badge--mint')}${small ? ' badge--sm' : ''}`;
  return h(tag, { className }, [icon(iconName, `icon--sm ${tone(iconTone)}`), label]);
}

export function badgeList(items = [], { label, small = false, className = 'badge-row' } = {}) {
  return h('ul', { className, attrs: { 'aria-label': label } }, items.map((b) => badge(b, { tag: 'li', small })));
}

export function eyebrow({ label, icon: iconName, variant: v } = {}, { rule = false } = {}) {
  const className = ['eyebrow', pick(EYEBROWS, v), rule ? 'eyebrow--rule' : ''].filter(Boolean).join(' ');
  return h('p', { className }, [icon(iconName), label]);
}

export function iconTile(iconName, tileVariant, size = 'icon--lg') {
  return h('span', { className: `icon-tile ${pick(TILES, tileVariant, 'icon-tile--mint')}` }, [icon(iconName, size)]);
}

/**
 * Encabezado de sección estándar: eyebrow + título + introducción (+ elemento lateral).
 */
export function sectionHead({ eyebrow: eb, title, titleId, intro, aside, center = false, titleTag = 'h2', titleClass = 'headline-lg' }) {
  const heading = h(titleTag, { className: titleClass, attrs: { id: titleId } }, richText(title));
  const introEl = intro ? h('p', { className: 'text-muted' }, richText(intro)) : null;

  if (center) {
    return h('header', { className: 'section-head section-head--center' }, [eb, heading, introEl]);
  }
  return h('header', { className: 'section-head' }, [
    h('div', { className: 'section-head__copy' }, [eb, heading, introEl]),
    aside,
  ]);
}

/**
 * Crea la fábrica de enlaces seguros que comparten todas las secciones.
 * - href ausente (undefined) → texto plano (dato informativo sin enlace)
 * - href null o no permitido → texto con la etiqueta "(enlace por confirmar)"
 * - externo → target=_blank + rel=noopener noreferrer + aviso para lectores de pantalla
 */
export function createLinkFactory(policy, ui) {
  return function link(href, children, { className = '', attrs = {}, plainClass = '' } = {}) {
    if (href === undefined) return h('span', { className: plainClass || className }, children);

    const resolved = resolveHref(href, policy);
    if (!resolved) {
      return h('span', { className: `${className} link-pending`.trim() }, [...children, ` ${ui.linkPending ?? ''}`]);
    }

    const linkAttrs = { ...attrs, href: resolved.href };
    const extra = [];
    if (resolved.kind === 'external') {
      linkAttrs.target = '_blank';
      linkAttrs.rel = 'noopener noreferrer';
      extra.push(h('span', { className: 'visually-hidden', text: ` ${ui.newTab ?? ''}` }));
    }
    if (resolved.kind === 'download') linkAttrs.download = true;
    return h('a', { className, attrs: linkAttrs }, [...children, ...extra]);
  };
}

/** Botón-enlace a partir de una acción del JSON: { label, href, icon, iconFirst, variant }. */
export function actionButton(link, { label, href, icon: iconName, iconFirst = false, variant: v }) {
  const glyph = icon(iconName, 'icon--sm');
  const children = iconFirst ? [glyph, label] : [label, glyph];
  return link(href, children, { className: `btn ${pick(BUTTONS, v, 'btn--primary')}` });
}

/** Lista de íconos + texto: [{ icon, label }]. */
export function iconList(items = [], { className, iconClass = '', iconTone } = {}) {
  return h('ul', { className }, items.map((item) => h('li', {}, [icon(item.icon, `${iconClass} ${tone(iconTone)}`.trim()), item.label])));
}

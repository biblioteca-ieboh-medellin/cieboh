import { h, icon } from '../core/dom.js';

/**
 * Encabezado fijo: barra institucional + marca + menú principal.
 * @returns {{ nodes: Node[], refs: { toggle: HTMLElement, nav: HTMLElement, icon: HTMLElement, label: HTMLElement, links: HTMLElement[] } }}
 */
export function renderHeader(site, { link }) {
  const { topbar = {}, brand = {}, nav = {}, ui = {} } = site;

  const topbarEl = h('div', { className: 'topbar' }, [
    h('div', { className: 'container topbar__inner' }, [
      h('span', { className: 'topbar__org' }, [icon(topbar.icon, 'icon--sm'), topbar.text]),
      topbar.link
        ? link(topbar.link.href, [topbar.link.label, icon(topbar.link.icon, 'icon--sm')], { className: 'topbar__link' })
        : null,
    ]),
  ]);

  const brandEl = link(brand.homeHref ?? '#inicio', [
    h('img', { className: 'brand__logo', attrs: { src: 'assets/img/logo.svg', alt: '', width: 40, height: 40 } }),
    h('span', { className: 'brand__text' }, [
      h('span', { className: 'brand__name', text: brand.name }),
      h('span', { className: 'brand__tagline', text: brand.tagline }),
    ]),
  ], { className: 'brand', attrs: { 'aria-label': brand.homeLabel } });

  const toggleIcon = icon('menu');
  const toggleLabel = h('span', { className: 'visually-hidden', text: ui.menuOpen });
  const toggle = h('button', {
    className: 'nav-toggle',
    attrs: { type: 'button', 'aria-expanded': 'false', 'aria-controls': 'menu-principal' },
  }, [toggleIcon, toggleLabel]);

  const links = (nav.items ?? []).map((item) => link(item.href, [item.label], { className: 'main-nav__link' }));
  const navEl = h('nav', { className: 'main-nav', attrs: { id: 'menu-principal', 'aria-label': nav.label } }, [
    h('ul', { className: 'main-nav__list' }, links.map((a) => h('li', {}, [a]))),
  ]);

  return {
    nodes: [topbarEl, h('div', { className: 'container navbar' }, [brandEl, toggle, navEl])],
    refs: { toggle, nav: navEl, icon: toggleIcon, label: toggleLabel, links },
  };
}

/** Barra de accesos rápidos bajo el encabezado (solo escritorio). */
export function renderAnchorHub(site, { link }) {
  const hub = site.anchorHub ?? {};
  return [
    h('div', { className: 'container anchor-hub__inner' }, [
      h('p', { className: 'anchor-hub__status' }, [
        h('span', { className: 'mono anchor-hub__version' }, [icon(hub.icon, 'icon--sm'), hub.version]),
        h('span', { text: '•', attrs: { 'aria-hidden': 'true' } }),
        hub.status,
      ]),
      h('ul', { className: 'anchor-hub__links' }, (hub.links ?? []).map((item) =>
        h('li', {}, [link(item.href, [icon(item.icon, 'icon--sm'), item.label])]),
      )),
    ]),
  ];
}

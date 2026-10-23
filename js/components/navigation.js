/**
 * Menú principal responsive: abre/cierra el panel móvil, sincroniza ARIA,
 * cierra con Escape, con clic en un enlace o al pasar a escritorio.
 */
export class MobileNavigation {
  /**
   * @param {{ toggle: HTMLButtonElement, nav: HTMLElement, icon: HTMLElement, label: HTMLElement }} elements
   * @param {MediaQueryList} desktopQuery
   */
  constructor({ toggle, nav, icon, label }, desktopQuery) {
    this.toggle = toggle;
    this.nav = nav;
    this.icon = icon;
    this.label = label;
    this.desktopQuery = desktopQuery;
    this.isOpen = false;
  }

  init() {
    if (!this.toggle || !this.nav) return this;

    this.toggle.addEventListener('click', () => this.setOpen(!this.isOpen));
    this.nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) this.setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.setOpen(false);
        this.toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (this.isOpen && !this.nav.contains(event.target) && !this.toggle.contains(event.target)) {
        this.setOpen(false);
      }
    });
    this.desktopQuery.addEventListener('change', (event) => {
      if (event.matches) this.setOpen(false);
    });
    return this;
  }

  setOpen(open) {
    this.isOpen = open;
    this.nav.classList.toggle('is-open', open);
    this.toggle.setAttribute('aria-expanded', String(open));
    this.icon.textContent = open ? 'close' : 'menu';
    this.label.textContent = open ? 'Cerrar menú' : 'Abrir menú';
  }
}

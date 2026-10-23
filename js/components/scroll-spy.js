/**
 * Resalta en el menú la sección visible (IntersectionObserver, sin escuchar scroll).
 */
export class ScrollSpy {
  /**
   * @param {HTMLElement[]} sections
   * @param {HTMLAnchorElement[]} links
   * @param {{ rootMargin: string }} options
   */
  constructor(sections, links, { rootMargin }) {
    this.sections = sections;
    this.links = links;
    this.rootMargin = rootMargin;
  }

  init() {
    if (!('IntersectionObserver' in window) || this.sections.length === 0) return this;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => this.activate(entry.target.id));
      },
      { rootMargin: this.rootMargin, threshold: 0 },
    );
    this.sections.forEach((section) => observer.observe(section));
    this.activate(this.sections[0].id);
    return this;
  }

  activate(id) {
    this.links.forEach((link) => {
      const isActive = link.hash === `#${id}`;
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }
}

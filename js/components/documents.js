import { h, icon } from '../core/dom.js';
import { isAllowedLocalPath } from '../core/safe-url.js';

/**
 * Lista de formatos descargables del repositorio EDS.
 * Solo genera enlaces de descarga para rutas locales permitidas (lista blanca);
 * si el archivo no está publicado, muestra un aviso en lugar de un enlace roto.
 */
export class DocumentsSection {
  /**
   * @param {HTMLElement} list
   * @param {ReadonlyArray<object>} documents
   * @param {{ allowedPathPrefix: string, contactEmail: string }} options
   * @param {{ show: (msg: string, type?: string) => void }} notifier
   */
  constructor(list, documents, { allowedPathPrefix, contactEmail }, notifier) {
    this.list = list;
    this.documents = documents;
    this.allowedPathPrefix = allowedPathPrefix;
    this.contactEmail = contactEmail;
    this.notifier = notifier;
  }

  init() {
    if (!this.list) return this;
    this.list.replaceChildren(...this.documents.map((doc) => this.#renderRow(doc)));
    return this;
  }

  #renderRow(doc) {
    const meta = `${doc.format} • ${doc.size} • ${doc.step}`;
    return h('li', { className: 'doc' }, [
      h('div', { className: 'doc__info' }, [
        h('span', { className: 'doc__icon' }, [icon(doc.icon)]),
        h('div', { className: 'doc__text' }, [
          h('span', { className: 'doc__title', text: doc.title }),
          h('span', { className: 'mono doc__meta', text: meta }),
        ]),
      ]),
      this.#renderAction(doc),
    ]);
  }

  #renderAction(doc) {
    const content = [icon('download', 'icon--sm'), h('span', { text: doc.actionLabel })];
    const accessibleName = `Descargar ${doc.title} (${doc.format}, ${doc.size})`;

    if (isAllowedLocalPath(doc.href, this.allowedPathPrefix)) {
      return h('a', {
        className: 'btn btn--primary btn--sm',
        attrs: { href: doc.href, download: '', 'aria-label': accessibleName },
      }, content);
    }

    const button = h('button', {
      className: 'btn btn--primary btn--sm',
      attrs: { type: 'button', 'aria-label': accessibleName },
    }, content);
    button.addEventListener('click', () => {
      this.notifier.show(
        `“${doc.title}” estará disponible pronto. Mientras tanto, solicítalo a ${this.contactEmail}.`,
        'info',
      );
    });
    return button;
  }
}

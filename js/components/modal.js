/**
 * Modal reutilizable basado en <dialog> nativo (trampa de foco y Escape incluidos).
 * El contenido se recibe como nodos DOM ya construidos, nunca como HTML en texto.
 */
export class Modal {
  #lastFocused = null;

  /**
   * @param {{ dialog: HTMLDialogElement, title: HTMLElement, body: HTMLElement, closeButton: HTMLElement }} elements
   */
  constructor({ dialog, title, body, closeButton }) {
    this.dialog = dialog;
    this.title = title;
    this.body = body;
    this.closeButton = closeButton;
  }

  init() {
    if (!this.dialog) return this;
    this.closeButton?.addEventListener('click', () => this.close());
    // Clic en el fondo (fuera de la caja) cierra el modal.
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.close();
    });
    this.dialog.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      this.#lastFocused?.focus?.();
    });
    return this;
  }

  /**
   * @param {{ title: string, content: Node[] }} options
   */
  open({ title, content }) {
    if (!this.dialog) return;
    this.#lastFocused = document.activeElement;
    this.title.textContent = title;
    this.body.replaceChildren(...content);
    document.body.classList.add('is-locked');
    this.dialog.showModal();
  }

  close() {
    if (this.dialog?.open) this.dialog.close();
  }
}

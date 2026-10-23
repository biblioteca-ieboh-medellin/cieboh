import { h, icon } from '../core/dom.js';

const ICONS = Object.freeze({ success: 'check_circle', info: 'info', error: 'error' });

/**
 * Notificaciones tipo "toast" accesibles (región aria-live).
 */
export class ToastNotifier {
  /**
   * @param {HTMLElement} region
   * @param {{ durationMs: number }} options
   */
  constructor(region, { durationMs }) {
    this.region = region;
    this.durationMs = durationMs;
  }

  /**
   * @param {string} message
   * @param {'success'|'info'|'error'} [type]
   */
  show(message, type = 'info') {
    if (!this.region) return;
    const variant = ICONS[type] ? type : 'info';

    const closeBtn = h('button', { className: 'toast__close', attrs: { type: 'button', 'aria-label': 'Cerrar notificación' } }, [
      icon('close', 'icon--sm'),
    ]);
    const toast = h('div', { className: `toast toast--${variant}`, attrs: { role: variant === 'error' ? 'alert' : 'status' } }, [
      icon(ICONS[variant]),
      h('p', { className: 'toast__text', text: message }),
      closeBtn,
    ]);

    const dismiss = () => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 220);
    };
    closeBtn.addEventListener('click', dismiss, { once: true });
    setTimeout(dismiss, this.durationMs);

    this.region.append(toast);
  }
}

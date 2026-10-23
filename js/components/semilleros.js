import { h, icon } from '../core/dom.js';

const percent = (enrolled, capacity) => (capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0);

/**
 * Cálculo del resumen de cupos (lógica pura, sin DOM → fácil de probar).
 * @param {ReadonlyArray<{ enrolled: number, capacity: number }>} semilleros
 */
export function summarizeQuotas(semilleros) {
  const enrolled = semilleros.reduce((sum, s) => sum + s.enrolled, 0);
  const capacity = semilleros.reduce((sum, s) => sum + s.capacity, 0);
  return { enrolled, capacity, available: Math.max(0, capacity - enrolled) };
}

/**
 * Vista de semilleros: renderiza tarjetas y abre el resumen de cupos.
 */
export class SemillerosSection {
  /**
   * @param {{ list: HTMLElement, summaryButton: HTMLElement|null }} elements
   * @param {ReadonlyArray<object>} semilleros
   * @param {import('./modal.js').Modal} modal
   */
  constructor({ list, summaryButton }, semilleros, modal) {
    this.list = list;
    this.summaryButton = summaryButton;
    this.semilleros = semilleros;
    this.modal = modal;
  }

  init() {
    if (!this.list) return this;
    this.list.replaceChildren(...this.semilleros.map((s) => this.#renderCard(s)));
    this.summaryButton?.addEventListener('click', () => this.openSummary());
    // Anima las barras después del primer pintado.
    requestAnimationFrame(() => {
      this.list.querySelectorAll('[data-progress]').forEach((bar) => {
        bar.style.width = `${bar.dataset.progress}%`;
      });
    });
    return this;
  }

  #renderCard(s) {
    const pct = percent(s.enrolled, s.capacity);
    const bar = h('div', {
      className: `progress__bar${pct >= 90 ? ' is-high' : ''}`,
      attrs: { 'data-progress': pct },
    });

    return h('li', {}, [
      h('article', { className: 'card card--interactive seed-card', attrs: { 'aria-labelledby': `seed-${s.id}` } }, [
        h('div', { className: 'stack-sm' }, [
          h('div', { className: 'seed-card__top' }, [
            h('span', { className: `mono seed-card__code seed-card__code--${s.id}`, text: s.code }),
            icon(s.icon, 'seed-card__icon'),
          ]),
          h('h3', { className: 'headline-sm', text: s.name, attrs: { id: `seed-${s.id}` } }),
          h('p', { className: 'text-muted text-sm', text: s.description }),
        ]),
        h('div', { className: 'seed-card__facts' }, [
          this.#fact('Niveles:', s.levels),
          this.#fact('Día de trabajo:', s.schedule),
          h('div', {
            className: 'progress',
            attrs: {
              role: 'progressbar',
              'aria-valuemin': 0,
              'aria-valuemax': s.capacity,
              'aria-valuenow': s.enrolled,
              'aria-label': `Cupos ocupados en ${s.name}`,
            },
          }, [bar]),
          h('span', { className: 'seed-card__quota', text: `${s.enrolled}/${s.capacity} Estudiantes activos` }),
        ]),
      ]),
    ]);
  }

  #fact(label, value) {
    return h('div', { className: 'seed-card__fact' }, [h('span', { text: label }), h('strong', { text: value })]);
  }

  openSummary() {
    const totals = summarizeQuotas(this.semilleros);
    const rows = this.semilleros.map((s) =>
      h('tr', {}, [
        h('td', { text: s.name }),
        h('td', { text: s.enrolled }),
        h('td', { text: s.capacity }),
        h('td', { text: Math.max(0, s.capacity - s.enrolled) }),
      ]),
    );

    const table = h('table', { className: 'summary-table' }, [
      h('caption', { className: 'visually-hidden', text: 'Cupos por semillero' }),
      h('thead', {}, [
        h('tr', {}, ['Semillero', 'Inscritos', 'Cupos', 'Libres'].map((t) => h('th', { text: t, attrs: { scope: 'col' } }))),
      ]),
      h('tbody', {}, rows),
      h('tfoot', {}, [
        h('tr', {}, [
          h('td', { text: 'Total' }),
          h('td', { text: totals.enrolled }),
          h('td', { text: totals.capacity }),
          h('td', { text: totals.available }),
        ]),
      ]),
    ]);

    this.modal.open({
      title: 'Convocatoria Semilleros BOH 2025',
      content: [
        h('p', {
          text: `Hay ${totals.enrolled} estudiantes activos y ${totals.available} cupos disponibles en total.`,
        }),
        table,
        h('p', {
          className: 'modal__note',
          text: 'Requisitos: compromiso de asistencia semanal y acompañamiento de un docente asesor.',
        }),
      ],
    });
  }
}

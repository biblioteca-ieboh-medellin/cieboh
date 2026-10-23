import { h, icon } from '../core/dom.js';
import { format } from '../core/template.js';
import { eyebrow, sectionHead } from '../ui/kit.js';

const CODE_STYLES = Object.freeze(['steam', 'cea', 'dagantes', 'verdes']);
const toCount = (n) => (Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0);
const percent = (enrolled, capacity) => (capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0);

/**
 * Cálculo del resumen de cupos (lógica pura, sin DOM → fácil de probar).
 * @param {ReadonlyArray<{ enrolled: number, capacity: number }>} items
 */
export function summarizeQuotas(items) {
  const enrolled = items.reduce((sum, i) => sum + toCount(i.enrolled), 0);
  const capacity = items.reduce((sum, i) => sum + toCount(i.capacity), 0);
  return { enrolled, capacity, available: Math.max(0, capacity - enrolled) };
}

function renderCard(item, labels) {
  const enrolled = toCount(item.enrolled);
  const capacity = toCount(item.capacity);
  const pct = percent(enrolled, capacity);
  const codeStyle = CODE_STYLES.includes(item.id) ? ` seed-card__code--${item.id}` : ' seed-card__code--steam';
  const titleId = `seed-${String(item.id ?? '').replace(/[^a-z0-9-]/gi, '')}`;
  const fact = (label, value) => h('div', { className: 'seed-card__fact' }, [h('span', { text: label }), h('strong', { text: value })]);

  return h('li', {}, [
    h('article', { className: 'card card--interactive seed-card', attrs: { 'aria-labelledby': titleId } }, [
      h('div', { className: 'stack-sm' }, [
        h('div', { className: 'seed-card__top' }, [
          h('span', { className: `mono seed-card__code${codeStyle}`, text: item.code }),
          icon(item.icon, 'seed-card__icon'),
        ]),
        h('h3', { className: 'headline-sm', text: item.name, attrs: { id: titleId } }),
        h('p', { className: 'text-muted text-sm', text: item.description }),
      ]),
      h('div', { className: 'seed-card__facts' }, [
        fact(labels.levels, item.levels),
        fact(labels.schedule, item.schedule),
        h('div', {
          className: 'progress',
          attrs: {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': capacity,
            'aria-valuenow': enrolled,
            'aria-label': format(labels.progress, { name: item.name }),
          },
        }, [h('div', { className: `progress__bar${pct >= 90 ? ' is-high' : ''}`, attrs: { 'data-progress': pct } })]),
        h('span', { className: 'seed-card__quota', text: format(labels.quota, { enrolled, capacity }) }),
      ]),
    ]),
  ]);
}

function openSummary(data, modal) {
  const summary = data.summary ?? {};
  const items = data.items ?? [];
  const totals = summarizeQuotas(items);
  const row = (cells, tag = 'td') => h('tr', {}, cells.map((c) => h(tag, { text: c, attrs: tag === 'th' ? { scope: 'col' } : {} })));

  modal.open({
    title: summary.title,
    content: [
      h('p', { text: format(summary.intro, totals) }),
      h('table', { className: 'summary-table' }, [
        h('caption', { className: 'visually-hidden', text: summary.caption }),
        h('thead', {}, [row(summary.columns ?? [], 'th')]),
        h('tbody', {}, items.map((i) => {
          const enrolled = toCount(i.enrolled);
          const capacity = toCount(i.capacity);
          return row([i.name, enrolled, capacity, Math.max(0, capacity - enrolled)]);
        })),
        h('tfoot', {}, [row([summary.totalLabel, totals.enrolled, totals.capacity, totals.available])]),
      ]),
      summary.note ? h('p', { className: 'modal__note', text: summary.note }) : null,
    ].filter(Boolean),
  });
}

export function renderSemilleros(data, { modal }) {
  const labels = data.labels ?? {};
  const button = data.summaryButton
    ? h('button', { className: 'btn btn--amber', attrs: { type: 'button', 'aria-haspopup': 'dialog' } }, [
        icon(data.summaryButton.icon, 'icon--sm'),
        data.summaryButton.label,
      ])
    : null;
  button?.addEventListener('click', () => openSummary(data, modal));

  const list = h('ul', { className: 'grid grid--4' }, (data.items ?? []).map((item) => renderCard(item, labels)));

  // Anima las barras de progreso después del primer pintado (CSSOM: permitido por la CSP).
  requestAnimationFrame(() => requestAnimationFrame(() => {
    list.querySelectorAll('[data-progress]').forEach((bar) => {
      bar.style.width = `${bar.dataset.progress}%`;
    });
  }));

  return [
    h('div', { className: 'container stack-xl' }, [
      sectionHead({ eyebrow: eyebrow(data.eyebrow), title: data.title, titleId: 'semilleros-title', intro: data.intro, aside: button }),
      list,
    ]),
  ];
}

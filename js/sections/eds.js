import { h, icon } from '../core/dom.js';
import { richText } from '../core/rich-text.js';
import { eyebrow, sectionHead, variant } from '../ui/kit.js';

/** Variantes visuales por paso: color del número, del ícono y de las viñetas. */
const STEP_STYLES = Object.freeze({
  deep: { num: 'step__num--deep', icon: 'text-secondary', dots: '' },
  secondary: { num: 'step__num--secondary', icon: 'text-secondary', dots: '' },
  mint: { num: 'step__num--mint', icon: '', dots: '' },
  amber: { num: 'step__num--amber', icon: 'text-amber', dots: 'dot-list--amber' },
  terracotta: { num: 'step__num--terracotta', icon: 'text-terracotta', dots: 'dot-list--terracotta' },
});

function renderStep(step) {
  const style = variant(STEP_STYLES, step.variant, STEP_STYLES.deep);
  return h('li', { className: `step${step.featured ? ' step--featured' : ''}` }, [
    h('div', { className: 'stack-sm' }, [
      h('span', { className: `step__num ${style.num} mono`, text: step.number }),
      icon(step.icon, `icon--lg ${step.featured ? '' : style.icon}`),
      h('h3', { className: 'headline-sm step__title', text: step.title }),
      h('p', { className: `text-sm${step.featured ? '' : ' text-muted'}` }, richText(step.description)),
    ]),
    h('ul', { className: `dot-list ${style.dots}`.trim() }, (step.bullets ?? []).map((b) => h('li', { text: b }))),
  ]);
}

export function renderEds(data) {
  const callout = data.callout;
  return [
    h('div', { className: 'container stack-2xl' }, [
      sectionHead({
        eyebrow: eyebrow(data.eyebrow),
        title: data.title,
        titleId: 'eds-title',
        intro: data.intro,
        aside: callout
          ? h('aside', { className: 'callout' }, [
              icon(callout.icon, 'icon--md text-secondary'),
              h('p', {}, [h('strong', { text: callout.title }), ` ${callout.text}`]),
            ])
          : null,
      }),
      h('ol', { className: 'steps', attrs: { 'aria-label': data.stepsLabel } }, (data.steps ?? []).map(renderStep)),
    ]),
  ];
}

import type { FaqConfig, FaqStyleOption, FaqItem, FaqHarmony } from '../_types';

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  { id: 1, question: '', answer: '' },
];

export const FAQ_STYLES: FaqStyleOption[] = [
  { id: 'accordion', label: 'Accordion' },
  { id: 'cards', label: 'Cards' },
  { id: 'two-column', label: '2 Cột' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'tabbed', label: 'Tabbed' },
];

export const DEFAULT_FAQ_HARMONY: FaqHarmony = 'analogous';

export const FAQ_HARMONY_OPTIONS: Array<{ value: FaqHarmony; label: string }> = [
  { value: 'analogous', label: 'Analogous (+30°)' },
  { value: 'complementary', label: 'Complementary (180°)' },
  { value: 'triadic', label: 'Triadic (120°)' },
];

export const DEFAULT_FAQ_CONFIG: FaqConfig = {
  description: '',
  buttonText: '',
  buttonLink: '',
  harmony: DEFAULT_FAQ_HARMONY,
};

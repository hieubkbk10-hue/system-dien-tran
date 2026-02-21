import type {
  ClientsConfig,
  ClientsHarmony,
  ClientsStyle,
} from '../_types';

export const CLIENTS_STYLES: Array<{ id: ClientsStyle; label: string }> = [
  { id: 'simpleGrid', label: 'Simple Grid' },
  { id: 'compactInline', label: 'Compact Inline' },
  { id: 'subtleMarquee', label: 'Subtle Marquee' },
  { id: 'grid', label: 'Grid' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'featured', label: 'Featured' },
];

export const DEFAULT_CLIENTS_HARMONY: ClientsHarmony = 'analogous';

export const normalizeClientsHarmony = (value?: string): ClientsHarmony => {
  if (value === 'analogous' || value === 'complementary' || value === 'triadic') {
    return value;
  }
  return DEFAULT_CLIENTS_HARMONY;
};

export const DEFAULT_CLIENTS_CONFIG: ClientsConfig = {
  items: [
    {
      link: '',
      name: '',
      url: '',
    },
  ],
  style: 'simpleGrid',
  harmony: DEFAULT_CLIENTS_HARMONY,
};

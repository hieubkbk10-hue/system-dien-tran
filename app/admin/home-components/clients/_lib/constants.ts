import type {
  ClientsConfig,
  ClientsHarmony,
  ClientsStyle,
} from '../_types';

export const CLIENTS_STYLES: Array<{ id: ClientsStyle; label: string }> = [
  { id: 'bento', label: 'Bento Grid' },
  { id: 'staggered', label: 'Staggered' },
  { id: 'spotlight', label: 'Spotlight' },
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
  style: 'bento',
  harmony: DEFAULT_CLIENTS_HARMONY,
};

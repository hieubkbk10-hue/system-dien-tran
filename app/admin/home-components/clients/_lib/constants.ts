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
  texts: {
    simpleGrid: {
      subtitle: 'Được tin tưởng bởi',
      heading: 'Khách hàng tin tưởng',
    },
    compactInline: {
      heading: 'Khách hàng tin tưởng',
    },
    subtleMarquee: {
      subtitle: 'Đối tác',
    },
    grid: {
      heading: 'Khách hàng tin tưởng',
      countLabel: 'đối tác',
    },
    carousel: {
      heading: 'Khách hàng tin tưởng',
      scrollHint: 'Vuốt để xem thêm',
    },
    featured: {
      heading: 'Khách hàng tin tưởng',
      subtitle: 'Được tin tưởng bởi các thương hiệu hàng đầu',
      othersLabel: 'Và nhiều đối tác khác',
    },
  },
};

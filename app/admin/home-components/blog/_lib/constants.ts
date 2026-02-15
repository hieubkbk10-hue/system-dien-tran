import type { BlogConfig } from '../_types';

export const BLOG_STYLES = [
  { id: 'grid', label: 'Grid' },
  { id: 'list', label: 'List' },
  { id: 'featured', label: 'Featured' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'minimal', label: 'Minimal' }
];

export const DEFAULT_BLOG_CONFIG: BlogConfig = {
  itemCount: 8,
  selectedPostIds: [],
  selectionMode: 'auto',
  sortBy: 'newest',
  style: 'grid'
};

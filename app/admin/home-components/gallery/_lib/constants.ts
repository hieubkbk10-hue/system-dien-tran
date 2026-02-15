'use client';

import type { GalleryItem } from '../_types';

export const GALLERY_STYLES = [
  { id: 'spotlight' as const, label: 'Tiêu điểm' },
  { id: 'explore' as const, label: 'Khám phá' },
  { id: 'stories' as const, label: 'Câu chuyện' },
  { id: 'grid' as const, label: 'Grid' },
  { id: 'marquee' as const, label: 'Marquee' },
  { id: 'masonry' as const, label: 'Masonry' },
];

export const TRUST_BADGES_STYLES = [
  { id: 'grid' as const, label: 'Grid' },
  { id: 'cards' as const, label: 'Cards' },
  { id: 'marquee' as const, label: 'Marquee' },
  { id: 'wall' as const, label: 'Wall' },
  { id: 'carousel' as const, label: 'Carousel' },
  { id: 'featured' as const, label: 'Featured' },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  { id: 'item-1', link: '', name: '', url: '' },
  { id: 'item-2', link: '', name: '', url: '' },
];

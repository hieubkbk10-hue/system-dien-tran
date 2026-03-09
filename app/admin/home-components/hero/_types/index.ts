'use client';

import type { ImageItem } from '../../../components/MultiImageUploader';

export type HeroStyle = 'slider' | 'fade' | 'bento' | 'fullscreen' | 'split' | 'parallax';
export type HeroHarmony = 'analogous' | 'complementary' | 'triadic';

export interface HeroContent {
  badge?: string;
  heading?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  countdownText?: string;
  showFullscreenContent?: boolean;
}

export interface HeroSlide extends ImageItem {
  id: string | number;
  url: string;
  link: string;
}


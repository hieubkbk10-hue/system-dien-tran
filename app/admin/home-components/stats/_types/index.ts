'use client';

export type StatsStyle = 'horizontal' | 'cards' | 'icons' | 'gradient' | 'minimal' | 'counter';

export interface StatsItem {
  value: string;
  label: string;
}

export interface StatsContent {
  items: StatsItem[];
  style: StatsStyle;
}

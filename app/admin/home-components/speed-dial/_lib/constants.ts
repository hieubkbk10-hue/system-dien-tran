import { normalizeSpeedDialHarmony } from './colors';
import type { SpeedDialConfig, SpeedDialHarmony, SpeedDialStyle } from '../_types';

export const DEFAULT_SPEED_DIAL_HARMONY: SpeedDialHarmony = normalizeSpeedDialHarmony('analogous');

export const SPEED_DIAL_STYLES: Array<{ id: SpeedDialStyle; label: string }> = [
  { id: 'fab', label: 'FAB' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'pills', label: 'Pills' },
  { id: 'stack', label: 'Stack' },
  { id: 'dock', label: 'Dock' },
  { id: 'minimal', label: 'Minimal' },
];

export const normalizeSpeedDialStyle = (value?: string): SpeedDialStyle => {
  if (value === 'fab' || value === 'sidebar' || value === 'pills' || value === 'stack' || value === 'dock' || value === 'minimal') {
    return value;
  }
  return 'fab';
};

export const DEFAULT_SPEED_DIAL_CONFIG: SpeedDialConfig = {
  actions: [
    {
      id: 'default-1',
      bgColor: '#3b82f6',
      icon: 'phone',
      label: '',
      url: '',
    },
  ],
  harmony: DEFAULT_SPEED_DIAL_HARMONY,
  position: 'bottom-right',
  style: 'fab',
};

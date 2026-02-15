import type { SpeedDialConfig } from '../_types';

export const DEFAULT_SPEED_DIAL_CONFIG: SpeedDialConfig = {
  actions: [
    {
      bgColor: '#111827',
      icon: 'phone',
      label: '',
      url: '',
    },
  ],
  alwaysOpen: false,
  mainButtonColor: '#111827',
  position: 'bottom-right',
  style: 'fab',
};

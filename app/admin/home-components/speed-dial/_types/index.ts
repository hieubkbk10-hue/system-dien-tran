export interface SpeedDialAction {
  icon: string;
  label: string;
  url: string;
  bgColor: string;
}

export type SpeedDialStyle = 'fab' | 'sidebar' | 'pills' | 'stack' | 'dock' | 'minimal';

export interface SpeedDialConfig {
  actions: SpeedDialAction[];
  style: SpeedDialStyle;
  position: 'bottom-right' | 'bottom-left';
  mainButtonColor: string;
  alwaysOpen?: boolean;
}

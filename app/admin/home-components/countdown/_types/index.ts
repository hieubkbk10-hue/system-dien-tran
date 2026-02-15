export interface CountdownConfig {
  heading: string;
  subHeading: string;
  description: string;
  endDate: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  discountText: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
}

export type CountdownStyle = 'banner' | 'floating' | 'minimal' | 'split' | 'sticky' | 'popup';

export interface CountdownConfigState extends CountdownConfig {
  style: CountdownStyle;
}

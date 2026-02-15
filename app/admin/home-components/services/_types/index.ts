export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export type ServicesStyle = 'elegantGrid' | 'modernList' | 'bigNumber' | 'cards' | 'carousel' | 'timeline';

export interface ServicesConfig {
  items: ServiceItem[];
  style: ServicesStyle;
}

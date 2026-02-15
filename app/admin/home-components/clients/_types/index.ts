export interface ClientItem {
  url: string;
  link: string;
  name?: string;
}

export type ClientsStyle = 'marquee' | 'dualRow' | 'wave' | 'grid' | 'carousel' | 'featured';

export interface ClientsConfig {
  items: ClientItem[];
  style: ClientsStyle;
}

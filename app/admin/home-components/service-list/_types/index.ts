export type ServiceListStyle = 'grid' | 'bento' | 'list' | 'carousel' | 'minimal' | 'showcase';

export type ServiceSelectionMode = 'auto' | 'manual';

export interface ServiceListPreviewItem {
  id: string | number;
  name: string;
  image?: string;
  price?: string;
  description?: string;
  tag?: 'new' | 'hot';
}

export interface ServiceListConfig {
  itemCount: number;
  sortBy: string;
  selectionMode: ServiceSelectionMode;
  selectedServiceIds?: string[];
  style?: ServiceListStyle;
}

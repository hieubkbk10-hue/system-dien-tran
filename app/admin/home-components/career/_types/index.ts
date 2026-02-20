export interface JobPosition {
  id?: string | number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
}

export type CareerStyle = 'cards' | 'list' | 'minimal' | 'table' | 'featured' | 'timeline';

export type CareerBrandMode = 'single' | 'dual';

export type CareerHarmony = 'analogous' | 'complementary' | 'triadic';

export interface CareerConfig {
  jobs: JobPosition[];
  style: CareerStyle;
  harmony?: CareerHarmony;
}

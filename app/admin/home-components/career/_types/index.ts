export interface JobPosition {
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
}

export type CareerStyle = 'cards' | 'list' | 'minimal' | 'table' | 'featured' | 'timeline';

export interface CareerConfig {
  jobs: JobPosition[];
  style: CareerStyle;
}

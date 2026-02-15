export interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export type FaqStyle = 'accordion' | 'cards' | 'two-column' | 'minimal' | 'timeline' | 'tabbed';

export interface FaqConfig {
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

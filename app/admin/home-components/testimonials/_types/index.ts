export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export type TestimonialsStyle = 'cards' | 'carousel' | 'grid' | 'masonry' | 'minimal' | 'highlight';

export interface TestimonialsConfig {
  items: TestimonialItem[];
  style: TestimonialsStyle;
}

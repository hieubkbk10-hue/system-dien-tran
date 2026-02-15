'use client';

export type CaseStudyStyle = 'grid' | 'featured' | 'list' | 'masonry' | 'carousel' | 'timeline';

export interface CaseStudyProject {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
  link: string;
}

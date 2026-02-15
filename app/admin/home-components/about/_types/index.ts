export interface AboutStat {
  value: string;
  label: string;
}

export type AboutStyle = 'classic' | 'bento' | 'minimal' | 'split' | 'timeline' | 'showcase';

export interface AboutConfig {
  layout?: string;
  subHeading: string;
  heading: string;
  description: string;
  image: string;
  stats: AboutStat[];
  buttonText: string;
  buttonLink: string;
  style?: AboutStyle;
  imageCaption?: string;
}

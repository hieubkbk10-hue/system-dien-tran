export type VideoStyle = 'centered' | 'split' | 'fullwidth' | 'cinema' | 'minimal' | 'parallax';

export interface VideoConfig {
  videoUrl: string;
  thumbnailUrl?: string;
  heading?: string;
  description?: string;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  style?: VideoStyle;
}

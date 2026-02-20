export type VideoStyle = 'centered' | 'split' | 'fullwidth' | 'cinema' | 'minimal' | 'parallax';

export type VideoBrandMode = 'single' | 'dual';
export type VideoHarmony = 'analogous' | 'complementary' | 'triadic';
export type VideoProvider = 'youtube' | 'vimeo' | 'drive' | 'direct';

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
  harmony?: VideoHarmony;
}

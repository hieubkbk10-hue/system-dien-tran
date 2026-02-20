import type { VideoBrandMode, VideoConfig, VideoHarmony, VideoStyle } from '../_types';

export const VIDEO_STYLES: Array<{ id: VideoStyle; label: string }> = [
  { id: 'centered', label: 'Centered' },
  { id: 'split', label: 'Split' },
  { id: 'fullwidth', label: 'Fullwidth' },
  { id: 'cinema', label: 'Cinema' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'parallax', label: 'Parallax' },
];

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  videoUrl: '',
  thumbnailUrl: '',
  heading: '',
  description: '',
  badge: '',
  buttonText: '',
  buttonLink: '',
  autoplay: false,
  loop: false,
  muted: true,
  style: 'centered',
  harmony: 'analogous',
};

export const VIDEO_STYLES_WITH_CTA: VideoStyle[] = ['split', 'fullwidth', 'cinema', 'minimal', 'parallax'];

export const DEFAULT_VIDEO_STYLE: VideoStyle = 'centered';
export const DEFAULT_VIDEO_HARMONY: VideoHarmony = 'analogous';

export const normalizeVideoStyle = (value?: string): VideoStyle => {
  if (VIDEO_STYLES.some((style) => style.id === value)) {
    return value as VideoStyle;
  }

  return DEFAULT_VIDEO_STYLE;
};

export const normalizeVideoHarmony = (value?: string): VideoHarmony => {
  if (value === 'analogous' || value === 'complementary' || value === 'triadic') {
    return value;
  }

  return DEFAULT_VIDEO_HARMONY;
};

const toText = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const toBoolean = (value: unknown, fallback = false) => (typeof value === 'boolean' ? value : fallback);

const ensureText = (value: string, max = 300) => value.trim().slice(0, max);

export const normalizeVideoConfig = (raw: unknown): VideoConfig => {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Partial<VideoConfig>;

  return {
    videoUrl: ensureText(toText(source.videoUrl, ''), 2048),
    thumbnailUrl: ensureText(toText(source.thumbnailUrl, ''), 2048),
    heading: ensureText(toText(source.heading, ''), 160),
    description: ensureText(toText(source.description, ''), 600),
    badge: ensureText(toText(source.badge, ''), 120),
    buttonText: ensureText(toText(source.buttonText, ''), 80),
    buttonLink: ensureText(toText(source.buttonLink, ''), 512),
    autoplay: toBoolean(source.autoplay, false),
    loop: toBoolean(source.loop, false),
    muted: toBoolean(source.muted, true),
    style: normalizeVideoStyle(source.style),
    harmony: normalizeVideoHarmony(source.harmony),
  };
};

export const getVideoConfigWithMode = (
  config: VideoConfig,
  _mode: VideoBrandMode,
): VideoConfig => {
  return {
    ...config,
    harmony: normalizeVideoHarmony(config.harmony),
  };
};

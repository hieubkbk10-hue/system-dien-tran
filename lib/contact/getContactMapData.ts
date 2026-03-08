export type ContactMapProvider = 'openstreetmap' | 'google_embed';

export type ContactMapData = {
  address: string;
  lat: number;
  lng: number;
  mapProvider: ContactMapProvider;
  googleMapEmbedIframe: string;
};

const DEFAULT_LAT = 10.762622;
const DEFAULT_LNG = 106.660172;

const coerceNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const coerceString = (value: unknown) => (typeof value === 'string' ? value : '');

export const getContactMapDataFromSettings = (
  settings?: Array<{ key: string; value: string | number | boolean }>
): ContactMapData => {
  const map: Record<string, string | number | boolean> = {};
  settings?.forEach((item) => {
    map[item.key] = item.value;
  });

  const mapProvider: ContactMapProvider = map.contact_map_provider === 'google_embed'
    ? 'google_embed'
    : 'openstreetmap';

  return {
    address: coerceString(map.contact_address),
    lat: coerceNumber(map.contact_lat, DEFAULT_LAT),
    lng: coerceNumber(map.contact_lng, DEFAULT_LNG),
    mapProvider,
    googleMapEmbedIframe: coerceString(map.contact_google_map_embed_iframe),
  };
};

export const sanitizeGoogleMapIframe = (html: string) => {
  const trimmed = html.trim();
  if (!trimmed.includes('<iframe') || !trimmed.includes('</iframe>')) {
    return '';
  }
  return trimmed
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '');
};

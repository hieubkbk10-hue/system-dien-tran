import type { ContactConfigState, ContactHarmony, ContactStyle } from '../_types';

export const CONTACT_HARMONY_OPTIONS: ReadonlyArray<ContactHarmony> = ['analogous', 'complementary', 'triadic'];

export const DEFAULT_CONTACT_HARMONY: ContactHarmony = 'analogous';

export const normalizeContactHarmony = (value: unknown): ContactHarmony => {
  if (typeof value === 'string' && CONTACT_HARMONY_OPTIONS.includes(value as ContactHarmony)) {
    return value as ContactHarmony;
  }

  return DEFAULT_CONTACT_HARMONY;
};

export const CONTACT_STYLES: Array<{ id: ContactStyle; label: string }> = [
  { id: 'modern', label: 'Modern Split' },
  { id: 'floating', label: 'Floating Card' },
  { id: 'grid', label: 'Grid Cards' },
  { id: 'elegant', label: 'Elegant Clean' },
  { id: 'minimal', label: 'Minimal Form' },
  { id: 'centered', label: 'Centered' },
];

export const DEFAULT_CONTACT_CONFIG: ContactConfigState = {
  address: '',
  email: '',
  formDescription: '',
  formFields: ['name', 'email', 'phone', 'message'],
  formTitle: '',
  mapEmbed: '',
  phone: '',
  responseTimeText: '',
  showMap: true,
  socialLinks: [],
  submitButtonText: '',
  workingHours: '',
  style: 'modern',
  harmony: DEFAULT_CONTACT_HARMONY,
};

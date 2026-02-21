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
  texts: {},
};

export const DEFAULT_CONTACT_TEXTS: Record<ContactStyle, Record<string, string>> = {
  modern: {
    badge: 'Thông tin liên hệ',
    heading: 'Kết nối với chúng tôi',
    addressLabel: 'Địa chỉ văn phòng',
    contactLabel: 'Email & Điện thoại',
    hoursLabel: 'Giờ làm việc',
  },
  floating: {
    heading: 'Thông tin liên hệ',
    addressLabel: 'Địa chỉ',
    phoneLabel: 'Hotline',
    emailLabel: 'Email',
    hoursLabel: 'Giờ làm việc',
  },
  grid: {
    phoneLabel: 'Điện thoại',
    emailLabel: 'Email',
    hoursLabel: 'Giờ làm việc',
    addressHeading: 'Trụ sở chính',
  },
  elegant: {
    heading: 'Văn phòng của chúng tôi',
    description: 'Thông tin liên hệ và vị trí bản đồ chính xác.',
    addressLabel: 'Địa chỉ',
    contactLabel: 'Liên lạc',
    hoursLabel: 'Thời gian',
  },
  minimal: {
    phoneLabel: 'Điện thoại',
    emailLabel: 'Email',
    addressLabel: 'Địa chỉ',
    hoursLabel: 'Giờ làm việc',
  },
  centered: {
    phoneLabel: 'Hotline',
    emailLabel: 'Email',
    hoursLabel: 'Giờ làm việc',
    addressLabel: 'Địa chỉ văn phòng',
  },
};

export const TEXT_FIELDS: Record<ContactStyle, Array<{ key: string; label: string; placeholder: string }>> = {
  modern: [
    { key: 'badge', label: 'Text badge', placeholder: 'Thông tin liên hệ' },
    { key: 'heading', label: 'Tiêu đề chính', placeholder: 'Kết nối với chúng tôi' },
    { key: 'addressLabel', label: 'Label địa chỉ', placeholder: 'Địa chỉ văn phòng' },
    { key: 'contactLabel', label: 'Label liên lạc', placeholder: 'Email & Điện thoại' },
    { key: 'hoursLabel', label: 'Label giờ làm việc', placeholder: 'Giờ làm việc' },
  ],
  floating: [
    { key: 'heading', label: 'Tiêu đề', placeholder: 'Thông tin liên hệ' },
    { key: 'addressLabel', label: 'Label địa chỉ', placeholder: 'Địa chỉ' },
    { key: 'phoneLabel', label: 'Label điện thoại', placeholder: 'Hotline' },
    { key: 'emailLabel', label: 'Label email', placeholder: 'Email' },
    { key: 'hoursLabel', label: 'Label giờ làm việc', placeholder: 'Giờ làm việc' },
  ],
  grid: [
    { key: 'phoneLabel', label: 'Label điện thoại', placeholder: 'Điện thoại' },
    { key: 'emailLabel', label: 'Label email', placeholder: 'Email' },
    { key: 'hoursLabel', label: 'Label giờ làm việc', placeholder: 'Giờ làm việc' },
    { key: 'addressHeading', label: 'Tiêu đề địa chỉ', placeholder: 'Trụ sở chính' },
  ],
  elegant: [
    { key: 'heading', label: 'Tiêu đề', placeholder: 'Văn phòng của chúng tôi' },
    { key: 'description', label: 'Mô tả', placeholder: 'Thông tin liên hệ và vị trí bản đồ chính xác.' },
    { key: 'addressLabel', label: 'Label địa chỉ', placeholder: 'Địa chỉ' },
    { key: 'contactLabel', label: 'Label liên lạc', placeholder: 'Liên lạc' },
    { key: 'hoursLabel', label: 'Label thời gian', placeholder: 'Thời gian' },
  ],
  minimal: [
    { key: 'phoneLabel', label: 'Label điện thoại', placeholder: 'Điện thoại' },
    { key: 'emailLabel', label: 'Label email', placeholder: 'Email' },
    { key: 'addressLabel', label: 'Label địa chỉ', placeholder: 'Địa chỉ' },
    { key: 'hoursLabel', label: 'Label giờ làm việc', placeholder: 'Giờ làm việc' },
  ],
  centered: [
    { key: 'phoneLabel', label: 'Label điện thoại', placeholder: 'Hotline' },
    { key: 'emailLabel', label: 'Label email', placeholder: 'Email' },
    { key: 'hoursLabel', label: 'Label giờ làm việc', placeholder: 'Giờ làm việc' },
    { key: 'addressLabel', label: 'Label địa chỉ', placeholder: 'Địa chỉ văn phòng' },
  ],
};

import type { ContactConfigState, ContactStyle } from '../_types';

export const CONTACT_STYLES: Array<{ id: ContactStyle; label: string }> = [
  { id: 'modern', label: 'Modern Split' },
  { id: 'floating', label: 'Executive Panel' },
  { id: 'grid', label: 'Grid Cards' },
  { id: 'elegant', label: 'Elegant Clean' },
  { id: 'minimal', label: 'Minimal Form' },
  { id: 'centered', label: 'Balanced Split' },
];

export const DEFAULT_CONTACT_CONFIG: ContactConfigState = {
  address: '',
  email: '',
  formDescription: '',
  formFields: ['name', 'email', 'phone', 'subject', 'message'],
  formTitle: '',
  mapEmbed: '',
  phone: '',
  responseTimeText: '',
  showMap: true,
  showForm: true,
  socialLinks: [],
  submitButtonText: '',
  workingHours: '',
  style: 'modern',
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
    { key: 'badge', label: 'Badge hiển thị', placeholder: 'Thông tin liên hệ' },
    { key: 'heading', label: 'Heading hiển thị', placeholder: 'Kết nối với chúng tôi' },
    { key: 'addressLabel', label: 'Nhãn địa chỉ', placeholder: 'Địa chỉ văn phòng' },
    { key: 'contactLabel', label: 'Nhãn liên lạc', placeholder: 'Email & Điện thoại' },
    { key: 'hoursLabel', label: 'Nhãn giờ làm việc', placeholder: 'Giờ làm việc' },
  ],
  floating: [
    { key: 'heading', label: 'Heading hiển thị', placeholder: 'Thông tin liên hệ' },
    { key: 'addressLabel', label: 'Nhãn địa chỉ', placeholder: 'Địa chỉ' },
    { key: 'phoneLabel', label: 'Nhãn điện thoại', placeholder: 'Hotline' },
    { key: 'emailLabel', label: 'Nhãn email', placeholder: 'Email' },
    { key: 'hoursLabel', label: 'Nhãn giờ làm việc', placeholder: 'Giờ làm việc' },
  ],
  grid: [
    { key: 'phoneLabel', label: 'Nhãn điện thoại', placeholder: 'Điện thoại' },
    { key: 'emailLabel', label: 'Nhãn email', placeholder: 'Email' },
    { key: 'hoursLabel', label: 'Nhãn giờ làm việc', placeholder: 'Giờ làm việc' },
    { key: 'addressHeading', label: 'Heading địa chỉ', placeholder: 'Trụ sở chính' },
  ],
  elegant: [
    { key: 'heading', label: 'Heading hiển thị', placeholder: 'Văn phòng của chúng tôi' },
    { key: 'description', label: 'Mô tả', placeholder: 'Thông tin liên hệ và vị trí bản đồ chính xác.' },
    { key: 'addressLabel', label: 'Nhãn địa chỉ', placeholder: 'Địa chỉ' },
    { key: 'contactLabel', label: 'Nhãn liên lạc', placeholder: 'Liên lạc' },
    { key: 'hoursLabel', label: 'Nhãn thời gian', placeholder: 'Thời gian' },
  ],
  minimal: [
    { key: 'phoneLabel', label: 'Nhãn điện thoại', placeholder: 'Điện thoại' },
    { key: 'emailLabel', label: 'Nhãn email', placeholder: 'Email' },
    { key: 'addressLabel', label: 'Nhãn địa chỉ', placeholder: 'Địa chỉ' },
    { key: 'hoursLabel', label: 'Nhãn giờ làm việc', placeholder: 'Giờ làm việc' },
  ],
  centered: [
    { key: 'phoneLabel', label: 'Nhãn điện thoại', placeholder: 'Hotline' },
    { key: 'emailLabel', label: 'Nhãn email', placeholder: 'Email' },
    { key: 'hoursLabel', label: 'Nhãn giờ làm việc', placeholder: 'Giờ làm việc' },
    { key: 'addressLabel', label: 'Nhãn địa chỉ', placeholder: 'Địa chỉ văn phòng' },
  ],
};

export interface ContactSocialLink {
  id: number;
  platform: string;
  url: string;
}

export type ContactStyle = 'modern' | 'floating' | 'grid' | 'elegant' | 'minimal' | 'centered';

export type ContactBrandMode = 'single' | 'dual';

export type ContactHarmony = 'analogous' | 'complementary' | 'triadic';

export interface ContactConfig {
  showMap: boolean;
  mapEmbed: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  formFields: string[];
  socialLinks: ContactSocialLink[];
  showForm?: boolean;
  formTitle?: string;
  formDescription?: string;
  submitButtonText?: string;
  responseTimeText?: string;
  harmony?: ContactHarmony;
  texts?: Record<string, string>;
}

export interface ContactConfigState extends ContactConfig {
  style: ContactStyle;
}

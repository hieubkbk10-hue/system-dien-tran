'use client';

import React from 'react';
import {
  Building2,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import { cn } from '../../../components/ui';
import { ContactInquiryForm } from '@/components/contact/ContactInquiryForm';
import OpenStreetMapDisplay from '@/components/maps/OpenStreetMapDisplay';
import { sanitizeGoogleMapIframe, type ContactMapData } from '@/lib/contact/getContactMapData';
import type { PreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type {
  ContactBrandMode,
  ContactConfigState,
  ContactSocialLink,
  ContactStyle,
} from '../_types';
import type { ContactColorTokens } from '../_lib/colors';
import { DEFAULT_CONTACT_TEXTS } from '../_lib/constants';

type ContactSectionContext = 'preview' | 'site';

interface ContactSectionSharedProps {
  config: ContactConfigState;
  style: ContactStyle;
  tokens: ContactColorTokens;
  mode: ContactBrandMode;
  context: ContactSectionContext;
  device?: PreviewDevice;
  title?: string;
  mapData?: ContactMapData;
  sourcePath?: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  zalo: MessageCircle,
};

const getSocialIconComponent = (platform: string) => iconMap[platform.toLowerCase()] ?? Globe;

const getDisplayDevice = (context: ContactSectionContext, device?: PreviewDevice): PreviewDevice => {
  if (context === 'site') {return 'desktop';}
  return device ?? 'desktop';
};

const getSectionPadding = (context: ContactSectionContext, currentDevice: PreviewDevice) => {
  if (context === 'site') {return 'py-12 md:py-16 px-4';}
  return currentDevice === 'mobile' ? 'py-6 px-3' : 'py-8 px-4';
};

const getRootContainerClass = (context: ContactSectionContext, currentDevice: PreviewDevice) => {
  if (context === 'site') {return 'max-w-6xl mx-auto';}
  if (currentDevice === 'mobile') {return 'w-full';}
  if (currentDevice === 'tablet') {return 'max-w-3xl mx-auto';}
  return 'max-w-5xl mx-auto';
};

const MAP_HEIGHT_HERO = 'min-h-[320px] md:min-h-[360px]';
const MAP_HEIGHT_STANDARD = 'min-h-[240px] md:min-h-[280px]';
const MAP_HEIGHT_COMPACT = 'min-h-[200px] md:min-h-[220px]';

const getInfo = (config: ContactConfigState, title?: string) => {
  const texts = config.texts ?? {};
  const defaultTexts = DEFAULT_CONTACT_TEXTS[config.style] ?? {};
  
  const heading = (config.formTitle ?? title)?.trim() || 'Liên hệ với chúng tôi';
  const description = config.formDescription?.trim() || 'Chúng tôi luôn sẵn sàng hỗ trợ bạn';
  const submitLabel = config.submitButtonText?.trim() || 'Gửi yêu cầu';
  const responseText = config.responseTimeText?.trim() || 'Phản hồi trong 24h';
  const subjectFallback = heading || title || 'Liên hệ từ website';

  return {
    heading,
    description,
    submitLabel,
    responseText,
    subjectFallback,
    address: config.address?.trim() || '123 Nguyễn Huệ, Q1, TP.HCM',
    phone: config.phone?.trim() || '1900 1234',
    email: config.email?.trim() || 'contact@example.com',
    workingHours: config.workingHours?.trim() || 'Thứ 2 - Thứ 6: 8:00 - 17:00',
    texts: {
      badge: texts.badge || defaultTexts.badge || 'Thông tin liên hệ',
      heading: texts.heading || defaultTexts.heading || 'Kết nối với chúng tôi',
      addressLabel: texts.addressLabel || defaultTexts.addressLabel || 'Địa chỉ văn phòng',
      contactLabel: texts.contactLabel || defaultTexts.contactLabel || 'Email & Điện thoại',
      hoursLabel: texts.hoursLabel || defaultTexts.hoursLabel || 'Giờ làm việc',
      phoneLabel: texts.phoneLabel || defaultTexts.phoneLabel || 'Điện thoại',
      emailLabel: texts.emailLabel || defaultTexts.emailLabel || 'Email',
      addressHeading: texts.addressHeading || defaultTexts.addressHeading || 'Trụ sở chính',
      description: texts.description || defaultTexts.description || 'Thông tin liên hệ và vị trí bản đồ chính xác.',
    },
  };
};

const renderMapOrPlaceholder = ({
  mapData,
  fallbackEmbed,
  tokens,
  isPreview,
  className = 'w-full h-full',
}: {
  mapData?: ContactMapData;
  fallbackEmbed?: string;
  tokens: ContactColorTokens;
  isPreview: boolean;
  className?: string;
}) => {
  const sanitizedIframe = mapData?.mapProvider === 'google_embed'
    ? sanitizeGoogleMapIframe(mapData.googleMapEmbedIframe)
    : '';

  if (mapData?.mapProvider === 'google_embed' && sanitizedIframe) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedIframe }}
      />
    );
  }

  if (mapData?.mapProvider === 'openstreetmap') {
    return (
      <div className={className}>
        <OpenStreetMapDisplay
          location={{
            address: mapData.address || 'Vị trí doanh nghiệp',
            lat: mapData.lat,
            lng: mapData.lng,
          }}
          height="100%"
          zoom={15}
        />
      </div>
    );
  }

  if (fallbackEmbed) {
    return <iframe src={fallbackEmbed} className={`${className} border-0`} loading="lazy" title="Google Map" />;
  }

  return (
    <div className={cn(className, 'flex flex-col items-center justify-center text-center gap-2')} style={{ backgroundColor: tokens.mapPlaceholderBg, color: tokens.mapPlaceholderIcon }}>
      <MapPin size={32} />
      <span className="text-xs">Chưa có bản đồ</span>
      {isPreview && (
        <a
          href="/admin/settings"
          className="text-xs font-medium underline"
          style={{ color: tokens.primary }}
        >
          Cấu hình trong Settings
        </a>
      )}
    </div>
  );
};

const IconBadge = ({
  icon,
  tokens,
  size = 18,
  className,
}: {
  icon: React.ReactNode;
  tokens: ContactColorTokens;
  size?: number;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-full flex items-center justify-center shrink-0',
      size >= 24 ? 'w-12 h-12' : size >= 20 ? 'w-10 h-10' : 'w-9 h-9',
      className,
    )}
    style={{ backgroundColor: tokens.iconTintBackground, color: tokens.iconTintColor }}
  >
    {icon}
  </div>
);

const ContactSocialLinks = ({
  socials,
  tokens,
  size = 18,
  centered = false,
}: {
  socials: ContactSocialLink[];
  tokens: ContactColorTokens;
  size?: number;
  centered?: boolean;
}) => {
  if (socials.length === 0) {return null;}

  return (
    <div className={cn('flex items-center gap-2', centered && 'justify-center')}>
      {socials.map((social, idx) => {
        const Icon = getSocialIconComponent(social.platform);
        return (
          <a
            key={`${social.id}-${social.platform}-${idx}`}
            href={social.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors"
            style={{
              backgroundColor: tokens.socialBackground,
              borderColor: tokens.socialBorder,
              color: tokens.socialIcon,
            }}
            aria-label={social.platform || 'social'}
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
};

const renderModern = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
  mapData,
  sourcePath,
  isPreview,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
  mapData?: ContactMapData;
  sourcePath?: string;
  isPreview: boolean;
}) => (
  <div
    className="rounded-xl overflow-hidden border shadow-sm"
    style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}
  >
    <div className={cn('flex min-h-[380px]', currentDevice === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row')}>
      <div className={cn('p-6 lg:p-10 flex flex-col justify-center gap-6', currentDevice === 'mobile' ? 'w-full' : 'lg:w-1/2')}>
        <div className="max-w-md mx-auto w-full">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border mb-4"
            style={{
              backgroundColor: tokens.sectionBadgeBg,
              color: tokens.sectionBadgeText,
              borderColor: tokens.sectionBadgeBorder,
            }}
          >
            {info.texts.badge}
          </div>
          <h2 className={cn('font-bold tracking-tight mb-6', currentDevice === 'mobile' ? 'text-xl' : 'text-2xl')} style={{ color: tokens.heading }}>
            {info.texts.heading}
          </h2>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <IconBadge icon={<MapPin size={16} />} tokens={tokens} className="mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-0.5" style={{ color: tokens.labelText }}>{info.texts.addressLabel}</h4>
                <p className="text-sm leading-relaxed" style={{ color: tokens.valueText }}>{info.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge icon={<Mail size={16} />} tokens={tokens} className="mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-0.5" style={{ color: tokens.labelText }}>{info.texts.contactLabel}</h4>
                <p className="text-sm" style={{ color: tokens.valueText }}>{info.email}</p>
                <p className="text-sm mt-0.5" style={{ color: tokens.valueText }}>{info.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconBadge icon={<Clock size={16} />} tokens={tokens} className="mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-0.5" style={{ color: tokens.labelText }}>{info.texts.hoursLabel}</h4>
                <p className="text-sm" style={{ color: tokens.valueText }}>{info.workingHours}</p>
              </div>
            </div>
          </div>

          {activeSocials.length > 0 && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: tokens.neutralBorder }}>
              <ContactSocialLinks socials={activeSocials} tokens={tokens} />
            </div>
          )}
        </div>

        {config.showForm && (
          <div className="w-full">
            <ContactInquiryForm
              brandColor={tokens.primary}
              secondaryColor={tokens.secondary}
              title={info.heading}
              description={info.description}
              submitLabel={info.submitLabel}
              responseTimeText={info.responseText}
              fields={config.formFields}
              tokens={tokens}
              sourcePath={sourcePath}
              subjectFallback={info.subjectFallback}
              isPreview={isPreview}
            />
          </div>
        )}
      </div>

      {config.showMap && (
        <div
          className={cn(
            'relative border-t lg:border-t-0 lg:border-l',
            currentDevice === 'mobile' ? `w-full ${MAP_HEIGHT_STANDARD}` : `lg:w-1/2 ${MAP_HEIGHT_HERO}`,
          )}
          style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.mapPlaceholderBg }}
        >
          {renderMapOrPlaceholder({ mapData, fallbackEmbed: config.mapEmbed, tokens, className: 'absolute inset-0', isPreview })}
        </div>
      )}
    </div>
  </div>
);

const renderFloating = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
  mapData,
  sourcePath,
  isPreview,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
  mapData?: ContactMapData;
  sourcePath?: string;
  isPreview: boolean;
}) => (
  <div
    className={cn('w-full rounded-xl overflow-hidden border shadow-sm', currentDevice === 'mobile' ? 'min-h-[520px]' : 'min-h-[460px]')}
    style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}
  >
    <div className={cn('grid gap-6 p-6 lg:p-8', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-[1fr,1fr]')}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold" style={{ color: tokens.heading }}>{info.texts.heading}</h2>
          <p className="text-sm" style={{ color: tokens.helperText }}>{info.texts.description}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <IconBadge icon={<MapPin size={16} />} tokens={tokens} className="mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase" style={{ color: tokens.labelText }}>{info.texts.addressLabel}</p>
              <p className="text-sm" style={{ color: tokens.valueText }}>{info.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconBadge icon={<Phone size={16} />} tokens={tokens} className="mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase" style={{ color: tokens.labelText }}>{info.texts.phoneLabel}</p>
              <p className="text-sm" style={{ color: tokens.valueText }}>{info.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconBadge icon={<Mail size={16} />} tokens={tokens} className="mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase" style={{ color: tokens.labelText }}>{info.texts.emailLabel}</p>
              <p className="text-sm" style={{ color: tokens.valueText }}>{info.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconBadge icon={<Clock size={16} />} tokens={tokens} className="mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase" style={{ color: tokens.labelText }}>{info.texts.hoursLabel}</p>
              <p className="text-sm" style={{ color: tokens.valueText }}>{info.workingHours}</p>
            </div>
          </div>
        </div>

        {activeSocials.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: tokens.neutralBorder }}>
            <ContactSocialLinks socials={activeSocials} tokens={tokens} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {config.showForm && (
          <ContactInquiryForm
            brandColor={tokens.primary}
            secondaryColor={tokens.secondary}
            title={info.heading}
            description={info.description}
            submitLabel={info.submitLabel}
            responseTimeText={info.responseText}
            fields={config.formFields}
            tokens={tokens}
            sourcePath={sourcePath}
            subjectFallback={info.subjectFallback}
            isPreview={isPreview}
          />
        )}
        {config.showMap && (
          <div
            className={cn('relative rounded-lg overflow-hidden border', currentDevice === 'mobile' ? MAP_HEIGHT_STANDARD : MAP_HEIGHT_STANDARD)}
            style={{ borderColor: tokens.neutralBorder }}
          >
            {renderMapOrPlaceholder({ mapData, fallbackEmbed: config.mapEmbed, tokens, className: 'absolute inset-0', isPreview })}
          </div>
        )}
      </div>
    </div>
  </div>
);

const renderGrid = ({
  info,
  config,
  tokens,
  currentDevice,
  mapData,
  sourcePath,
  isPreview,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  mapData?: ContactMapData;
  sourcePath?: string;
  isPreview: boolean;
}) => (
  <div className="w-full p-6 rounded-xl border" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.neutralBackground }}>
    <div className={cn('grid gap-3 mb-6', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
      <div className="p-5 rounded-lg border flex flex-col items-center text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <IconBadge icon={<Phone size={18} />} tokens={tokens} className="mb-3" />
        <h3 className="font-medium text-sm mb-1" style={{ color: tokens.labelText }}>{info.texts.phoneLabel}</h3>
        <p className="font-semibold" style={{ color: tokens.valueText }}>{info.phone}</p>
      </div>

      <div className="p-5 rounded-lg border flex flex-col items-center text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <IconBadge icon={<Mail size={18} />} tokens={tokens} className="mb-3" />
        <h3 className="font-medium text-sm mb-1" style={{ color: tokens.labelText }}>{info.texts.emailLabel}</h3>
        <p className="font-semibold text-sm" style={{ color: tokens.valueText }}>{info.email}</p>
      </div>

      <div className="p-5 rounded-lg border flex flex-col items-center text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <IconBadge icon={<Clock size={18} />} tokens={tokens} className="mb-3" />
        <h3 className="font-medium text-sm mb-1" style={{ color: tokens.labelText }}>{info.texts.hoursLabel}</h3>
        <p className="font-semibold text-sm" style={{ color: tokens.valueText }}>{info.workingHours}</p>
      </div>
    </div>

    <div className={cn('grid gap-4', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-2')}>
      {config.showForm && (
        <div className="rounded-lg border p-4" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <ContactInquiryForm
            brandColor={tokens.primary}
            secondaryColor={tokens.secondary}
            title={info.heading}
            description={info.description}
            submitLabel={info.submitLabel}
            responseTimeText={info.responseText}
            fields={config.formFields}
            tokens={tokens}
            sourcePath={sourcePath}
            subjectFallback={info.subjectFallback}
            withContainer={false}
            isPreview={isPreview}
          />
        </div>
      )}
      <div className="rounded-lg border p-4" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="shrink-0 mt-0.5" style={{ color: tokens.secondary }} />
          <div>
            <h3 className="font-bold text-base mb-1.5" style={{ color: tokens.heading }}>{info.texts.addressHeading}</h3>
            <p className="text-sm leading-relaxed" style={{ color: tokens.valueText }}>{info.address}</p>
          </div>
        </div>
        {config.showMap && (
          <div
            className={cn('relative rounded-md overflow-hidden mt-4', currentDevice === 'mobile' ? MAP_HEIGHT_STANDARD : MAP_HEIGHT_COMPACT)}
          >
            {renderMapOrPlaceholder({ mapData, fallbackEmbed: config.mapEmbed, tokens, className: 'absolute inset-0', isPreview })}
          </div>
        )}
      </div>
    </div>
  </div>
);

const renderElegant = ({
  info,
  config,
  tokens,
  currentDevice,
  mapData,
  sourcePath,
  isPreview,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  mapData?: ContactMapData;
  sourcePath?: string;
  isPreview: boolean;
}) => (
  <div className="w-full border rounded-xl shadow-sm overflow-hidden" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
    <div className="p-6 border-b text-center" style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.neutralBackground }}>
      <div className="flex justify-center mb-3">
        <IconBadge icon={<Building2 size={22} />} tokens={tokens} size={24} />
      </div>
      <h2 className={cn('font-bold tracking-tight', currentDevice === 'mobile' ? 'text-lg' : 'text-xl')} style={{ color: tokens.heading }}>
        {info.texts.heading}
      </h2>
      <p className="mt-1.5 max-w-lg mx-auto text-sm" style={{ color: tokens.helperText }}>
        {info.texts.description}
      </p>
    </div>

    <div className={cn('flex', currentDevice === 'mobile' ? 'flex-col' : 'flex-row')}>
      <div className={cn('p-6 space-y-0 divide-y', currentDevice === 'mobile' ? 'w-full' : 'w-5/12')} style={{ borderColor: tokens.neutralBorder }}>
        <div className="py-4 first:pt-0">
          <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: tokens.labelText }}>{info.texts.addressLabel}</p>
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: tokens.secondary }} />
            <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.address}</span>
          </div>
        </div>

        <div className="py-4">
          <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: tokens.labelText }}>{info.texts.contactLabel}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0" style={{ color: tokens.secondary }} />
              <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0" style={{ color: tokens.secondary }} />
              <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.email}</span>
            </div>
          </div>
        </div>

        <div className="py-4 last:pb-0">
          <p className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: tokens.labelText }}>{info.texts.hoursLabel}</p>
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="shrink-0" style={{ color: tokens.secondary }} />
            <span className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.workingHours}</span>
          </div>
        </div>

        {config.showForm && (
          <div className="pt-6">
            <ContactInquiryForm
              brandColor={tokens.primary}
              secondaryColor={tokens.secondary}
              title={info.heading}
              description={info.description}
              submitLabel={info.submitLabel}
              responseTimeText={info.responseText}
              fields={config.formFields}
              tokens={tokens}
              sourcePath={sourcePath}
              subjectFallback={info.subjectFallback}
              isPreview={isPreview}
            />
          </div>
        )}
      </div>

      {config.showMap && (
        <div
          className={cn(
            'relative border-t md:border-t-0 md:border-l',
            currentDevice === 'mobile' ? `w-full ${MAP_HEIGHT_STANDARD}` : `w-7/12 ${MAP_HEIGHT_HERO}`,
          )}
          style={{ borderColor: tokens.neutralBorder, backgroundColor: tokens.mapPlaceholderBg }}
        >
          {renderMapOrPlaceholder({ mapData, fallbackEmbed: config.mapEmbed, tokens, className: 'absolute inset-0', isPreview })}
        </div>
      )}
    </div>
  </div>
);

const renderMinimal = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
  mapData,
  sourcePath,
  isPreview,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
  mapData?: ContactMapData;
  sourcePath?: string;
  isPreview: boolean;
}) => (
  <div className="w-full border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
    <div className="p-6 lg:p-10">
      <div className="text-center mb-8">
        <h2 className={cn('font-bold tracking-tight', currentDevice === 'mobile' ? 'text-xl' : 'text-2xl')} style={{ color: tokens.heading }}>{info.heading}</h2>
        <p className="text-sm mt-2" style={{ color: tokens.helperText }}>{info.description}</p>
      </div>
      <div className={cn('grid gap-4', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4')}>
        <a href={`tel:${info.phone}`} className="flex flex-col items-center p-5 rounded-xl border transition-colors text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<Phone size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>{info.texts.phoneLabel}</span>
          <span className="text-sm font-semibold" style={{ color: tokens.valueText }}>{info.phone}</span>
        </a>
        <a href={`mailto:${info.email}`} className="flex flex-col items-center p-5 rounded-xl border transition-colors text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<Mail size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>{info.texts.emailLabel}</span>
          <span className="text-sm font-semibold truncate max-w-full" style={{ color: tokens.valueText }}>{info.email}</span>
        </a>
        <div className="flex flex-col items-center p-5 rounded-xl border text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<MapPin size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>{info.texts.addressLabel}</span>
          <span className="text-sm font-semibold line-clamp-2" style={{ color: tokens.valueText }}>{info.address}</span>
        </div>
        <div className="flex flex-col items-center p-5 rounded-xl border text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
          <IconBadge icon={<Clock size={20} />} tokens={tokens} size={20} className="mb-3" />
          <span className="text-xs mb-1" style={{ color: tokens.labelText }}>{info.texts.hoursLabel}</span>
          <span className="text-sm font-semibold" style={{ color: tokens.valueText }}>{info.workingHours}</span>
        </div>
      </div>
      {config.showForm && (
        <div className="mb-8">
          <ContactInquiryForm
            brandColor={tokens.primary}
            secondaryColor={tokens.secondary}
            title={info.heading}
            description={info.description}
            submitLabel={info.submitLabel}
            responseTimeText={info.responseText}
            fields={config.formFields}
            tokens={tokens}
            sourcePath={sourcePath}
            subjectFallback={info.subjectFallback}
            isPreview={isPreview}
          />
        </div>
      )}
      {(activeSocials.length > 0 || config.showMap) && (
        <div className={cn('mt-8 pt-6 border-t', currentDevice === 'mobile' ? 'flex flex-col gap-4' : 'flex items-center justify-between')} style={{ borderColor: tokens.neutralBorder }}>
          <ContactSocialLinks socials={activeSocials} tokens={tokens} />
          {config.showMap && (
            <div
              className={cn(
                'relative rounded-lg overflow-hidden',
                currentDevice === 'mobile' ? 'w-full' : 'w-80',
                MAP_HEIGHT_COMPACT,
              )}
            >
              {renderMapOrPlaceholder({ mapData, fallbackEmbed: config.mapEmbed, tokens, className: 'absolute inset-0', isPreview })}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const renderCentered = ({
  info,
  config,
  tokens,
  currentDevice,
  activeSocials,
  mapData,
  sourcePath,
  isPreview,
}: {
  info: ReturnType<typeof getInfo>;
  config: ContactConfigState;
  tokens: ContactColorTokens;
  currentDevice: PreviewDevice;
  activeSocials: ContactSocialLink[];
  mapData?: ContactMapData;
  sourcePath?: string;
  isPreview: boolean;
}) => (
  <div className="w-full border rounded-xl overflow-hidden shadow-sm" style={{ borderColor: tokens.cardBorder, backgroundColor: tokens.cardBackground }}>
    <div className="text-center p-6 lg:p-10" style={{ backgroundColor: tokens.centeredHeaderBg }}>
      <div className="flex justify-center mb-5">
        <IconBadge icon={<Phone size={28} />} tokens={tokens} size={24} />
      </div>
      <h2 className={cn('font-bold tracking-tight mb-2', currentDevice === 'mobile' ? 'text-xl' : 'text-2xl')} style={{ color: tokens.heading }}>{info.heading}</h2>
      <p className="text-sm max-w-md mx-auto" style={{ color: tokens.helperText }}>{info.description}</p>
      <p className="text-xs mt-2" style={{ color: tokens.labelText }}>{info.responseText}</p>
      <span className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: tokens.sectionBadgeBg, color: tokens.sectionBadgeText }}>
        {info.submitLabel}
      </span>
    </div>
    <div className="p-6 lg:p-8 space-y-6">
      <div className={cn('grid gap-6', currentDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-2')}>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
            <IconBadge icon={<Phone size={18} />} tokens={tokens} size={18} />
            <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>{info.texts.phoneLabel}</p><p className="text-sm font-bold" style={{ color: tokens.valueText }}>{info.phone}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
            <IconBadge icon={<Mail size={18} />} tokens={tokens} size={18} />
            <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>{info.texts.emailLabel}</p><p className="text-sm font-bold truncate" style={{ color: tokens.valueText }}>{info.email}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
            <IconBadge icon={<Clock size={18} />} tokens={tokens} size={18} />
            <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>{info.texts.hoursLabel}</p><p className="text-sm font-bold" style={{ color: tokens.valueText }}>{info.workingHours}</p></div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: tokens.centeredSurface }}>
            <IconBadge icon={<MapPin size={18} />} tokens={tokens} size={18} />
            <div><p className="text-xs mb-0.5" style={{ color: tokens.labelText }}>{info.texts.addressLabel}</p><p className="text-sm font-medium" style={{ color: tokens.valueText }}>{info.address}</p></div>
          </div>
          {activeSocials.length > 0 && (
            <div className="pt-2">
              <ContactSocialLinks socials={activeSocials} tokens={tokens} size={20} centered />
            </div>
          )}
        </div>

        {config.showForm && (
          <ContactInquiryForm
            brandColor={tokens.primary}
            secondaryColor={tokens.secondary}
            title={info.heading}
            description={info.description}
            submitLabel={info.submitLabel}
            responseTimeText={info.responseText}
            fields={config.formFields}
            tokens={tokens}
            sourcePath={sourcePath}
            subjectFallback={info.subjectFallback}
            isPreview={isPreview}
          />
        )}
      </div>

      {config.showMap && (
        <div className={cn('relative rounded-lg overflow-hidden w-full', currentDevice === 'mobile' ? MAP_HEIGHT_STANDARD : MAP_HEIGHT_STANDARD)}>
          {renderMapOrPlaceholder({ mapData, fallbackEmbed: config.mapEmbed, tokens, className: 'absolute inset-0', isPreview })}
        </div>
      )}
    </div>
  </div>
);

export function ContactSectionShared({
  config,
  style,
  tokens,
  mode,
  context,
  device,
  title,
  mapData,
  sourcePath,
}: ContactSectionSharedProps) {
  const currentDevice = getDisplayDevice(context, device);
  const isPreview = context === 'preview';
  const info = getInfo(config, title);
  const activeSocials = (config.socialLinks ?? []).filter((social) => social.url && social.url.trim().length > 0);
  const containerClass = getRootContainerClass(context, currentDevice);

  const content = (() => {
    if (style === 'modern') {
      return renderModern({ info, config, tokens, currentDevice, activeSocials, mapData, sourcePath, isPreview });
    }

    if (style === 'floating') {
      return renderFloating({ info, config, tokens, currentDevice, activeSocials, mapData, sourcePath, isPreview });
    }

    if (style === 'grid') {
      return renderGrid({ info, config, tokens, currentDevice, mapData, sourcePath, isPreview });
    }

    if (style === 'minimal') {
      return renderMinimal({ info, config, tokens, currentDevice, activeSocials, mapData, sourcePath, isPreview });
    }

    if (style === 'centered') {
      return renderCentered({ info, config, tokens, currentDevice, activeSocials, mapData, sourcePath, isPreview });
    }

    return renderElegant({ info, config, tokens, currentDevice, mapData, sourcePath, isPreview });
  })();

  return (
    <section className={getSectionPadding(context, currentDevice)}>
      <div className={containerClass}>
        {content}
        {mode === 'dual' && (
          <div className="mt-4 text-[11px]" style={{ color: tokens.labelText }}>
            Accent màu phụ đang áp dụng cho icon tint, badge, CTA phụ và social controls.
          </div>
        )}
      </div>
    </section>
  );
}

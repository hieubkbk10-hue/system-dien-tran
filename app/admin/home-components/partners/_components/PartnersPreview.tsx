import React from 'react';
import { Building2, Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { PARTNERS_STYLES } from '../_lib/constants';
import type { PartnerItem, PartnersStyle } from '../_types';
import { getPartnersColors, type PartnersBrandMode } from '../_lib/colors';
import { PartnersMarqueeShared } from './PartnersMarqueeShared';
import { PartnersBadgeShared } from './PartnersBadgeShared';
import { PartnersCarouselShared } from './PartnersCarouselShared';
import { PartnersFeaturedShared } from './PartnersFeaturedShared';

export const PartnersPreview = ({
  items,
  brandColor,
  secondary,
  mode = 'dual',
  selectedStyle = 'grid',
  onStyleChange,
  title,
}: {
  items: PartnerItem[];
  brandColor: string;
  secondary: string;
  mode?: PartnersBrandMode;
  selectedStyle?: PartnersStyle;
  onStyleChange?: (style: PartnersStyle) => void;
  title?: string;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle ?? 'grid';
  const setPreviewStyle = (style: string) => onStyleChange?.(style as PartnersStyle);
  const colors = React.useMemo(() => getPartnersColors(brandColor, secondary, mode), [brandColor, secondary, mode]);

  const renderEmptyState = () => (
    <section className="w-full py-6 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.iconBg }}>
          <Building2 size={28} style={{ color: colors.iconColor }} />
        </div>
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có đối tác nào</h3>
        <p className="text-sm text-slate-500">Thêm logo đối tác đầu tiên</p>
      </div>
    </section>
  );

  const renderGridStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    const MAX_VISIBLE = device === 'mobile' ? 4 : 8;
    const hasRemaining = items.length > MAX_VISIBLE;
    const visibleCount = hasRemaining ? MAX_VISIBLE - 1 : MAX_VISIBLE;
    const visibleItems = items.slice(0, visibleCount);
    const remainingCount = items.length - visibleCount;

    if (items.length <= 2) {
      return (
        <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-center" style={{ color: colors.headingText }}>Đối tác</h2>
            <div className={cn('mx-auto flex items-center justify-center gap-6', items.length === 1 ? 'max-w-xs' : 'max-w-md')}>
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border"
                  style={{ borderColor: colors.itemBorder, backgroundColor: colors.itemBg }}
                >
                  {item.url ? <PreviewImage src={item.url} alt="" className="h-14 w-auto object-contain" /> : <ImageIcon size={44} className="text-slate-300" />}
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
          <h2 className="text-xl font-bold tracking-tight relative pl-3" style={{ color: colors.headingText }}>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full" style={{ backgroundColor: colors.headingAccent }}></span>
            Đối tác
          </h2>
          <div className={cn(
            'grid gap-3 items-center justify-items-center',
            device === 'mobile' ? 'grid-cols-2' : (device === 'tablet' ? 'grid-cols-4' : 'grid-cols-4 lg:grid-cols-8')
          )}>
            {visibleItems.map((item) => (
              <a
                key={item.id}
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center p-3 rounded-lg border"
                style={{ borderColor: colors.itemBorder, backgroundColor: colors.itemBg }}
              >
                {item.url ? <PreviewImage src={item.url} alt="" className="h-11 w-auto object-contain" /> : <ImageIcon size={36} className="text-slate-300" />}
              </a>
            ))}
            {remainingCount > 0 && (
              <div
                className="w-full flex flex-col items-center justify-center p-3 rounded-lg border"
                style={{ backgroundColor: colors.remainingBg, borderColor: colors.remainingBorder }}
              >
                <Plus size={20} style={{ color: colors.remainingText }} />
                <span className="text-xs font-bold" style={{ color: colors.remainingText }}>+{remainingCount}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderMarqueeStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    return (
      <PartnersMarqueeShared
        items={items}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title ?? 'Đối tác'}
        variant="marquee"
        speed={0.8}
        openInNewTab
        renderImage={(item, className) => (
          <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
        )}
        className="dark:bg-slate-900 dark:border-slate-700/40"
      />
    );
  };

  const renderMonoStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    return (
      <PartnersMarqueeShared
        items={items}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title ?? 'Đối tác'}
        variant="mono"
        speed={0.5}
        openInNewTab
        renderImage={(item, className) => (
          <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
        )}
        className="dark:bg-slate-900 dark:border-slate-700/40"
      />
    );
  };

  const renderBadgeStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    const maxVisible = device === 'mobile' ? 4 : 6;

    return (
      <PartnersBadgeShared
        items={items}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        title={title ?? 'Đối tác'}
        maxVisible={maxVisible}
        openInNewTab
        variant="preview"
        renderImage={(item, className) => (
          <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
        )}
      />
    );
  };

  const renderCarouselStyle = () => (
    <PartnersCarouselShared
      items={items}
      brandColor={brandColor}
        secondary={secondary}
        mode={mode}
      title={title ?? 'Đối tác'}
      device={device}
      openInNewTab
      renderImage={(item, className) => (
        <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
      )}
      className="dark:bg-slate-900 dark:border-slate-700/40"
    />
  );

  const renderFeaturedStyle = () => {
    if (items.length === 0) {return renderEmptyState();}
    const maxOthers = device === 'mobile' ? 4 : 6;
    return (
      <PartnersFeaturedShared
        items={items}
        title={title ?? 'Đối tác'}
        brandColor={brandColor}
        secondary={secondary}
        mode={mode}
        maxOthers={maxOthers}
        openInNewTab
        renderImage={(item, className) => (
          <PreviewImage src={item.url ?? ''} alt={item.name ?? ''} className={className} />
        )}
        className="dark:bg-slate-900 dark:border-slate-700/40"
      />
    );
  };

  return (
    <PreviewWrapper
      title="Preview Partners"
      device={device}
      setDevice={setDevice}
      previewStyle={previewStyle}
      setPreviewStyle={setPreviewStyle}
      styles={PARTNERS_STYLES}
      deviceWidthClass={deviceWidths[device]}
      info={`${items.length} logo`}
    >
      <BrowserFrame>
        {previewStyle === 'grid' && renderGridStyle()}
        {previewStyle === 'marquee' && renderMarqueeStyle()}
        {previewStyle === 'mono' && renderMonoStyle()}
        {previewStyle === 'badge' && renderBadgeStyle()}
        {previewStyle === 'carousel' && renderCarouselStyle()}
        {previewStyle === 'featured' && renderFeaturedStyle()}
      </BrowserFrame>
    </PreviewWrapper>
  );
};

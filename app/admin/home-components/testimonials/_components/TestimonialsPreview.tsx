'use client';

import React from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import {
  getTestimonialsSectionColors,
  normalizeTestimonialsHarmony,
} from '../_lib/colors';
import type {
  TestimonialsBrandMode,
  TestimonialsItem,
  TestimonialsStyle,
} from '../_types';

const TESTIMONIAL_STYLES: Array<{ id: TestimonialsStyle; label: string }> = [
  { id: 'cards', label: 'Cards' },
  { id: 'slider', label: 'Slider' },
  { id: 'masonry', label: 'Masonry' },
  { id: 'quote', label: 'Quote' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'minimal', label: 'Minimal' },
];

const normalizeItems = (items: TestimonialsItem[]): TestimonialsItem[] => items.map((item, idx) => ({
  avatar: item.avatar ?? '',
  content: item.content ?? '',
  id: item.id ?? `testimonial-${idx + 1}`,
  name: item.name ?? '',
  rating: Math.max(1, Math.min(5, Number.isFinite(item.rating) ? item.rating : 5)),
  role: item.role ?? '',
}));

const buildFallbackKey = (item: TestimonialsItem, idx: number) => `${item.id ?? ''}-${item.name}-${item.role}-${idx}`;

export const TestimonialsPreview = ({
  items,
  brandColor,
  secondary,
  mode = 'dual',
  selectedStyle,
  onStyleChange,
}: {
  items: TestimonialsItem[];
  brandColor: string;
  secondary: string;
  mode?: TestimonialsBrandMode;
  selectedStyle?: TestimonialsStyle;
  onStyleChange?: (style: TestimonialsStyle) => void;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle ?? 'cards';
  const setPreviewStyle = (style: string) => {
    if (
      style === 'cards'
      || style === 'slider'
      || style === 'masonry'
      || style === 'quote'
      || style === 'carousel'
      || style === 'minimal'
    ) {
      onStyleChange?.(style);
    }
  };
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const normalizedItems = React.useMemo(() => normalizeItems(items), [items]);

  const harmony = normalizeTestimonialsHarmony(undefined);
  const colors = getTestimonialsSectionColors({
    harmony,
    mode,
    primary: brandColor,
    secondary,
  });

  React.useEffect(() => {
    if ((previewStyle !== 'slider' && previewStyle !== 'quote') || normalizedItems.length <= 1) {return;}
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % normalizedItems.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [previewStyle, normalizedItems.length]);

  React.useEffect(() => {
    if (normalizedItems.length === 0) {
      setCurrentSlide(0);
      return;
    }

    setCurrentSlide((prev) => (prev >= normalizedItems.length ? 0 : prev));
  }, [normalizedItems.length]);

  const renderStars = (rating: number, size: number = 14) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={`star-${star}`}
          size={size}
          className={star <= rating ? 'fill-current' : 'text-slate-300'}
          style={star <= rating ? { color: colors.ratingSecondary } : undefined}
        />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <section className="py-12 px-4" style={{ backgroundColor: colors.neutralBackground }}>
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center rounded-xl border p-10 text-center" style={{ backgroundColor: colors.neutralSurface, borderColor: colors.cardBorder }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.iconSurface }}>
          <Star size={28} style={{ color: colors.quoteSecondary }} />
        </div>
        <p className="font-semibold" style={{ color: colors.headingPrimary }}>Chưa có đánh giá nào</p>
        <p className="text-sm mt-1" style={{ color: colors.neutralMuted }}>Thêm đánh giá đầu tiên để xem preview</p>
      </div>
    </section>
  );

  const renderCardsStyle = () => (
    <section className="py-12 px-4" style={{ backgroundColor: colors.neutralBackground }}>
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8" style={{ color: colors.headingPrimary }}>Khách hàng nói gì về chúng tôi</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {normalizedItems.map((item, idx) => (
            <article
              key={buildFallbackKey(item, idx)}
              className="rounded-xl border p-5 flex flex-col h-full"
              style={{
                backgroundColor: colors.cardSurface,
                borderTopColor: colors.cardBorder,
                borderRightColor: colors.cardBorder,
                borderBottomColor: colors.cardBorder,
                borderLeftColor: colors.cardBorder,
              }}
            >
              {renderStars(item.rating, 14)}
              <p className="mt-3 text-sm leading-relaxed flex-1 min-h-[64px]" style={{ color: colors.neutralMuted }}>
                “{item.content || 'Nội dung đánh giá...'}”
              </p>
              <div className="mt-4 pt-4 border-t flex items-center gap-3" style={{ borderColor: colors.cardBorder }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: colors.primary, color: colors.avatarTextOnPrimary }}>
                  {(item.name || 'U').charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: colors.headingPrimary }}>{item.name || 'Tên khách hàng'}</p>
                  <p className="text-xs truncate" style={{ color: colors.subtitleSecondary }}>{item.role || 'Chức vụ'}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const renderSliderStyle = () => {
    const current = normalizedItems[currentSlide] || normalizedItems[0];
    if (!current) {return null;}

    return (
      <section className="py-12 md:py-16 px-4 relative overflow-hidden" style={{ backgroundColor: colors.neutralBackground }}>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[120px] leading-none font-serif pointer-events-none select-none" style={{ color: colors.quoteSecondary }}>
          “
        </div>

        <div className="max-w-4xl mx-auto relative">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: colors.headingPrimary }}>Khách hàng nói gì về chúng tôi</h3>

          <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: colors.cardSurface, borderColor: colors.cardBorderStrong }}>
            <div className="flex justify-center mb-4">{renderStars(current.rating, 16)}</div>
            <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: colors.neutralMuted }}>“{current.content || 'Nội dung đánh giá...'}”</p>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: colors.primary, color: colors.avatarTextOnPrimary }}>
                {(current.name || 'U').charAt(0)}
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold truncate" style={{ color: colors.headingPrimary }}>{current.name || 'Tên khách hàng'}</p>
                <p className="text-sm truncate" style={{ color: colors.subtitleSecondary }}>{current.role || 'Chức vụ'}</p>
              </div>
            </div>
          </div>

          {normalizedItems.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => { setCurrentSlide((prev) => (prev === 0 ? normalizedItems.length - 1 : prev - 1)); }}
                className="w-11 h-11 min-h-[44px] rounded-full border flex items-center justify-center"
                style={{ backgroundColor: colors.neutralSurface, borderColor: colors.buttonSecondaryBorder, color: colors.buttonSecondaryText }}
                aria-label="Slide trước"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-2">
                {normalizedItems.map((_, idx) => (
                  <button
                    key={`slider-dot-${idx}`}
                    type="button"
                    onClick={() => { setCurrentSlide(idx); }}
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      backgroundColor: idx === currentSlide ? colors.dotActive : colors.dotInactive,
                      width: idx === currentSlide ? 28 : 10,
                    }}
                    aria-label={`Đi tới slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => { setCurrentSlide((prev) => (prev + 1) % normalizedItems.length); }}
                className="w-11 h-11 min-h-[44px] rounded-full border flex items-center justify-center"
                style={{ backgroundColor: colors.neutralSurface, borderColor: colors.buttonSecondaryBorder, color: colors.buttonSecondaryText }}
                aria-label="Slide sau"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderMasonryStyle = () => (
    <section className="py-12 px-4" style={{ backgroundColor: colors.neutralBackground }}>
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8" style={{ color: colors.headingPrimary }}>Khách hàng nói gì về chúng tôi</h3>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {normalizedItems.map((item, idx) => (
            <article
              key={buildFallbackKey(item, idx)}
              className="break-inside-avoid mb-4 rounded-xl border p-5"
              style={{
                backgroundColor: colors.cardSurface,
                borderTopColor: colors.cardBorder,
                borderRightColor: colors.cardBorder,
                borderBottomColor: colors.cardBorder,
                borderLeftColor: colors.cardBorder,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: colors.primary, color: colors.avatarTextOnPrimary }}>
                  {(item.name || 'U').charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: colors.headingPrimary }}>{item.name || 'Tên khách hàng'}</p>
                  <p className="text-xs truncate" style={{ color: colors.subtitleSecondary }}>{item.role || 'Chức vụ'}</p>
                </div>
              </div>
              {renderStars(item.rating, 13)}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.neutralMuted }}>“{item.content || 'Nội dung đánh giá...'}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const renderQuoteStyle = () => {
    const current = normalizedItems[currentSlide] || normalizedItems[0];
    if (!current) {return null;}

    return (
      <section className="py-12 md:py-16 px-4" style={{ backgroundColor: colors.cardAltSurface }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[80px] leading-none font-serif mb-[-24px] select-none" style={{ color: colors.quoteSecondary }}>“</div>
          <blockquote className="text-xl md:text-2xl leading-relaxed italic" style={{ color: colors.headingPrimary }}>
            {current.content || 'Nội dung đánh giá...'}
          </blockquote>

          <div className="mt-7 flex flex-col items-center gap-3">
            <div className="flex justify-center">{renderStars(current.rating, 16)}</div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: colors.primary, color: colors.avatarTextOnPrimary }}>
                {(current.name || 'U').charAt(0)}
              </div>
              <div className="text-left min-w-0">
                <p className="font-semibold truncate" style={{ color: colors.headingPrimary }}>{current.name || 'Tên khách hàng'}</p>
                <p className="text-sm truncate" style={{ color: colors.subtitleSecondary }}>{current.role || 'Chức vụ'}</p>
              </div>
            </div>
          </div>

          {normalizedItems.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {normalizedItems.map((_, idx) => (
                <button
                  key={`quote-dot-${idx}`}
                  type="button"
                  onClick={() => { setCurrentSlide(idx); }}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: idx === currentSlide ? colors.dotActive : colors.dotInactive }}
                  aria-label={`Đi tới quote ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderCarouselStyle = () => (
    <section className="py-12 px-4" style={{ backgroundColor: colors.neutralBackground }}>
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8" style={{ color: colors.headingPrimary }}>Khách hàng nói gì về chúng tôi</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {normalizedItems.map((item, idx) => (
            <article
              key={buildFallbackKey(item, idx)}
              className="flex-shrink-0 snap-start w-[300px] rounded-xl border p-5"
              style={{
                backgroundColor: colors.cardSurface,
                borderTopColor: colors.cardBorderStrong,
                borderRightColor: colors.cardBorderStrong,
                borderBottomColor: colors.cardBorderStrong,
                borderLeftColor: colors.cardBorderStrong,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: colors.primary, color: colors.avatarTextOnPrimary }}>
                  {(item.name || 'U').charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: colors.headingPrimary }}>{item.name || 'Tên khách hàng'}</p>
                  <p className="text-xs truncate" style={{ color: colors.subtitleSecondary }}>{item.role || 'Chức vụ'}</p>
                </div>
              </div>

              {renderStars(item.rating, 13)}
              <p className="mt-3 text-sm leading-relaxed line-clamp-4" style={{ color: colors.neutralMuted }}>
                “{item.content || 'Nội dung đánh giá...'}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const renderMinimalStyle = () => (
    <section className="py-12 px-4" style={{ backgroundColor: colors.neutralBackground }}>
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8" style={{ color: colors.headingPrimary }}>Khách hàng nói gì về chúng tôi</h3>
        <div className="space-y-4">
          {normalizedItems.map((item, idx) => (
            <article
              key={buildFallbackKey(item, idx)}
              className="rounded-lg border-l-4 border p-4 flex gap-3"
              style={{
                backgroundColor: colors.cardSurface,
                borderLeftColor: colors.quoteSecondary,
                borderTopColor: colors.cardBorder,
                borderRightColor: colors.cardBorder,
                borderBottomColor: colors.cardBorder,
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ backgroundColor: colors.primary, color: colors.avatarTextOnPrimary }}>
                {(item.name || 'U').charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-sm truncate" style={{ color: colors.headingPrimary }}>{item.name || 'Tên khách hàng'}</span>
                  <span className="text-xs" style={{ color: colors.neutralMuted }}>•</span>
                  <span className="text-xs truncate" style={{ color: colors.subtitleSecondary }}>{item.role || 'Chức vụ'}</span>
                  <div className="ml-auto">{renderStars(item.rating, 11)}</div>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: colors.neutralMuted }}>“{item.content || 'Nội dung đánh giá...'}”</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: colors.buttonSecondaryHoverBg,
              borderColor: colors.buttonSecondaryBorder,
              color: colors.buttonSecondaryText,
            }}
          >
            Xem thêm đánh giá
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );

  const renderByStyle = () => {
    if (normalizedItems.length === 0) {return renderEmptyState();}

    if (previewStyle === 'cards') {return renderCardsStyle();}
    if (previewStyle === 'slider') {return renderSliderStyle();}
    if (previewStyle === 'masonry') {return renderMasonryStyle();}
    if (previewStyle === 'quote') {return renderQuoteStyle();}
    if (previewStyle === 'carousel') {return renderCarouselStyle();}
    return renderMinimalStyle();
  };

  return (
    <PreviewWrapper
      title="Preview Testimonials"
      device={device}
      setDevice={setDevice}
      previewStyle={previewStyle}
      setPreviewStyle={setPreviewStyle}
      styles={TESTIMONIAL_STYLES}
      deviceWidthClass={deviceWidths[device]}
      info={`${normalizedItems.length} đánh giá`}
    >
      <BrowserFrame>
        <div className="@container/preview">
          {renderByStyle()}
        </div>
      </BrowserFrame>
    </PreviewWrapper>
  );
};

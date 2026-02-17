"use client";

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../components/ui';

export type PartnerMarqueeItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () =>{  setPrefersReducedMotion(mediaQuery.matches); };

    update();
    mediaQuery.addEventListener('change', update);
    return () =>{  mediaQuery.removeEventListener('change', update); };
  }, []);

  return prefersReducedMotion;
};

const normalizeItems = (items: PartnerMarqueeItem[]) => {
  const seen = new Set<string>();

  return items
    .filter(item => item.url)
    .filter((item) => {
      const key = `${item.url ?? ''}::${item.link ?? ''}`;
      if (seen.has(key)) {return false;}
      seen.add(key);
      return true;
    });
};

export const PartnersMarqueeShared = ({
  items,
  title,
  brandColor,
  variant = 'marquee',
  speed = 0.8,
  renderImage,
  openInNewTab = false,
  className,
}: {
  items: PartnerMarqueeItem[];
  title?: string;
  brandColor: string;
  variant?: 'marquee' | 'mono';
  speed?: number;
  renderImage: (item: PartnerMarqueeItem, className: string) => React.ReactNode;
  openInNewTab?: boolean;
  className?: string;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const normalizedItems = React.useMemo(() => normalizeItems(items), [items]);
  const itemCount = normalizedItems.length;
  const shouldAnimate = itemCount > 1;
  const loopCount = shouldAnimate ? 2 : 1;
  const speedMultiplier = itemCount >= 14 ? 1.35 : itemCount >= 10 ? 1.2 : itemCount >= 6 ? 1.1 : 1;
  const adaptiveSpeed = speed * speedMultiplier;
  const effectiveSpeed = prefersReducedMotion ? Math.min(adaptiveSpeed, 0.15) : adaptiveSpeed;
  const [isPaused, setIsPaused] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!shouldAnimate) {return;}
    const scroller = scrollRef.current;
    if (!scroller) {return;}

    let animationId: number;
    let position = scroller.scrollLeft;

    const step = () => {
      if (!isPaused && scroller) {
        position += effectiveSpeed;
        const maxScroll = scroller.scrollWidth / loopCount;
        if (position >= maxScroll) {
          position = 0;
        }
        scroller.scrollLeft = position;
      } else if (scroller) {
        position = scroller.scrollLeft;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () =>{  cancelAnimationFrame(animationId); };
  }, [effectiveSpeed, isPaused, loopCount, shouldAnimate]);

  if (normalizedItems.length === 0) {return null;}

  const logoClassName = cn(
    'h-11 md:h-12 w-auto object-contain select-none transition-all duration-500',
    variant === 'mono'
      ? 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
      : 'group-hover:scale-110'
  );

  const placeholderClassName = cn(
    'h-11 md:h-12 w-24 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center',
    variant === 'mono' ? 'opacity-50' : 'hover:scale-105'
  );

  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <section className={cn('w-full py-10 bg-white border-b border-slate-200/40', className)}>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 relative pl-4">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full" style={{ backgroundColor: brandColor }}></span>
            {title ?? 'Đối tác'}
          </h2>
        </div>
        <div className="w-full relative py-8">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto touch-pan-x no-scrollbar"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            onMouseEnter={() =>{  setIsPaused(true); }}
            onMouseLeave={() =>{  setIsPaused(false); }}
            onTouchStart={() =>{  setIsPaused(true); }}
            onTouchEnd={() =>{  setIsPaused(false); }}
            onFocusCapture={() =>{  setIsPaused(true); }}
            onBlurCapture={() =>{  setIsPaused(false); }}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {Array.from({ length: loopCount }).map((_, loopIndex) => (
              <div key={`loop-${loopIndex}`} className="flex shrink-0 gap-16 items-center px-4">
                {normalizedItems.map((item, index) => {
                  const keyBase = item.id ?? item.url ?? item.name ?? index;
                  return (
                    <a
                      key={`${loopIndex}-${keyBase}`}
                      href={item.link ?? '#'}
                      className="shrink-0 group"
                      {...linkProps}
                    >
                      {item.url
                        ? renderImage(item, logoClassName)
                        : (
                          <div className={placeholderClassName}>
                            <ImageIcon size={24} className="text-slate-400" />
                          </div>
                        )}
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

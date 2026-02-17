import React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';

type FeaturedItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

const DEFAULT_MAX_OTHERS = 6;

export const PartnersFeaturedShared = ({
  items,
  title,
  brandColor,
  maxOthers = DEFAULT_MAX_OTHERS,
  openInNewTab = false,
  renderImage,
  className,
}: {
  items: FeaturedItem[];
  title: string;
  brandColor: string;
  maxOthers?: number;
  openInNewTab?: boolean;
  renderImage: (item: FeaturedItem, className: string) => React.ReactNode;
  className?: string;
}) => {
  const featured = items[0];
  const smallVisible = items.slice(1, 6);
  const remainingCount = Math.max(0, items.length - 6);
  const smallSlots = Array.from({ length: 5 }, (_, index) => smallVisible[index]);
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  if (items.length <= 2) {
    return (
      <section className={cn('w-full py-7 bg-white border-b border-slate-200/40', className)}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 text-center">{title}</h2>
          <div className={cn('mx-auto flex flex-wrap items-center justify-center gap-3', items.length === 1 ? 'max-w-xs' : 'max-w-md')}>
            {items.map((item, idx) => (
              <a
                key={item.id ?? idx}
                href={item.link || '#'}
                {...linkProps}
                className="flex items-center justify-center rounded-2xl border bg-white px-4 py-3"
                style={{ borderColor: `${brandColor}18` }}
              >
                {item.url ? renderImage(item, 'h-16 w-auto object-contain') : <ImageIcon size={48} className="text-slate-300" />}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('w-full py-7 bg-white border-b border-slate-200/40', className)}>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 relative pl-4">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full" style={{ backgroundColor: brandColor }}></span>
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {featured && (
            <a
              href={featured.link || '#'}
              {...linkProps}
              className="relative md:row-span-2 rounded-2xl border bg-white/95 overflow-hidden flex items-center justify-center p-5 aspect-[4/3] md:aspect-auto"
              style={{ borderColor: `${brandColor}18`, backgroundColor: `${brandColor}04` }}
            >
              <div className="absolute top-3 left-3">
                <span
                  className="px-2 py-1 text-[10px] font-semibold rounded"
                  style={{ backgroundColor: `${brandColor}12`, color: brandColor }}
                >
                  NỔI BẬT
                </span>
              </div>
              {featured.url ? renderImage(featured, 'max-h-32 w-auto object-contain') : (
                <ImageIcon size={64} className="text-slate-300" />
              )}
            </a>
          )}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            {smallSlots.map((item, idx) => (
              <div
                key={item?.id ?? `empty-${idx}`}
                className={cn('flex items-center justify-center p-2.5 rounded-xl border bg-white aspect-[3/2]', !item && 'border-transparent')}
                style={item ? { borderColor: `${brandColor}14` } : undefined}
              >
                {item ? (
                  item.url ? renderImage(item, 'h-12 w-auto object-contain') : <ImageIcon size={34} className="text-slate-300" />
                ) : null}
              </div>
            ))}
            {remainingCount > 0 ? (
              <div
                className="flex flex-col items-center justify-center rounded-xl border aspect-[3/2]"
                style={{ backgroundColor: `${brandColor}05`, borderColor: `${brandColor}18` }}
              >
                <Plus size={20} style={{ color: brandColor }} />
                <span className="text-sm font-semibold" style={{ color: brandColor }}>+{remainingCount}</span>
              </div>
            ) : (
              <div className="rounded-xl border border-transparent aspect-[3/2]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

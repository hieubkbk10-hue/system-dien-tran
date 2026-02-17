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
  const others = items.slice(1, 1 + maxOthers);
  const remainingCount = Math.max(0, items.length - 1 - maxOthers);
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  if (items.length <= 2) {
    return (
      <section className={cn('w-full py-10 bg-white border-b border-slate-200/40', className)}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 text-center">{title}</h2>
          <div className={cn('mx-auto flex flex-wrap items-center justify-center gap-6', items.length === 1 ? 'max-w-xs' : 'max-w-md')}>
            {items.map((item, idx) => (
              <a
                key={item.id ?? idx}
                href={item.link || '#'}
                {...linkProps}
                className="group flex items-center justify-center rounded-2xl border bg-white px-6 py-5 transition-shadow hover:shadow-md"
                style={{ borderColor: `${brandColor}18` }}
              >
                {item.url ? renderImage(item, 'h-14 w-auto object-contain') : <ImageIcon size={44} className="text-slate-300" />}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('w-full py-12 bg-white border-b border-slate-200/40', className)}>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 relative pl-4">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full" style={{ backgroundColor: brandColor }}></span>
            {title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured && (
            <a
              href={featured.link || '#'}
              {...linkProps}
              className="group relative md:row-span-2 rounded-2xl border bg-white/95 overflow-hidden flex items-center justify-center p-8 aspect-[4/3] md:aspect-auto transition-shadow hover:shadow-lg"
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
              {featured.url ? renderImage(featured, 'max-h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-105') : (
                <ImageIcon size={56} className="text-slate-300" />
              )}
            </a>
          )}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
            {others.map((item, idx) => (
              <a
                key={item.id ?? idx}
                href={item.link || '#'}
                {...linkProps}
                className="group flex items-center justify-center p-4 rounded-xl border bg-white transition-shadow hover:shadow-md aspect-[3/2]"
                style={{ borderColor: `${brandColor}14` }}
              >
                {item.url ? renderImage(item, 'h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105') : (
                  <ImageIcon size={30} className="text-slate-300" />
                )}
              </a>
            ))}
            {remainingCount > 0 && (
              <div
                className="flex flex-col items-center justify-center rounded-xl border aspect-[3/2]"
                style={{ backgroundColor: `${brandColor}05`, borderColor: `${brandColor}18` }}
              >
                <Plus size={20} style={{ color: brandColor }} />
                <span className="text-sm font-semibold" style={{ color: brandColor }}>+{remainingCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

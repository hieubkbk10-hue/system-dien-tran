"use client";

import React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';

export type PartnerBadgeItem = {
  id?: string | number;
  url?: string;
  link?: string;
  name?: string;
};

type LayoutVariant = 'preview' | 'site';

const layoutByVariant: Record<LayoutVariant, {
  section: string;
  container: string;
  title: string;
  list: string;
  item: string;
  image: string;
  name: string;
  remaining: string;
}> = {
  preview: {
    section: 'w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-700/40',
    container: 'w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4',
    title: 'text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 relative pl-3',
    list: 'w-full flex flex-wrap items-center justify-center gap-2',
    item: 'px-3 py-2 rounded-lg border flex items-center gap-2',
    image: 'h-6 w-auto',
    name: 'text-xs font-semibold truncate max-w-[100px]',
    remaining: 'px-3 py-2 rounded-lg border flex items-center gap-2',
  },
  site: {
    section: 'w-full py-10 bg-white border-b border-slate-200/40',
    container: 'w-full max-w-7xl mx-auto px-4 md:px-6 space-y-8',
    title: 'text-2xl font-bold tracking-tight text-slate-900 relative pl-4',
    list: 'w-full flex flex-wrap items-center justify-center gap-3',
    item: 'px-4 py-2 rounded-lg border transition-all flex items-center gap-3 group',
    image: 'h-5 w-auto',
    name: 'text-xs font-semibold',
    remaining: 'px-4 py-2 rounded-lg border flex items-center gap-3',
  },
};

export const PartnersBadgeShared = ({
  items,
  brandColor,
  title,
  maxVisible = 6,
  renderImage,
  openInNewTab = false,
  className,
  variant = 'preview',
}: {
  items: PartnerBadgeItem[];
  brandColor: string;
  title?: string;
  maxVisible?: number;
  renderImage: (item: PartnerBadgeItem, className: string) => React.ReactNode;
  openInNewTab?: boolean;
  className?: string;
  variant?: LayoutVariant;
}) => {
  if (items.length === 0) {return null;}

  const layout = layoutByVariant[variant];
  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;
  const linkProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <section className={cn(layout.section, className)}>
      <div className={layout.container}>
        <h2 className={layout.title}>
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full"
            style={{ backgroundColor: brandColor }}
          ></span>
          {title ?? 'Đối tác'}
        </h2>
        <div className={layout.list}>
          {visibleItems.map((item, idx) => (
            <a
              key={item.id ?? `${item.url ?? ''}-${idx}`}
              href={item.link || '#'}
              className={layout.item}
              style={{ backgroundColor: `${brandColor}05`, borderColor: `${brandColor}15` }}
              {...linkProps}
            >
              {item.url
                ? renderImage(item, layout.image)
                : <ImageIcon size={20} className="text-slate-400" />}
              <span className={layout.name} style={{ color: `${brandColor}cc` }}>
                {item.name ?? `Đối tác ${idx + 1}`}
              </span>
            </a>
          ))}
          {remainingCount > 0 && (
            <div
              className={layout.remaining}
              style={{ backgroundColor: `${brandColor}08`, borderColor: `${brandColor}20` }}
            >
              <Plus size={14} style={{ color: brandColor }} />
              <span className="text-xs font-bold" style={{ color: brandColor }}>+{remainingCount}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

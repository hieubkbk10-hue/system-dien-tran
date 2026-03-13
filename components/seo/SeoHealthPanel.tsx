/**
 * SEO Health Panel - Read-only dashboard
 * Hiển thị health check và warnings cho SEO configuration
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, ExternalLink, Globe, Info, XCircle } from 'lucide-react';
import type { SeoChecklistCategory, SeoChecklistItem, SeoChecklistResult } from '@/lib/seo/checklist';

const CATEGORY_LABELS: Record<SeoChecklistCategory, string> = {
  crawl: 'Crawl & Index',
  entity: 'Trust & Entity',
  content: 'Content & Links',
  speed: 'Speed & Rendering',
  external: 'External Boost',
};

const STATUS_ICON = {
  pass: CheckCircle,
  warning: AlertTriangle,
  fail: XCircle,
  info: Info,
};

const STATUS_COLOR = {
  pass: 'text-green-600',
  warning: 'text-yellow-600',
  fail: 'text-red-600',
  info: 'text-slate-500',
};

type SeoHealthPanelProps = {
  checklist: SeoChecklistResult | null;
  isLoading: boolean;
  initialTab?: SeoChecklistCategory;
};

export function SeoHealthPanel({ checklist, isLoading, initialTab = 'crawl' }: SeoHealthPanelProps) {
  const [activeTab, setActiveTab] = useState<SeoChecklistCategory>(initialTab);

  if (isLoading || !checklist) {
    return <div className="text-sm text-slate-500">Đang tải checklist SEO...</div>;
  }

  const items = checklist.items.filter((item) => item.category === activeTab);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Globe size={20} className="text-cyan-600" />
        <h3 className="text-lg font-semibold">SEO Checklist Center</h3>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key as SeoChecklistCategory)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              activeTab === key
                ? 'border-cyan-500 text-cyan-700 bg-cyan-50 dark:bg-cyan-900/20'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <SeoChecklistItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

const SeoChecklistItemCard = ({ item }: { item: SeoChecklistItem }) => {
  const Icon = STATUS_ICON[item.status];
  const statusColor = STATUS_COLOR[item.status];

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Icon size={18} className={`${statusColor} mt-0.5`} />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
          <p className="text-xs text-slate-500">{item.whyItMatters}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{item.howToFix}</p>
        </div>
      </div>

      {item.quickActions && item.quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.quickActions.map((action) => (
            <Link
              key={`${item.id}-${action.label}`}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              {action.label}
              {action.external && <ExternalLink size={12} />}
            </Link>
          ))}
        </div>
      )}

      {item.learnMoreUrl && (
        <a
          href={item.learnMoreUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-cyan-600 inline-flex items-center gap-1"
        >
          Best practice
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
};

'use client';

import { Globe, RefreshCw } from 'lucide-react';
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SeoHealthPanel } from '@/components/seo/SeoHealthPanel';

export default function SEOConfigPage(): React.ReactElement {
  const siteUrlSetting = useQuery(api.settings.getByKey, { key: 'site_url' });
  const baseUrl = (siteUrlSetting?.value as string) || process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const sitemapUrl = `${baseUrl.replace(/\/$/, '')}/sitemap.xml`;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
         <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
           <Globe size={20} className="text-cyan-600 dark:text-cyan-400" /> SEO Configuration
         </h2>
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sitemap và robots.txt được sinh tự động.</p>
      </div>

      <SeoHealthPanel />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6">
        <div>
           <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sitemap XML</h3>
           <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-950 p-3 rounded border border-slate-300 dark:border-slate-800 mb-2">
             <code className="text-xs text-slate-600 dark:text-slate-400 flex-1">{sitemapUrl}</code>
             <button
               type="button"
               className="text-xs text-slate-400 font-medium flex items-center gap-1 cursor-not-allowed"
               title="Sitemap tự động cập nhật"
             >
               <RefreshCw size={12} /> Auto
             </button>
           </div>
           <p className="text-xs text-slate-500">Sitemap được cập nhật tự động khi nội dung thay đổi.</p>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-2">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Robots.txt</h3>
          <p className="text-xs text-slate-500">Robots được sinh tự động để cho phép index các trang public và chặn admin/system/private.</p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
            <li>Allow: /</li>
            <li>Disallow: /admin/</li>
            <li>Disallow: /system/</li>
            <li>Disallow: /api/</li>
            <li>Disallow: /account/</li>
            <li>Disallow: /cart/</li>
            <li>Disallow: /checkout/</li>
            <li>Disallow: /wishlist/</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

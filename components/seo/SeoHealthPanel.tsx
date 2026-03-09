/**
 * SEO Health Panel - Read-only dashboard
 * Hiển thị health check và warnings cho SEO configuration
 */

'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AlertTriangle, CheckCircle, Globe, XCircle } from 'lucide-react';

type HealthCheck = {
  status: 'pass' | 'warning' | 'fail';
  message: string;
  field?: string;
};

export function SeoHealthPanel() {
  const siteSettings = useQuery(api.settings.getMultiple, {
    keys: ['site_name', 'site_url', 'site_logo'],
  });
  const seoSettings = useQuery(api.settings.getMultiple, {
    keys: ['seo_title', 'seo_description', 'seo_og_image'],
  });
  const contactSettings = useQuery(api.settings.getMultiple, {
    keys: ['contact_email', 'contact_phone', 'contact_address'],
  });

  if (!siteSettings || !seoSettings || !contactSettings) {
    return <div className="text-sm text-slate-500">Đang tải...</div>;
  }

  const checks: HealthCheck[] = [];

  // Critical checks
  if (!siteSettings.site_url) {
    checks.push({ status: 'fail', message: 'Thiếu Site URL (bắt buộc cho SEO)', field: 'site_url' });
  } else {
    checks.push({ status: 'pass', message: 'Site URL đã cấu hình' });
  }

  if (!siteSettings.site_name) {
    checks.push({ status: 'fail', message: 'Thiếu Site Name', field: 'site_name' });
  } else {
    checks.push({ status: 'pass', message: 'Site Name đã cấu hình' });
  }

  // SEO checks
  if (!seoSettings.seo_description) {
    checks.push({ status: 'warning', message: 'Nên có SEO Description mặc định', field: 'seo_description' });
  } else {
    checks.push({ status: 'pass', message: 'SEO Description đã cấu hình' });
  }

  if (!seoSettings.seo_og_image && !siteSettings.site_logo) {
    checks.push({ status: 'warning', message: 'Nên có OG Image hoặc Site Logo', field: 'seo_og_image' });
  } else {
    checks.push({ status: 'pass', message: 'OG Image/Logo đã cấu hình' });
  }

  // LocalBusiness schema check
  const hasAddress = Boolean(contactSettings.contact_address);
  const hasContact = Boolean(contactSettings.contact_phone || contactSettings.contact_email);
  if (hasAddress && hasContact) {
    checks.push({ status: 'pass', message: 'LocalBusiness schema sẽ được tự động phát (có đủ contact info)' });
  } else {
    checks.push({ status: 'warning', message: 'Chỉ phát Organization schema (thiếu contact info cho LocalBusiness)' });
  }

  const passCount = checks.filter(c => c.status === 'pass').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={20} className="text-cyan-600" />
        <h3 className="text-lg font-semibold">SEO Health Check</h3>
      </div>

      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-1">
          <CheckCircle size={16} className="text-green-600" />
          <span>{passCount} Pass</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle size={16} className="text-yellow-600" />
          <span>{warningCount} Warning</span>
        </div>
        <div className="flex items-center gap-1">
          <XCircle size={16} className="text-red-600" />
          <span>{failCount} Fail</span>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            {check.status === 'pass' && <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />}
            {check.status === 'warning' && <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />}
            {check.status === 'fail' && <XCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />}
            <span className={check.status === 'fail' ? 'text-red-700 dark:text-red-400' : ''}>{check.message}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t text-xs text-slate-500">
        <p>💡 Hệ thống SEO tự động derive metadata từ dữ liệu thật. Chỉ cần cấu hình các field bắt buộc ở trên.</p>
      </div>
    </div>
  );
}

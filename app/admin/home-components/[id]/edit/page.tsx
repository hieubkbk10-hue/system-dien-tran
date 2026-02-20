'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function HomeComponentRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });

  useEffect(() => {
    if (!component) {return;}

    const redirectMap: Record<string, string> = {
      Hero: 'hero',
      Stats: 'stats',
      CaseStudy: 'case-study',
      ServiceList: 'service-list',
      ProductGrid: 'product-grid',
      ProductList: 'product-list',
      Blog: 'blog',
      Partners: 'partners',
      CategoryProducts: 'category-products',
      ProductCategories: 'product-categories',
      Gallery: 'gallery',
      TrustBadges: 'trust-badges',
      CTA: 'cta',
      FAQ: 'faq',
      Footer: 'footer',
      Testimonials: 'testimonials',
      Pricing: 'pricing',
      About: 'about',
      Services: 'services',
      Benefits: 'benefits',
      Contact: 'contact',
      Team: 'team',
      Features: 'features',
      Process: 'process',
      VoucherPromotions: 'voucher-promotions',
      Career: 'career',
      SpeedDial: 'speed-dial',
      Clients: 'clients',
      Video: 'video',
      Countdown: 'countdown',
    };

    const slug = redirectMap[component.type];
    if (slug) {
      router.replace(`/admin/home-components/${slug}/${component._id}/edit`);
      return;
    }

    toast.error(`Component type "${component.type}" không được hỗ trợ`);
    router.push('/admin/home-components');

  }, [component, router]);

  if (component === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return (
      <div className="text-center py-8 text-slate-500">
        Không tìm thấy component
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      <span className="ml-3 text-slate-500">Đang chuyển hướng...</span>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { 
  AlertCircle, Award, Briefcase, Check, FileText, FolderTree, 
  Grid, HelpCircle, Image as ImageIcon, LayoutTemplate, MousePointerClick, 
  Package, Phone, ShoppingBag, Star, Tag, UserCircle, User as UserIcon, Users, Zap
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../components/ui';

export const COMPONENT_TYPES = [
  { description: 'Banner chính đầu trang', icon: LayoutTemplate, label: 'Hero Banner', route: 'hero', value: 'Hero', singleton: true, recommended: true, position: 1 },
  { description: 'Số liệu nổi bật', icon: AlertCircle, label: 'Thống kê', route: 'stats', value: 'Stats', recommended: true, position: 2 },
  { description: 'Logo đối tác, khách hàng', icon: Users, label: 'Đối tác / Logos', route: 'gallery?type=Partners', value: 'Partners', position: 3 },
  { description: 'Giải thưởng, chứng chỉ', icon: Award, label: 'Chứng nhận', route: 'gallery?type=TrustBadges', value: 'TrustBadges', position: 4 },
  { description: 'Hiển thị danh mục SP', icon: FolderTree, label: 'Danh mục sản phẩm', route: 'product-categories', value: 'ProductCategories', recommended: true, position: 5 },
  { description: 'Sản phẩm theo danh mục', icon: Package, label: 'Danh sách Sản phẩm', route: 'product-list?type=ProductList', value: 'ProductList', recommended: true, position: 6 },
  { description: 'Grid sản phẩm', icon: Package, label: 'Sản phẩm', route: 'product-grid', value: 'ProductGrid', position: 7 },
  { description: 'SP trong từng danh mục', icon: ShoppingBag, label: 'Sản phẩm theo danh mục', route: 'category-products', value: 'CategoryProducts', position: 7 },
  { description: 'Các dịch vụ cung cấp', icon: Briefcase, label: 'Danh sách Dịch vụ', route: 'product-list?type=ServiceList', value: 'ServiceList', position: 8 },
  { description: 'Bài viết mới nhất', icon: FileText, label: 'Tin tức / Blog', route: 'product-list?type=Blog', value: 'Blog', position: 9 },
  { description: 'Tại sao chọn chúng tôi', icon: Check, label: 'Lợi ích', route: 'benefits', value: 'Benefits', position: 10 },
  { description: 'Tính năng nổi bật với icon grid', icon: Zap, label: 'Tính năng', route: 'features', value: 'Features', position: 11 },
  { description: 'Mô tả dịch vụ', icon: Briefcase, label: 'Dịch vụ chi tiết', route: 'services', value: 'Services', position: 12 },
  { description: 'Các bước quy trình/timeline cho dịch vụ', icon: LayoutTemplate, label: 'Quy trình', route: 'process', value: 'Process', position: 13 },
  { description: 'Ý kiến khách hàng', icon: Star, label: 'Đánh giá / Review', route: 'testimonials', value: 'Testimonials', position: 14 },
  { description: 'Case study tiêu biểu', icon: FileText, label: 'Dự án thực tế', route: 'case-study', value: 'CaseStudy', position: 15 },
  { description: 'Hình ảnh hoạt động', icon: ImageIcon, label: 'Thư viện ảnh', route: 'gallery?type=Gallery', value: 'Gallery', position: 16 },
  { description: 'Logo khách hàng chạy auto-scroll', icon: Users, label: 'Khách hàng (Marquee)', route: 'clients', value: 'Clients', position: 17 },
  { description: 'Nút đăng ký, mua ngay', icon: MousePointerClick, label: 'Kêu gọi hành động (CTA)', route: 'cta', value: 'CTA', recommended: true, position: 18 },
  { description: 'Các gói dịch vụ', icon: Tag, label: 'Bảng giá', route: 'pricing', value: 'Pricing', position: 19 },
  { description: 'Voucher khuyến mãi với CTA dẫn tới ưu đãi', icon: Tag, label: 'Voucher khuyến mãi', route: 'voucher-promotions', value: 'VoucherPromotions', position: 20 },
  { description: 'Banner khuyến mãi với đếm ngược thời gian', icon: AlertCircle, label: 'Khuyến mãi / Countdown', route: 'countdown', value: 'Countdown', position: 21 },
  { description: 'Hỏi đáp', icon: HelpCircle, label: 'Câu hỏi thường gặp', route: 'faq', value: 'FAQ', recommended: true, position: 22 },
  { description: 'Giới thiệu ngắn gọn', icon: UserIcon, label: 'Về chúng tôi', route: 'about', value: 'About', position: 23 },
  { description: 'Giới thiệu đội ngũ với ảnh, chức vụ, social links', icon: UserCircle, label: 'Đội ngũ', route: 'team', value: 'Team', position: 24 },
  { description: 'Video giới thiệu hoặc demo sản phẩm', icon: LayoutTemplate, label: 'Video / Media', route: 'video', value: 'Video', position: 25 },
  { description: 'Form liên hệ, bản đồ', icon: Phone, label: 'Liên hệ', route: 'contact', value: 'Contact', position: 26 },
  { description: 'Vị trí đang tuyển', icon: Users, label: 'Tuyển dụng', route: 'career', value: 'Career', position: 27 },
  { description: 'Chân trang', icon: LayoutTemplate, label: 'Footer', route: 'footer', value: 'Footer', singleton: true, recommended: true, position: 28 },
  { description: 'Nút liên hệ nhanh (FAB)', icon: Zap, label: 'Speed Dial', route: 'speed-dial', value: 'SpeedDial', position: 29 },
];

export const DEFAULT_BRAND_COLOR = '#3b82f6';

const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {return { h: 0, l: 0, s: 0 };}
  const r = Number.parseInt(result[1], 16) / 255;
  const g = Number.parseInt(result[2], 16) / 255;
  const b = Number.parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: { h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      }
      case g: { h = ((b - r) / d + 2) / 6; break;
      }
      case b: { h = ((r - g) / d + 4) / 6; break;
      }
    }
  }
  return { h: Math.round(h * 360), l: Math.round(l * 100), s: Math.round(s * 100) };
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const resolveColorSetting = (value: unknown): string | null => {
  if (typeof value !== 'string') {return null;}
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const generateComplementary = (hex: string): string => {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex((h + 180) % 360, s, l);
};

export function useBrandColors() {
  const primarySetting = useQuery(api.settings.getByKey, { key: 'site_brand_primary' });
  const legacySetting = useQuery(api.settings.getByKey, { key: 'site_brand_color' });
  const secondarySetting = useQuery(api.settings.getByKey, { key: 'site_brand_secondary' });

  const primary = resolveColorSetting(primarySetting?.value)
    ?? resolveColorSetting(legacySetting?.value)
    ?? DEFAULT_BRAND_COLOR;

  let secondary: string;
  if (secondarySetting === undefined || secondarySetting === null) {
    secondary = primary;
  } else {
    const secondaryValue = resolveColorSetting(secondarySetting.value);
    secondary = secondaryValue ?? generateComplementary(primary);
  }

  return { primary, secondary };
}

// Hook lấy brandColor từ settings - dùng cho tất cả Preview components
export function useBrandColor() {
  return useBrandColors().primary;
}

// Legacy export - giữ để không breaking change
export const BRAND_COLOR = DEFAULT_BRAND_COLOR;

export function getComponentType(type: string) {
  return COMPONENT_TYPES.find(t => t.value === type || t.route === type);
}

export function ComponentFormWrapper({ 
  type, 
  title, 
  setTitle, 
  active, 
  setActive, 
  onSubmit, 
  isSubmitting = false,
  children 
}: { 
  type: string;
  title: string;
  setTitle: (v: string) => void;
  active: boolean;
  setActive: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const typeInfo = getComponentType(type);
  const TypeIcon = typeInfo?.icon ?? Grid;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Thêm {typeInfo?.label ?? 'Component'}
        </h1>
        <Link href="/admin/home-components/create" className="text-sm text-blue-600 hover:underline">
          ← Quay lại chọn loại
        </Link>
      </div>

      <form onSubmit={onSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TypeIcon size={20} />
              Cấu hình {typeInfo?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input 
                value={title} 
                onChange={(e) =>{  setTitle(e.target.value); }} 
                required 
                placeholder="Nhập tiêu đề component..." 
              />
            </div>
            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div 
                className={cn(
                  "cursor-pointer inline-flex items-center justify-center rounded-full w-8 h-4 transition-colors",
                  active ? "bg-green-500" : "bg-slate-300"
                )} 
                onClick={() =>{  setActive(!active); }}
              >
                <div className={cn(
                  "w-3 h-3 bg-white rounded-full transition-transform",
                  active ? "translate-x-2" : "-translate-x-2"
                )}></div>
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        {children}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() =>{  router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo Component'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function useComponentForm(defaultTitle: string, componentType: string) {
  const router = useRouter();
  const [title, setTitle] = React.useState(defaultTitle);
  const [active, setActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const createMutation = useMutation(api.homeComponents.create);

  const handleSubmit = async (e: React.FormEvent, config: Record<string, unknown> = {}) => {
    e.preventDefault();
    if (isSubmitting) {return;}
    
    setIsSubmitting(true);
    try {
      await createMutation({
        active,
        config,
        title,
        type: componentType,
      });
      toast.success('Đã thêm component mới');
      router.push('/admin/home-components');
    } catch (error) {
      toast.error('Lỗi khi tạo component');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { active, handleSubmit, isSubmitting, router, setActive, setTitle, title };
}

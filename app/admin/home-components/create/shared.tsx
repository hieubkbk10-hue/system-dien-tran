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
import { formatHex, oklch } from 'culori';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../components/ui';
import { HOME_COMPONENT_BASE_TYPES, HOME_COMPONENT_TYPE_VALUES as BASE_COMPONENT_TYPE_VALUES } from '@/lib/home-components/componentTypes';
import { TypeColorOverrideCard } from '../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../_shared/hooks/useTypeColorOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../_shared/lib/typeColorOverride';

const ICON_MAP: Record<string, typeof LayoutTemplate> = {
  About: UserIcon,
  Benefits: Check,
  Blog: FileText,
  Career: Users,
  CaseStudy: FileText,
  CategoryProducts: ShoppingBag,
  Clients: Users,
  Contact: Phone,
  Countdown: AlertCircle,
  CTA: MousePointerClick,
  FAQ: HelpCircle,
  Features: Zap,
  Footer: LayoutTemplate,
  Gallery: ImageIcon,
  Hero: LayoutTemplate,
  Partners: Users,
  Pricing: Tag,
  Process: LayoutTemplate,
  ProductCategories: FolderTree,
  ProductGrid: Package,
  ProductList: Package,
  ServiceList: Briefcase,
  Services: Briefcase,
  SpeedDial: Zap,
  Stats: AlertCircle,
  Team: UserCircle,
  Testimonials: Star,
  TrustBadges: Award,
  Video: LayoutTemplate,
  VoucherPromotions: Tag,
};

export const COMPONENT_TYPES = HOME_COMPONENT_BASE_TYPES.map((type) => ({
  ...type,
  icon: ICON_MAP[type.value] ?? Grid,
}));

export const HOME_COMPONENT_TYPE_VALUES = BASE_COMPONENT_TYPE_VALUES;

export const DEFAULT_BRAND_COLOR = '#3b82f6';

const safeOklch = (value: string) => oklch(value) ?? oklch(DEFAULT_BRAND_COLOR);

const generateComplementary = (hex: string): string => {
  const parsed = safeOklch(hex);
  if (!parsed) {return DEFAULT_BRAND_COLOR;}

  return formatHex(oklch({
    ...parsed,
    h: ((parsed.h ?? 0) + 180) % 360,
  }));
};

const resolveColorSetting = (value: unknown): string | null => {
  if (typeof value !== 'string') {return null;}
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export function useSystemBrandColors() {
  const primarySetting = useQuery(api.settings.getByKey, { key: 'site_brand_primary' });
  const legacySetting = useQuery(api.settings.getByKey, { key: 'site_brand_color' });
  const secondarySetting = useQuery(api.settings.getByKey, { key: 'site_brand_secondary' });
  const modeSetting = useQuery(api.settings.getByKey, { key: 'site_brand_mode' });

  const primary = resolveColorSetting(primarySetting?.value)
    ?? resolveColorSetting(legacySetting?.value)
    ?? DEFAULT_BRAND_COLOR;

  const mode: 'single' | 'dual' = modeSetting?.value === 'single' ? 'single' : 'dual';
  const secondary = mode === 'single'
    ? ''
    : resolveColorSetting(secondarySetting?.value)
      ?? generateComplementary(primary);

  return { primary, secondary, mode };
}

export function useBrandColors(type?: string) {
  if (type && HOME_COMPONENT_TYPE_VALUES.includes(type)) {
    return useTypeColorOverrideState(type).effectiveColors;
  }
  return useSystemBrandColors();
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
  const { customState, showCustomBlock, setCustomState } = useTypeColorOverrideState(type);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

  const handleFormSubmit = (event: React.FormEvent) => {
    void (async () => {
      event.preventDefault();
      if (!HOME_COMPONENT_TYPE_VALUES.includes(type)) {
        toast.error('Loại component không hợp lệ.');
        return;
      }
      if (showCustomBlock) {
        try {
          await setTypeColorOverride({
            type,
            enabled: customState.enabled,
            mode: customState.mode,
            primary: customState.primary,
            secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary),
          });
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Không thể cập nhật custom màu.');
          return;
        }
      }

      onSubmit(event);
    })();
  };

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

      <form onSubmit={handleFormSubmit}>
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

        {showCustomBlock && (
          <div className="mb-6">
            <TypeColorOverrideCard
              title={`Màu custom ${typeInfo?.label ?? type}`}
              enabled={customState.enabled}
              mode={customState.mode}
              primary={customState.primary}
              secondary={customState.secondary}
              compact
              toggleLabel="Custom"
              primaryLabel="Chính"
              secondaryLabel="Phụ"
              onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
              onModeChange={(next) => {
                if (next === 'single') {
                  setCustomState((prev) => ({ ...prev, mode: 'single', secondary: prev.primary }));
                  return;
                }
                setCustomState((prev) => ({
                  ...prev,
                  mode: 'dual',
                  secondary: prev.mode === 'single' ? getSuggestedSecondary(prev.primary) : prev.secondary,
                }));
              }}
              onPrimaryChange={(value) => {
                setCustomState((prev) => ({
                  ...prev,
                  primary: value,
                  secondary: prev.mode === 'single' ? value : prev.secondary,
                }));
              }}
              onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
            />
          </div>
        )}

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

  const handleSubmit = async (e: React.FormEvent, config: object = {}) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await createMutation({
        active,
        config: config as Record<string, unknown>,
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

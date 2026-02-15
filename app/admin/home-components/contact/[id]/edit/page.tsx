'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { ConfigJsonForm } from '../../../_shared/components/ConfigJsonForm';
import { ContactPreview } from '../../_components/ContactPreview';
import { DEFAULT_CONTACT_CONFIG } from '../../_lib/constants';
import type { ContactConfigState, ContactStyle } from '../../_types';

export default function ContactEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [config, setConfig] = useState<ContactConfigState>(DEFAULT_CONTACT_CONFIG);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      if (component.type !== 'Contact') {
        router.replace(`/admin/home-components/${id}/edit?type=${component.type.toLowerCase()}`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const rawConfig = component.config ?? {};
      setConfig({
        address: (rawConfig.address as string | undefined) ?? '',
        email: (rawConfig.email as string | undefined) ?? '',
        formDescription: (rawConfig.formDescription as string | undefined) ?? '',
        formFields: Array.isArray(rawConfig.formFields) ? rawConfig.formFields : DEFAULT_CONTACT_CONFIG.formFields,
        formTitle: (rawConfig.formTitle as string | undefined) ?? '',
        mapEmbed: (rawConfig.mapEmbed as string | undefined) ?? '',
        phone: (rawConfig.phone as string | undefined) ?? '',
        responseTimeText: (rawConfig.responseTimeText as string | undefined) ?? '',
        showMap: rawConfig.showMap !== false,
        socialLinks: Array.isArray(rawConfig.socialLinks) ? rawConfig.socialLinks : [],
        submitButtonText: (rawConfig.submitButtonText as string | undefined) ?? '',
        workingHours: (rawConfig.workingHours as string | undefined) ?? '',
        style: (rawConfig.style as ContactStyle) || 'modern',
      });
    }
  }, [component, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config,
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật Contact');
      router.push('/admin/home-components');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return <div className="text-center py-8 text-slate-500">Không tìm thấy component</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Contact</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone size={20} />
              Contact
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
                  "cursor-pointer inline-flex items-center justify-center rounded-full w-12 h-6 transition-colors",
                  active ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                )}
                onClick={() =>{  setActive(!active); }}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform shadow",
                  active ? "translate-x-2.5" : "-translate-x-2.5"
                )}></div>
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <ConfigJsonForm value={config} onChange={(next) =>{  setConfig(next as ContactConfigState); }} title="Cấu hình Contact" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ContactPreview
              config={config}
              brandColor={primary}
              secondary={secondary}
              selectedStyle={config.style as ContactStyle}
              onStyleChange={(style) =>{  setConfig({ ...config, style }); }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { ServiceListForm } from '../../_components/ServiceListForm';
import { ServiceListPreview } from '../../_components/ServiceListPreview';
import { DEFAULT_SERVICE_LIST_CONFIG } from '../../_lib/constants';
import type { ServiceSelectionMode, ServiceListStyle } from '../../_types';

export default function ServiceListEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);
  const servicesData = useQuery(api.services.listAll, { limit: 100 });

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [serviceListConfig, setServiceListConfig] = useState({
    itemCount: DEFAULT_SERVICE_LIST_CONFIG.itemCount,
    sortBy: DEFAULT_SERVICE_LIST_CONFIG.sortBy,
  });
  const [serviceListStyle, setServiceListStyle] = useState<ServiceListStyle>('grid');
  const [serviceSelectionMode, setServiceSelectionMode] = useState<ServiceSelectionMode>('auto');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      if (component.type !== 'ServiceList') {
        router.replace(`/admin/home-components/${id}/edit?type=${component.type.toLowerCase()}`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      setServiceListConfig({
        itemCount: (config.itemCount as number) ?? DEFAULT_SERVICE_LIST_CONFIG.itemCount,
        sortBy: (config.sortBy as string) ?? DEFAULT_SERVICE_LIST_CONFIG.sortBy,
      });
      setServiceListStyle((config.style as ServiceListStyle) || 'grid');
      setServiceSelectionMode((config.selectionMode as ServiceSelectionMode) || DEFAULT_SERVICE_LIST_CONFIG.selectionMode);
      setSelectedServiceIds((config.selectedServiceIds as string[]) ?? []);
    }
  }, [component, id, router]);

  const filteredServices = useMemo(() => {
    if (!servicesData) {return [];}
    return servicesData
      .filter(service => service.status === 'Published')
      .filter(service => 
        !serviceSearchTerm || 
        service.title.toLowerCase().includes(serviceSearchTerm.toLowerCase())
      );
  }, [servicesData, serviceSearchTerm]);

  const selectedServices = useMemo(() => {
    if (!servicesData || selectedServiceIds.length === 0) {return [];}
    const serviceMap = new Map(servicesData.map(s => [s._id, s]));
    return selectedServiceIds
      .map(id => serviceMap.get(id as Id<'services'>))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);
  }, [servicesData, selectedServiceIds]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds(ids => ids.includes(serviceId)
      ? ids.filter(idValue => idValue !== serviceId)
      : [...ids, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          itemCount: serviceListConfig.itemCount,
          selectionMode: serviceSelectionMode,
          selectedServiceIds: serviceSelectionMode === 'manual' ? selectedServiceIds : [],
          sortBy: serviceListConfig.sortBy,
          style: serviceListStyle,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật Danh sách Dịch vụ');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Danh sách Dịch vụ</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase size={20} />
              Danh sách Dịch vụ
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

        <ServiceListForm
          selectionMode={serviceSelectionMode}
          onSelectionModeChange={setServiceSelectionMode}
          itemCount={serviceListConfig.itemCount}
          sortBy={serviceListConfig.sortBy}
          onItemCountChange={(count) =>{  setServiceListConfig(config => ({ ...config, itemCount: count })); }}
          onSortByChange={(value) =>{  setServiceListConfig(config => ({ ...config, sortBy: value })); }}
          filteredServices={filteredServices}
          selectedServices={selectedServices}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
          serviceSearchTerm={serviceSearchTerm}
          onServiceSearchTermChange={setServiceSearchTerm}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ServiceListPreview
              brandColor={primary}
              secondary={secondary}
              itemCount={serviceSelectionMode === 'manual' ? selectedServiceIds.length : serviceListConfig.itemCount}
              selectedStyle={serviceListStyle}
              onStyleChange={setServiceListStyle}
              items={serviceSelectionMode === 'manual' && selectedServices.length > 0
                ? selectedServices.map(s => ({ description: s.excerpt, id: s._id, image: s.thumbnail, name: s.title, price: s.price ? s.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ' }))
                : filteredServices.slice(0, serviceListConfig.itemCount).map(s => ({ description: s.excerpt, id: s._id, image: s.thumbnail, name: s.title, price: s.price ? s.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ' }))
              }
              title={title}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

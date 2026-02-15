'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { ProductGridForm } from '../../_components/ProductGridForm';
import type { ProductGridProductItem } from '../../_components/ProductGridForm';
import { ProductGridPreview } from '../../_components/ProductGridPreview';
import { DEFAULT_PRODUCT_GRID_CONFIG } from '../../_lib/constants';
import type { ProductGridStyle } from '../../_types';
import type { ProductListPreviewItem } from '../../../product-list/_types';

export default function ProductGridEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const productsData = useQuery(api.products.listAll, { limit: 100 });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [itemCount, setItemCount] = useState(DEFAULT_PRODUCT_GRID_CONFIG.itemCount);
  const [sortBy, setSortBy] = useState(DEFAULT_PRODUCT_GRID_CONFIG.sortBy);
  const [selectionMode, setSelectionMode] = useState(DEFAULT_PRODUCT_GRID_CONFIG.selectionMode);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(DEFAULT_PRODUCT_GRID_CONFIG.selectedProductIds);
  const [subTitle, setSubTitle] = useState(DEFAULT_PRODUCT_GRID_CONFIG.subTitle);
  const [sectionTitle, setSectionTitle] = useState(DEFAULT_PRODUCT_GRID_CONFIG.sectionTitle);
  const [style, setStyle] = useState<ProductGridStyle>(DEFAULT_PRODUCT_GRID_CONFIG.style);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  useEffect(() => {
    if (!component || isInitialized) {return;}
    if (component.type !== 'ProductGrid') {
      router.replace(`/admin/home-components/${id}/edit?type=${component.type.toLowerCase()}`);
      return;
    }

    setTitle(component.title);
    setActive(component.active);

    const config = component.config ?? {};
    setItemCount(config.itemCount ?? DEFAULT_PRODUCT_GRID_CONFIG.itemCount);
    setSortBy(config.sortBy ?? DEFAULT_PRODUCT_GRID_CONFIG.sortBy);
    setSelectionMode(config.selectionMode ?? DEFAULT_PRODUCT_GRID_CONFIG.selectionMode);
    setSelectedProductIds(config.selectedProductIds ?? []);
    setSubTitle(config.subTitle ?? DEFAULT_PRODUCT_GRID_CONFIG.subTitle);
    setSectionTitle(config.sectionTitle ?? DEFAULT_PRODUCT_GRID_CONFIG.sectionTitle);
    setStyle((config.style as ProductGridStyle) ?? DEFAULT_PRODUCT_GRID_CONFIG.style);
    setIsInitialized(true);
  }, [component, id, isInitialized, router]);

  const filteredProducts = useMemo<ProductGridProductItem[]>(() => {
    if (!productsData) {return [];}
    return productsData
      .filter(product => product.status === 'Active')
      .filter(product => !productSearchTerm || product.name.toLowerCase().includes(productSearchTerm.toLowerCase()))
      .map(product => ({
        _id: product._id,
        image: product.image,
        name: product.name,
        price: product.price,
      }));
  }, [productsData, productSearchTerm]);

  const selectedProducts = useMemo<ProductGridProductItem[]>(() => {
    if (!productsData || selectedProductIds.length === 0) {return [];}
    const productMap = new Map(productsData.map(product => [product._id, product]));
    return selectedProductIds
      .map(idValue => productMap.get(idValue as Id<'products'>))
      .filter((product): product is NonNullable<typeof product> => product !== undefined)
      .map(product => ({
        _id: product._id,
        image: product.image,
        name: product.name,
        price: product.price,
      }));
  }, [productsData, selectedProductIds]);

  const productPreviewItems: ProductListPreviewItem[] = useMemo(() => selectedProducts.map((p) => ({
    description: p.name,
    id: p._id,
    image: p.image ?? undefined,
    name: p.name,
    price: p.price ? `${p.price.toLocaleString('vi-VN')}đ` : undefined,
  })), [selectedProducts]);

  const autoProductPreviewItems: ProductListPreviewItem[] = useMemo(() => {
    if (!productsData) {return [];} 
    return productsData
      .filter(product => product.status === 'Active')
      .slice(0, itemCount)
      .map(product => ({
        description: product.name,
        id: product._id,
        image: product.image ?? undefined,
        name: product.name,
        price: product.price ? `${product.price.toLocaleString('vi-VN')}đ` : undefined,
      }));
  }, [productsData, itemCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          itemCount,
          sectionTitle,
          selectedProductIds: selectionMode === 'manual' ? selectedProductIds : [],
          selectionMode,
          sortBy,
          style,
          subTitle,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật Sản phẩm');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Sản phẩm</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package size={20} />
              Sản phẩm
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

        <ProductGridForm
          itemCount={itemCount}
          setItemCount={setItemCount}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedProductIds={selectedProductIds}
          setSelectedProductIds={setSelectedProductIds}
          subTitle={subTitle}
          setSubTitle={setSubTitle}
          sectionTitle={sectionTitle}
          setSectionTitle={setSectionTitle}
          productSearchTerm={productSearchTerm}
          setProductSearchTerm={setProductSearchTerm}
          selectedProducts={selectedProducts}
          filteredProducts={filteredProducts}
          isLoading={productsData === undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ProductGridPreview
              brandColor={primary}
              secondary={secondary}
              itemCount={selectionMode === 'manual' ? selectedProductIds.length : itemCount}
              selectedStyle={style}
              onStyleChange={setStyle}
              items={selectionMode === 'manual' && productPreviewItems.length > 0
                ? productPreviewItems
                : (autoProductPreviewItems.length > 0 ? autoProductPreviewItems : undefined)
              }
              subTitle={subTitle}
              sectionTitle={sectionTitle}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

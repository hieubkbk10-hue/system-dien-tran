'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import type { ProductListPreviewItem } from '../../product-list/_types';
import type { ProductGridProductItem } from '../../product-grid/_components/ProductGridForm';
import { ProductGridForm } from '../../product-grid/_components/ProductGridForm';
import { ProductGridPreview } from '../../product-grid/_components/ProductGridPreview';
import type { ProductGridStyle } from '../../product-grid/_types';

function ProductGridCreateContent() {
  const COMPONENT_TYPE = 'ProductGrid';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Sản phẩm', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE);
  const { primary, secondary } = effectiveColors;

  const [itemCount, setItemCount] = useState(8);
  const [sortBy, setSortBy] = useState<'newest' | 'bestseller' | 'random'>('newest');
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual'>('auto');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [subTitle, setSubTitle] = useState('Bộ sưu tập');
  const [sectionTitle, setSectionTitle] = useState('Sản phẩm nổi bật');
  const [style, setStyle] = useState<ProductGridStyle>('commerce');

  const productsData = useQuery(api.products.listAll, { limit: 100 });

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

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      itemCount,
      sectionTitle,
      selectedProductIds: selectionMode === 'manual' ? selectedProductIds : [],
      selectionMode,
      sortBy,
      style,
      subTitle,
    });
  };

  return (
    <ComponentFormWrapper
      type={COMPONENT_TYPE}
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      customState={customState}
      showCustomBlock={showCustomBlock}
      setCustomState={setCustomState}
      systemColors={systemColors}
    >
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
        <div />
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
    </ComponentFormWrapper>
  );
}

export default function ProductGridCreatePage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ProductGridCreateContent />
    </Suspense>
  );
}

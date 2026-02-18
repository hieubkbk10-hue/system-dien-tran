import React from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { CATEGORY_PRODUCTS_STYLES } from '../_lib/constants';
import type { CategoryProductsConfig, CategoryProductsProduct, CategoryProductsSection, CategoryProductsStyle } from '../_types';

interface CategoryProductsPreviewProps {
  config: CategoryProductsConfig;
  brandColor: string;
  secondary: string;
  selectedStyle: CategoryProductsStyle;
  onStyleChange: (style: CategoryProductsStyle) => void;
  categoriesData: { _id: string; name: string; slug?: string; image?: string }[];
  productsData: CategoryProductsProduct[];
}

export const CategoryProductsPreview = ({ 
  config, 
  brandColor: _brandColor, 
  secondary,
  selectedStyle, 
  onStyleChange, 
  categoriesData,
  productsData,
}: CategoryProductsPreviewProps) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle || 'grid';
  const setPreviewStyle = (s: string) =>{  onStyleChange(s as CategoryProductsStyle); };

  // Resolve sections with category and products data
  const resolvedSections = config.sections
    .map((section) => {
      const category = categoriesData.find(c => c._id === section.categoryId);
      if (!category) {return null;}

      const products = productsData
        .filter(p => p.categoryId === section.categoryId)
        .slice(0, section.itemCount);

      return {
        ...section,
        category,
        products,
      };
    })
    .filter(Boolean) as (CategoryProductsSection & { 
      category: { _id: string; name: string; slug?: string; image?: string }; 
      products: CategoryProductsProduct[]; 
    })[];

  const getGridCols = () => {
    if (device === 'mobile') {
      return config.columnsMobile === 1 ? 'grid-cols-1' : 'grid-cols-2';
    }
    if (device === 'tablet') {
      return 'grid-cols-3';
    }
    switch (config.columnsDesktop) {
      case 3: { return 'grid-cols-3';
      }
      case 5: { return 'grid-cols-5';
      }
      default: { return 'grid-cols-4';
      }
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) {return '0đ';}
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Get info for PreviewWrapper based on style with image size recommendations
  const getPreviewInfo = () => {
    const sectionCount = resolvedSections.length;
    const totalProducts = resolvedSections.reduce((sum, s) => sum + s.products.length, 0);

    if (sectionCount === 0) {return 'Chưa có section nào';}

    switch (previewStyle) {
      case 'grid': {
        return `${sectionCount} section • ${totalProducts} SP • Ảnh: 800×800px (1:1)`;
      }
      case 'carousel': {
        return `${sectionCount} section • ${totalProducts} SP • Ảnh: 800×800px (1:1)`;
      }
      case 'cards': {
        return `${sectionCount} section • ${totalProducts} SP • Ảnh: 800×800px (1:1)`;
      }
      case 'bento': {
        return `${sectionCount} section • Featured: 800×800px • Others: 600×400px`;
      }
      case 'magazine': {
        return `${sectionCount} section • Featured: 800×1000px (4:5) • Grid: 600×600px`;
      }
      case 'showcase': {
        return `${sectionCount} section • Featured: 1200×800px (3:2) • Others: 600×600px`;
      }
      default: {
        return `${sectionCount} section • ${totalProducts} sản phẩm`;
      }
    }
  };

  // Empty State Component with brandColor
  const EmptyState = ({ message, size = 'normal' }: { message: string; size?: 'small' | 'normal' }) => (
    <div 
      className={cn(
        'text-center rounded-xl flex flex-col items-center justify-center',
        size === 'small' ? 'py-6' : 'py-12'
      )}
      style={{ backgroundColor: `${secondary}05` }}
    >
      <div 
        className={cn(
          'rounded-full flex items-center justify-center mb-3',
          size === 'small' ? 'w-12 h-12' : 'w-16 h-16'
        )}
        style={{ backgroundColor: `${secondary}10` }}
      >
        <Package size={size === 'small' ? 24 : 32} style={{ color: `${secondary}50` }} />
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );

  // Product Card Component with Equal Height (line-clamp + min-height)
  const ProductCard = ({ product }: { product: CategoryProductsProduct }) => (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="aspect-square rounded-lg overflow-hidden mb-2" style={{ backgroundColor: `${secondary}08` }}>
        {product.image ? (
          <PreviewImage 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={24} style={{ color: `${secondary}40` }} />
          </div>
        )}
      </div>
      <h4 className={cn(
        'font-medium line-clamp-2',
        device === 'mobile' ? 'text-xs min-h-[2rem]' : 'text-sm min-h-[2.5rem]'
      )}>{product.name || 'Tên sản phẩm'}</h4>
      <div className="flex flex-col mt-auto">
        {product.salePrice && product.salePrice < (product.price ?? 0) ? (
          <>
            <span className={cn('font-bold', device === 'mobile' ? 'text-xs' : 'text-sm')} style={{ color: secondary }}>
              {formatPrice(product.salePrice)}
            </span>
            <span className="text-[10px] text-slate-400 line-through">{formatPrice(product.price)}</span>
          </>
        ) : (
          <span className={cn('font-bold', device === 'mobile' ? 'text-xs' : 'text-sm')} style={{ color: secondary }}>
            {formatPrice(product.price)}
          </span>
        )}
      </div>
    </div>
  );

  // Style 1: Grid - Classic grid layout per section
  const renderGridStyle = () => (
    <div className="w-full py-4 space-y-8 md:space-y-12">
      {resolvedSections.length === 0 ? (
        <div className="px-4">
          <EmptyState message="Chưa chọn danh mục nào" />
        </div>
      ) : (
        resolvedSections.map((section) => (
          <section key={section.id} className="px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className={cn(
                  'font-bold',
                  device === 'mobile' ? 'text-lg' : 'text-xl md:text-2xl'
                )}>{section.category.name}</h2>
                {config.showViewAll && (
                  <button 
                    className="text-sm font-medium flex items-center gap-1 hover:underline px-3 py-1.5 rounded-lg border transition-colors"
                    style={{ borderColor: `${secondary}30`, color: secondary }}
                  >
                    Xem danh mục <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {section.products.length === 0 ? (
                <EmptyState message="Chưa có sản phẩm trong danh mục này" size="small" />
              ) : (
                <div className={cn('grid gap-4', getGridCols())}>
                  {section.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );

  // Style 2: Carousel - Horizontal scroll
  const renderCarouselStyle = () => (
    <div className="w-full py-4 space-y-8 md:space-y-12">
      {resolvedSections.length === 0 ? (
        <div className="px-4">
          <EmptyState message="Chưa chọn danh mục nào" />
        </div>
      ) : (
        resolvedSections.map((section) => (
          <section key={section.id}>
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between px-4 mb-4">
                <h2 className={cn(
                  'font-bold',
                  device === 'mobile' ? 'text-lg' : 'text-xl md:text-2xl'
                )}>{section.category.name}</h2>
                {config.showViewAll && (
                  <button 
                    className="text-sm font-medium flex items-center gap-1 hover:underline"
                    style={{ color: secondary }}
                  >
                    Xem danh mục <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {section.products.length === 0 ? (
                <div className="mx-4">
                  <EmptyState message="Chưa có sản phẩm" size="small" />
                </div>
              ) : (
                <div className="overflow-x-auto pb-4 px-4 scrollbar-hide">
                  <div className="flex gap-4">
                    {section.products.map((product) => (
                      <div 
                        key={product._id}
                        className={cn(
                          'flex-shrink-0 group cursor-pointer',
                          device === 'mobile' ? 'w-36' : 'w-48'
                        )}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2">
                          {product.image ? (
                            <PreviewImage 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                        <h4 className={cn(
                          'font-medium line-clamp-2 mb-1',
                          device === 'mobile' ? 'text-xs' : 'text-sm'
                        )}>{product.name}</h4>
                        <span className={cn('font-bold', device === 'mobile' ? 'text-sm' : 'text-base')} style={{ color: secondary }}>
                          {formatPrice(product.salePrice ?? product.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );

  // Style 3: Cards - Modern cards with category header
  const renderCardsStyle = () => (
    <div className="w-full py-4 space-y-8 md:space-y-12">
      {resolvedSections.length === 0 ? (
        <div className="px-4">
          <EmptyState message="Chưa chọn danh mục nào" />
        </div>
      ) : (
        resolvedSections.map((section) => (
          <section key={section.id} className="px-4">
            <div className="max-w-7xl mx-auto">
              <div 
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${secondary}20` }}
              >
                <div 
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: `${secondary}08` }}
                >
                  <div className="flex items-center gap-3">
                    {section.category.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                        <PreviewImage 
                          src={section.category.image} 
                          alt={section.category.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <h2 className={cn(
                      'font-bold',
                      device === 'mobile' ? 'text-base' : 'text-lg'
                    )}>{section.category.name}</h2>
                  </div>
                  {config.showViewAll && (
                    <button 
                      className="text-sm font-medium flex items-center gap-1 hover:underline px-3 py-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: `${secondary}15`, color: secondary }}
                    >
                      Xem danh mục <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                <div className="p-4 bg-white dark:bg-slate-900">
                  {section.products.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Package size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Chưa có sản phẩm</p>
                    </div>
                  ) : (
                    <div className={cn('grid gap-4', getGridCols())}>
                      {section.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );

  // Style 4: Bento - Featured product với grid layout sáng tạo
  const renderBentoStyle = () => (
    <div className="w-full py-4 space-y-10 md:space-y-16">
      {resolvedSections.length === 0 ? (
        <div className="px-4">
          <EmptyState message="Chưa chọn danh mục nào" />
        </div>
      ) : (
        resolvedSections.map((section) => {
          const featured = section.products[0];
          const others = section.products.slice(1, 5);

          return (
            <section key={section.id} className="px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: secondary }}
                    />
                    <h2 className={cn(
                      'font-bold',
                      device === 'mobile' ? 'text-lg' : 'text-xl md:text-2xl'
                    )}>{section.category.name}</h2>
                  </div>
                  {config.showViewAll && (
                    <button 
                      className="text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-full transition-all hover:shadow-md"
                      style={{ backgroundColor: `${secondary}10`, color: secondary }}
                    >
                      Xem danh mục <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {section.products.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Chưa có sản phẩm</p>
                  </div>
                ) : (device === 'mobile' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {section.products.slice(0, 4).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4 auto-rows-[180px]">
                    {featured && (
                      <div className="col-span-2 row-span-2 group cursor-pointer relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {featured.image ? (
                          <PreviewImage 
                            src={featured.image} 
                            alt={featured.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} className="text-slate-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                          <span 
                            className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2"
                            style={{ backgroundColor: secondary }}
                          >
                            Nổi bật
                          </span>
                          <h3 className="font-bold text-base line-clamp-2 mb-1">{featured.name}</h3>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                            {featured.salePrice && featured.salePrice < (featured.price ?? 0) ? (
                              <>
                                <span className="font-bold text-base">{formatPrice(featured.salePrice)}</span>
                                <span className="text-xs text-white/60 line-through">{formatPrice(featured.price)}</span>
                              </>
                            ) : (
                              <span className="font-bold text-base">{formatPrice(featured.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {others.map((product) => (
                      <div key={product._id} className="group cursor-pointer relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {product.image ? (
                          <PreviewImage 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-slate-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <h4 className="font-medium text-xs line-clamp-1">{product.name}</h4>
                          <span className="font-bold text-xs">{formatPrice(product.salePrice ?? product.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );

  // Style 5: Magazine - Editorial Grid với Featured Item + Grid nhỏ
  const renderMagazineStyle = () => (
    <div className="w-full py-4 space-y-12 md:space-y-16">
      {resolvedSections.length === 0 ? (
        <div className="px-4">
          <EmptyState message="Chưa chọn danh mục nào" />
        </div>
      ) : (
        resolvedSections.map((section) => {
          const featured = section.products[0];
          const gridItems = section.products.slice(1, 5);

          return (
            <section key={section.id} className="px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-6 pb-4 border-b-2" style={{ borderColor: `${secondary}20` }}>
                  <div>
                    <span 
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: secondary }}
                    >
                      Bộ sưu tập
                    </span>
                    <h2 className={cn(
                      'font-bold tracking-tight mt-1',
                      device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl'
                    )}>{section.category.name}</h2>
                  </div>
                  {config.showViewAll && (
                    <button 
                      className={cn(
                        'font-semibold flex items-center gap-2 transition-all hover:gap-3',
                        device === 'mobile' ? 'text-sm' : 'text-base'
                      )}
                      style={{ color: secondary }}
                    >
                      Xem tất cả <ArrowRight size={device === 'mobile' ? 16 : 18} />
                    </button>
                  )}
                </div>

                {section.products.length === 0 ? (
                  <EmptyState message="Chưa có sản phẩm" size="small" />
                ) : (device === 'mobile' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {section.products.slice(0, 4).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {featured && (
                      <div className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/5]" style={{ backgroundColor: `${secondary}08` }}>
                        {featured.image ? (
                          <PreviewImage 
                            src={featured.image} 
                            alt={featured.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} style={{ color: `${secondary}30` }} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                            style={{ backgroundColor: secondary }}
                          >
                            Nổi bật
                          </span>
                          <h3 className="font-bold text-xl md:text-2xl line-clamp-2 mb-2">{featured.name}</h3>
                          <div className="flex items-baseline gap-3">
                            {featured.salePrice && featured.salePrice < (featured.price ?? 0) ? (
                              <>
                                <span className="font-bold text-2xl">{formatPrice(featured.salePrice)}</span>
                                <span className="text-sm text-white/60 line-through">{formatPrice(featured.price)}</span>
                              </>
                            ) : (
                              <span className="font-bold text-2xl">{formatPrice(featured.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {gridItems.map((product) => (
                        <div key={product._id} className="group cursor-pointer">
                          <div 
                            className="aspect-square rounded-xl overflow-hidden mb-3 relative"
                          style={{ backgroundColor: `${secondary}08` }}
                          >
                            {product.image ? (
                              <PreviewImage 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} style={{ color: `${secondary}30` }} />
                              </div>
                            )}
                            <div 
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: `${secondary}20` }}
                            >
                              <span 
                                className="px-4 py-2 rounded-full text-sm font-medium text-white"
                                style={{ backgroundColor: secondary }}
                              >
                                Xem nhanh
                              </span>
                            </div>
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                          <div className="flex items-baseline gap-2 mt-1">
                            {product.salePrice && product.salePrice < (product.price ?? 0) ? (
                              <>
                                <span className="font-bold text-sm" style={{ color: secondary }}>
                                  {formatPrice(product.salePrice)}
                                </span>
                                <span className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</span>
                              </>
                            ) : (
                              <span className="font-bold text-sm" style={{ color: secondary }}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {gridItems.length < 4 && Array.from({ length: 4 - gridItems.length }).map((_, i) => (
                        <div 
                          key={`empty-${i}`} 
                          className="aspect-square rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${secondary}05`, border: `2px dashed ${secondary}20` }}
                        >
                          <Package size={24} style={{ color: `${secondary}20` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );

  // Style 6: Showcase - Gradient overlay với hover effects lung linh
  const renderShowcaseStyle = () => (
    <div className="w-full py-4 space-y-10 md:space-y-16">
      {resolvedSections.length === 0 ? (
        <div className="px-4">
          <EmptyState message="Chưa chọn danh mục nào" />
        </div>
      ) : (
        resolvedSections.map((section) => (
          <section key={section.id}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: secondary }}
                  >
                    Bộ sưu tập
                  </span>
                  <h2 className={cn(
                    'font-bold mt-1',
                    device === 'mobile' ? 'text-xl' : 'text-2xl md:text-3xl'
                  )}>{section.category.name}</h2>
                  <div 
                    className="h-1 w-16 rounded-full mt-2"
                    style={{ background: `linear-gradient(to right, ${secondary}, ${secondary}40)` }}
                  />
                </div>
                {config.showViewAll && (
                  <button 
                    className="group flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: secondary }}
                  >
                    Xem tất cả 
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                      style={{ backgroundColor: `${secondary}15` }}
                    >
                      <ArrowRight size={14} />
                    </span>
                  </button>
                )}
              </div>

              {section.products.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có sản phẩm</p>
                </div>
              ) : (
                <div className={cn(
                  'grid gap-5',
                  device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'
                )}>
                  {section.products.map((product) => (
                    <div 
                      key={product._id} 
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3">
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ 
                            background: `linear-gradient(135deg, ${secondary}20 0%, transparent 50%, ${secondary}10 100%)`,
                          }}
                        />

                        {product.image ? (
                          <PreviewImage 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Package size={32} className="text-slate-300" />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            className="w-full py-2.5 rounded-xl text-sm font-medium text-white backdrop-blur-sm transition-colors"
                            style={{ backgroundColor: `${secondary}dd` }}
                          >
                            Xem chi tiết
                          </button>
                        </div>

                        {product.salePrice && product.salePrice < (product.price ?? 0) && (
                          <div 
                            className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: '#ef4444' }}
                          >
                            -{Math.round((1 - product.salePrice / (product.price ?? 1)) * 100)}%
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className={cn(
                          'font-medium line-clamp-2 group-hover:text-opacity-80 transition-colors',
                          device === 'mobile' ? 'text-xs' : 'text-sm'
                        )}>{product.name}</h4>
                        <div className="flex flex-col">
                          {product.salePrice && product.salePrice < (product.price ?? 0) ? (
                            <>
                              <span 
                                className={cn('font-bold', device === 'mobile' ? 'text-xs' : 'text-sm')} 
                              style={{ color: secondary }}
                              >
                                {formatPrice(product.salePrice)}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <span 
                              className={cn('font-bold', device === 'mobile' ? 'text-xs' : 'text-sm')} 
                              style={{ color: secondary }}
                            >
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );

  return (
    <>
      <PreviewWrapper 
        title="Preview Sản phẩm theo danh mục" 
        device={device} 
        setDevice={setDevice} 
        previewStyle={previewStyle} 
        setPreviewStyle={setPreviewStyle} 
        styles={CATEGORY_PRODUCTS_STYLES} 
        info={getPreviewInfo()}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame>
          {previewStyle === 'grid' && renderGridStyle()}
          {previewStyle === 'carousel' && renderCarouselStyle()}
          {previewStyle === 'cards' && renderCardsStyle()}
          {previewStyle === 'bento' && renderBentoStyle()}
          {previewStyle === 'magazine' && renderMagazineStyle()}
          {previewStyle === 'showcase' && renderShowcaseStyle()}
        </BrowserFrame>
      </PreviewWrapper>
      <ColorInfoPanel brandColor={_brandColor} secondary={secondary} />
    </>
  );
};

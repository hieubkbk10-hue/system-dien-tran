import React from 'react';
import { ChevronDown, FileText, Heart, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { getPostsListColors, type PostsListColors, type PostsListColorMode } from '@/components/site/posts/colors';

type ListLayoutStyle = 'fullwidth' | 'sidebar' | 'magazine' | 'grid' | 'list' | 'masonry';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
type PaginationType = 'pagination' | 'infiniteScroll';
type ProductsListLayoutStyle = 'grid' | 'sidebar' | 'list';

type PostsListPreviewProps = {
  layoutStyle: ListLayoutStyle;
  paginationType?: PaginationType;
  showSearch?: boolean;
  showCategories?: boolean;
  brandColor?: string;
  secondaryColor?: string;
  colorMode?: PostsListColorMode;
  device?: PreviewDevice;
};

const normalizeLayoutStyle = (style: ListLayoutStyle): 'fullwidth' | 'sidebar' | 'magazine' => {
  if (style === 'grid' || style === 'fullwidth') {return 'fullwidth';}
  if (style === 'list' || style === 'sidebar') {return 'sidebar';}
  return 'magazine';
};

function PaginationPreview({
  paginationType,
  brandColor,
  tokens,
}: {
  paginationType: PaginationType;
  brandColor: string;
  tokens?: PostsListColors;
}) {
  const previewTokens = tokens ?? getPostsListColors(brandColor, undefined, 'single');

  if (paginationType === 'pagination') {
    return (
      <div className="text-center mt-6">
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor: previewTokens.paginationButtonHoverBg,
            color: previewTokens.paginationButtonText,
            borderColor: previewTokens.paginationButtonBorder,
          }}
        >
          1 &nbsp; 2 &nbsp; 3 &nbsp; ... &nbsp; 10
        </button>
      </div>
    );
  }
  return (
    <div className="text-center mt-6 space-y-2">
      <div className="flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: previewTokens.loadingDotStrong }} />
        <div className="w-2 h-2 rounded-full animate-pulse delay-100" style={{ backgroundColor: previewTokens.loadingDotMedium }} />
        <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ backgroundColor: previewTokens.loadingDotSoft }} />
      </div>
      <p className="text-xs" style={{ color: previewTokens.neutralTextLight }}>Cuộn để xem thêm...</p>
    </div>
  );
}

export function PostsListPreview({
  layoutStyle,
  paginationType = 'pagination',
  showSearch = true,
  showCategories = true,
  brandColor = '#3b82f6',
  secondaryColor,
  colorMode = 'single',
  device = 'desktop',
}: PostsListPreviewProps) {
  const style = normalizeLayoutStyle(layoutStyle);
  const tokens = getPostsListColors(brandColor, secondaryColor, colorMode);
  const mockPosts = [
    { category: 'Tin tức', date: '10/01/2026', id: 1, title: 'Bài viết nổi bật số 1', views: 1234 },
    { category: 'Hướng dẫn', date: '09/01/2026', id: 2, title: 'Hướng dẫn sử dụng sản phẩm', views: 567 },
    { category: 'Tin tức', date: '08/01/2026', id: 3, title: 'Cập nhật tính năng mới', views: 890 },
    { category: 'Tips', date: '07/01/2026', id: 4, title: 'Tips và tricks hữu ích', views: 432 },
  ];
  const categories = ['Tất cả', 'Tin tức', 'Hướng dẫn', 'Tips'];
  const showFilterBar = showSearch || showCategories;

  const isMobile = device === 'mobile';
  const isDesktop = device === 'desktop';
  const isCompact = device !== 'desktop';
  const visiblePosts = device === 'mobile' ? 2 : 4;
  const showMobilePanel = isCompact && (showSearch || showCategories);
  const gridClass = isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3';

  if (style === 'fullwidth') {
    return (
      <div className="py-6 md:py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: tokens.headingColor }}>Tin tức & Bài viết</h2>
          </div>
        {showFilterBar && (
          <div className="mb-5 space-y-2.5">
            <div
              className="rounded-lg border p-3 shadow-sm"
              style={{ backgroundColor: tokens.filterBarBackground, borderColor: tokens.cardBorder }}
            >
              <div className="flex items-center gap-2">
                {/* Search - Responsive width: max-w-xs on desktop, full width on mobile/tablet */}
                {showSearch && (
                  <div className={`relative flex-1 min-w-0 ${isDesktop ? 'max-w-xs' : ''}`}>
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tokens.inputIcon }} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm placeholder:text-[var(--placeholder-color)]"
                      style={{
                        '--placeholder-color': tokens.inputPlaceholder,
                        borderColor: tokens.inputBorder,
                        backgroundColor: tokens.inputBackground,
                        color: tokens.inputText,
                      } as React.CSSProperties}
                      disabled
                    />
                  </div>
                )}
                
                {/* Category Dropdown - Desktop only */}
                {showCategories && isDesktop && (
                  <div className="relative">
                    <select
                      className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm min-w-[140px]"
                      style={{
                        borderColor: tokens.inputBorder,
                        backgroundColor: tokens.inputBackground,
                        color: tokens.inputText,
                      }}
                      disabled
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: tokens.inputIcon }} />
                  </div>
                )}
                
                {/* Spacer - Desktop only (pushes Sort to right) */}
                {isDesktop && <div className="flex-1" />}
                
                {/* Sort Dropdown - Desktop only, right-aligned */}
                {isDesktop && (
                  <div className="relative">
                    <select
                      className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm"
                      style={{
                        borderColor: tokens.inputBorder,
                        backgroundColor: tokens.inputBackground,
                        color: tokens.inputText,
                      }}
                      disabled
                    >
                      <option>Mới nhất</option>
                      <option>Cũ nhất</option>
                      <option>Xem nhiều</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: tokens.inputIcon }} />
                  </div>
                )}
                
                {/* Mobile Filter Toggle - Mobile/Tablet only */}
                {showMobilePanel && (
                  <button
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm shrink-0"
                    style={{ borderColor: tokens.inputBorder, color: tokens.bodyText, backgroundColor: tokens.cardBackground }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Bộ lọc
                  </button>
                )}
              </div>
              
              {/* Mobile Filter Panel - Mobile/Tablet only, always visible */}
              {showMobilePanel && (
                <div className="mt-3 pt-3 border-t space-y-3" style={{ borderColor: tokens.cardBorder }}>
                  {showCategories && (
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: tokens.neutralTextLight }}>
                        Danh mục
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat, i) => (
                          <span
                            key={cat}
                            className={`px-2.5 py-1 rounded-full text-sm font-medium ${i === 0 ? 'text-white' : ''}`}
                            style={i === 0 ? {
                              backgroundColor: tokens.filterActiveBg,
                              color: tokens.filterActiveText,
                            } : {
                              backgroundColor: tokens.filterTagBg,
                              color: tokens.filterTagText,
                              borderColor: tokens.filterTagBorder,
                            }}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block" style={{ color: tokens.neutralTextLight }}>
                      Sắp xếp
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      style={{
                        borderColor: tokens.inputBorder,
                        backgroundColor: tokens.inputBackground,
                        color: tokens.inputText,
                      }}
                      disabled
                    >
                      <option>Mới nhất</option>
                      <option>Cũ nhất</option>
                      <option>Xem nhiều</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Applied Filters Row - Desktop full layout */}
            {isDesktop ? (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm" style={{ color: tokens.filterCountText }}>4 bài viết</span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: tokens.filterTagBg,
                      color: tokens.filterTagText,
                      borderColor: tokens.filterTagBorder,
                    }}
                  >
                    Tin tức
                  </span>
                </div>
                <button className="text-sm hover:underline" style={{ color: tokens.filterClearText }}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="text-sm" style={{ color: tokens.filterCountText }}>4 bài viết</div>
            )}
          </div>
        )}
        
        {/* Grid - Explicit device-based columns */}
        <div className={`grid ${gridClass} gap-3`}>
          {mockPosts.slice(0, visiblePosts).map((post) => (
            <div key={post.id} className="rounded-lg overflow-hidden shadow-sm border h-full flex flex-col" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
              <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: tokens.cardBorder }}>
                <FileText size={24} style={{ color: tokens.neutralTextLight }} />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: tokens.categoryBadgeBg,
                      color: tokens.categoryBadgeText,
                      borderColor: tokens.categoryBadgeBorder,
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 flex-1" style={{ color: tokens.bodyText }}>{post.title}</h3>
                <div className="h-3 rounded mt-1.5 w-4/5" style={{ backgroundColor: tokens.cardBorder }} />
                <div className="flex items-center justify-between text-xs mt-2.5 pt-2.5 border-t" style={{ color: tokens.neutralTextLight, borderColor: tokens.cardBorder }}>
                  <span>{post.date}</span>
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <PaginationPreview paginationType={paginationType} brandColor={brandColor} tokens={tokens} />
        </div>
      </div>
    );
  }

  if (style === 'sidebar') {
    // Sidebar layout: Desktop: sidebar left | Mobile: sidebar bottom
    const sidebarWidth = isDesktop ? 'lg:w-64' : '';
    const containerClass = isMobile ? 'flex-col' : (isDesktop ? 'lg:flex-row' : 'flex-col');
    const sidebarOrder = isMobile ? 'order-2' : (isDesktop ? 'lg:order-1' : 'order-2');
    const mainOrder = isMobile ? 'order-1' : (isDesktop ? 'lg:order-2' : 'order-1');
    
    return (
      <div className={`py-6 md:py-10 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: tokens.headingColor }}>Tin tức & Bài viết</h2>
          </div>
          
          <div className={`flex ${containerClass} gap-5`}>
            {/* Sidebar */}
            <aside className={`${sidebarWidth} flex-shrink-0 ${sidebarOrder}`}>
              <div className="space-y-3">
                {/* Search Widget */}
                {showSearch && (
                  <div className="rounded-lg border p-3" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: tokens.bodyText }}>
                      <Search size={14} style={{ color: tokens.sidebarWidgetIcon }} />
                      Tìm kiếm
                    </h3>
                    <input
                      type="text"
                      placeholder="Nhập từ khóa..."
                      className="w-full px-3 py-2 border rounded-lg text-sm placeholder:text-[var(--placeholder-color)]"
                      style={{
                        '--placeholder-color': tokens.inputPlaceholder,
                        borderColor: tokens.inputBorder,
                        backgroundColor: tokens.inputBackground,
                        color: tokens.inputText,
                      } as React.CSSProperties}
                      disabled
                    />
                  </div>
                )}
                
                {/* Categories Widget */}
                {showCategories && (
                  <div className="rounded-lg border p-3" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: tokens.bodyText }}>
                      <FileText size={14} style={{ color: tokens.sidebarWidgetIcon }} />
                      Danh mục
                    </h3>
                    <ul className="space-y-0.5">
                      {categories.map((cat, i) => (
                        <li key={cat}>
                          <button
                            className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${
                              i === 0 ? 'font-medium' : ''
                            }`}
                            style={i === 0 ? {
                              backgroundColor: tokens.sidebarActiveItemBg,
                              color: tokens.sidebarActiveItemText,
                              borderColor: tokens.sidebarActiveItemBorder,
                            } : {
                              color: tokens.metaText,
                            }}
                            disabled
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Sort Widget */}
                <div className="rounded-lg border p-3" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: tokens.bodyText }}>Sắp xếp</h3>
                  <div className="relative">
                    <select
                      className="w-full appearance-none px-3 py-2 border rounded-lg text-sm"
                      style={{
                        borderColor: tokens.inputBorder,
                        backgroundColor: tokens.inputBackground,
                        color: tokens.inputText,
                      }}
                      disabled
                    >
                      <option>Mới nhất</option>
                      <option>Cũ nhất</option>
                      <option>Xem nhiều</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: tokens.inputIcon }} />
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Main Content */}
            <main className={`flex-1 ${mainOrder}`}>
              <div className="space-y-2.5">
                {mockPosts.slice(0, visiblePosts).map((post) => (
                  <div key={post.id} className="rounded-lg overflow-hidden border" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className={`${isMobile ? '' : 'sm:w-40 md:w-48'} flex-shrink-0`}>
                        <div className={`${isMobile ? 'aspect-video' : 'aspect-video sm:aspect-[4/3] sm:h-full'} flex items-center justify-center relative`} style={{ backgroundColor: tokens.cardBorder }}>
                          <FileText size={28} style={{ color: tokens.neutralTextLight }} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: tokens.categoryBadgeBg,
                              color: tokens.categoryBadgeText,
                              borderColor: tokens.categoryBadgeBorder,
                            }}
                          >
                            {post.category}
                          </span>
                          <span className="text-xs" style={{ color: tokens.neutralTextLight }}>{post.date}</span>
                        </div>
                        <h2 className="text-sm font-semibold line-clamp-2 mb-1" style={{ color: tokens.bodyText }}>
                          {post.title}
                        </h2>
                        <div className="h-3 rounded w-4/5 mb-1.5" style={{ backgroundColor: tokens.cardBorder }} />
                        <div className="flex items-center gap-1 text-xs" style={{ color: tokens.neutralTextLight }}>
                          <span>👁</span>
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <PaginationPreview paginationType={paginationType} brandColor={brandColor} tokens={tokens} />
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Magazine layout
  return (
    <div className="py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-3">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: tokens.headingColor }}>Tin tức & Bài viết</h2>
        </div>
        
        <div className="space-y-5">
          {/* Hero Section - Featured Stories */}
          {isDesktop && (
            <section className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-4`}>
              {/* Main Featured */}
              <div
                className={`${isMobile ? '' : 'lg:col-span-2'} group relative rounded-xl overflow-hidden`}
                style={{ backgroundColor: tokens.overlaySurface }}
              >
                <div
                  className={`flex items-center justify-center ${isMobile ? 'min-h-[280px]' : 'min-h-[280px] lg:min-h-[360px]'}`}
                  style={{ background: `linear-gradient(135deg, ${tokens.overlaySurfaceMuted}, ${tokens.overlaySurface})` }}
                >
                  <FileText size={48} style={{ color: tokens.overlayTextSoft }} />
                </div>
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${tokens.overlaySurface}, ${tokens.overlaySurfaceMuted})` }}
                />
                <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'p-4' : 'p-5 lg:p-6'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: tokens.featuredBadgeBg, color: tokens.featuredBadgeText }}
                    >
                      Nổi bật
                    </span>
                  </div>
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'} font-bold mb-2 leading-tight line-clamp-2`} style={{ color: tokens.overlayTextStrong }}>
                    {mockPosts[0].title}
                  </h2>
                <p className="text-sm line-clamp-2 mb-2" style={{ color: tokens.overlayTextMuted }}>Mô tả bài viết nổi bật với nội dung hấp dẫn</p>
                <div className="flex items-center gap-3 text-xs" style={{ color: tokens.overlayTextSoft }}>
                    <span>{mockPosts[0].date}</span>
                    <span>{mockPosts[0].views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
              
              {/* Secondary Featured - Stacked */}
              {!isMobile && (
                <div className="flex flex-col gap-4">
                  {mockPosts.slice(1, 3).map((post) => (
                    <div key={post.id} className="group relative flex-1 rounded-lg overflow-hidden" style={{ backgroundColor: tokens.overlaySurface }}>
                      <div
                        className="flex items-center justify-center min-h-[140px]"
                        style={{ background: `linear-gradient(135deg, ${tokens.overlaySurfaceMuted}, ${tokens.overlaySurface})` }}
                      >
                        <FileText size={24} style={{ color: tokens.overlayTextSoft }} />
                      </div>
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to top, ${tokens.overlaySurface}, ${tokens.overlaySurfaceMuted})` }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-1"
                        style={{ backgroundColor: tokens.featuredBadgeBg, color: tokens.featuredBadgeText }}
                        >
                          {post.category}
                        </span>
                      <h3 className="text-base font-semibold line-clamp-2" style={{ color: tokens.overlayTextStrong }}>{post.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          
          {/* Filter Bar */}
          <section className="rounded-lg border p-3 shadow-sm" style={{ backgroundColor: tokens.filterBarBackground, borderColor: tokens.cardBorder }}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search */}
              {showSearch && (
                <div className={`relative flex-1 ${isDesktop ? 'max-w-xs' : ''}`}>
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tokens.inputIcon }} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm placeholder:text-[var(--placeholder-color)]"
                    style={{
                      '--placeholder-color': tokens.inputPlaceholder,
                      borderColor: tokens.inputBorder,
                      backgroundColor: tokens.inputBackground,
                      color: tokens.inputText,
                    } as React.CSSProperties}
                    disabled
                  />
                </div>
              )}
              
              {/* Category Dropdown */}
              {showCategories && (
                <div className="relative">
                  <select
                    className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm min-w-[140px]"
                    style={{
                      borderColor: tokens.inputBorder,
                      backgroundColor: tokens.inputBackground,
                      color: tokens.inputText,
                    }}
                    disabled
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: tokens.inputIcon }} />
                </div>
              )}
              
              {/* Spacer - Desktop only */}
              {isDesktop && <div className="flex-1" />}
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm"
                  style={{
                    borderColor: tokens.inputBorder,
                    backgroundColor: tokens.inputBackground,
                    color: tokens.inputText,
                  }}
                  disabled
                >
                  <option>Mới nhất</option>
                  <option>Cũ nhất</option>
                  <option>Xem nhiều</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: tokens.inputIcon }} />
              </div>
            </div>
          </section>
          
          {/* Main Posts Grid */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold" style={{ color: tokens.sectionHeadingColor }}>Bài viết mới nhất</h2>
              <span className="text-sm" style={{ color: tokens.metaText }}>4 bài viết</span>
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-3`}>
              {mockPosts.slice(0, visiblePosts).map((post) => (
                <div key={post.id} className="h-full flex flex-col rounded-lg overflow-hidden border" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
                  <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: tokens.cardBorder }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={28} style={{ color: tokens.neutralTextLight }} />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: tokens.categoryBadgeBg,
                          color: tokens.categoryBadgeText,
                          borderColor: tokens.categoryBadgeBorder,
                        }}
                      >
                        {post.category}
                      </span>
                      <span style={{ color: tokens.neutralTextLight }}>•</span>
                      <span className="text-xs" style={{ color: tokens.neutralTextLight }}>{post.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold line-clamp-2 mb-1" style={{ color: tokens.bodyText }}>{post.title}</h3>
                    <p className="text-xs line-clamp-2 mb-2 flex-1" style={{ color: tokens.metaText }}>Mô tả ngắn về bài viết</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: tokens.neutralTextLight }}>
                      <span>👁</span>
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <PaginationPreview paginationType={paginationType} brandColor={brandColor} tokens={tokens} />
        </div>
      </div>
    </div>
  );
}

type ProductsListPreviewProps = {
  layoutStyle: ProductsListLayoutStyle;
  paginationType?: PaginationType;
  showSearch?: boolean;
  showCategories?: boolean;
  brandColor?: string;
  device?: PreviewDevice;
  showWishlistButton?: boolean;
  showAddToCartButton?: boolean;
  showBuyNowButton?: boolean;
  showPromotionBadge?: boolean;
};

const mockProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 34990000, originalPrice: 36990000, category: 'Điện thoại', rating: 4.8, reviews: 234, inStock: true },
  { id: 2, name: 'MacBook Pro 14" M3', price: 49990000, originalPrice: null, category: 'Laptop', rating: 4.9, reviews: 156, inStock: true },
  { id: 3, name: 'AirPods Pro 2', price: 6490000, originalPrice: 6990000, category: 'Phụ kiện', rating: 4.7, reviews: 89, inStock: true },
  { id: 4, name: 'iPad Air M2', price: 18990000, originalPrice: null, category: 'Tablet', rating: 4.6, reviews: 67, inStock: false },
];

const formatVND = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export function ProductsListPreview({
  layoutStyle,
  paginationType = 'pagination',
  showSearch = true,
  showCategories = true,
  brandColor = '#10b981',
  device = 'desktop',
  showWishlistButton = true,
  showAddToCartButton = true,
  showBuyNowButton = true,
  showPromotionBadge = true,
}: ProductsListPreviewProps) {
  const categories = ['Tất cả', 'Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện'];
  const isMobile = device === 'mobile';
  const isDesktop = device === 'desktop';
  const isCompact = device !== 'desktop';
  const visibleProducts = isMobile ? 2 : 4;
  const gridClass = isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3';

  const ProductCard = ({ product }: { product: typeof mockProducts[0] }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col group">
      <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
        <div className="w-16 h-16 bg-slate-200 rounded-lg" />
        {showPromotionBadge && product.originalPrice && (
          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded">Hết hàng</span>
          </div>
        )}
        {showWishlistButton && (
          <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors">
            <Heart size={14} className="text-slate-400 hover:text-red-500" />
          </button>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <span className="text-xs font-medium px-1.5 py-0.5 rounded w-fit mb-1.5" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold" style={{ color: brandColor }}>{formatVND(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">{formatVND(product.originalPrice)}</span>
            )}
          </div>
        </div>
        {(showAddToCartButton || showBuyNowButton) && (
          <div className="mt-2.5 space-y-2">
            {showAddToCartButton && (
              <button
                className="w-full py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: brandColor }}
                disabled={!product.inStock}
              >
                <ShoppingCart size={14} />
                {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </button>
            )}
            {showBuyNowButton && (
              <button
                className="w-full py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
                style={{ borderColor: brandColor, color: brandColor }}
                disabled={!product.inStock}
              >
                Mua ngay
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (layoutStyle === 'grid') {
    return (
      <div className="py-6 md:py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Sản phẩm</h2>
          </div>

          {(showSearch || showCategories) && (
            <div className="mb-5 space-y-2.5">
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  {showSearch && (
                    <div className={`relative flex-1 min-w-0 ${isDesktop ? 'max-w-xs' : ''}`}>
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Tìm sản phẩm..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" disabled />
                    </div>
                  )}
                  {showCategories && isDesktop && (
                    <div className="relative">
                      <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px]" disabled>
                        {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white" disabled>
                      <option>Giá: Thấp đến cao</option>
                      <option>Giá: Cao đến thấp</option>
                      <option>Bán chạy nhất</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  {isCompact && (
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm shrink-0">
                      <SlidersHorizontal className="w-4 h-4" />
                      Lọc
                    </button>
                  )}
                </div>
                {isCompact && showCategories && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat, i) => (
                        <span key={cat} className={`px-2.5 py-1 rounded-full text-sm font-medium ${i === 0 ? 'text-white' : 'bg-slate-100 text-slate-600'}`} style={i === 0 ? { backgroundColor: brandColor } : undefined}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-500">{mockProducts.length} sản phẩm</div>
            </div>
          )}

          <div className={`grid ${gridClass} gap-3`}>
            {mockProducts.slice(0, visibleProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <PaginationPreview paginationType={paginationType} brandColor={brandColor} />
        </div>
      </div>
    );
  }

  if (layoutStyle === 'list') {
    return (
      <div className="py-6 md:py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Sản phẩm</h2>
          </div>

          {(showSearch || showCategories) && (
            <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm mb-4">
              <div className="flex flex-col md:flex-row gap-3">
                {showSearch && (
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Tìm sản phẩm..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" disabled />
                  </div>
                )}
                {showCategories && (
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]" disabled>
                      {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white" disabled>
                    <option>Giá: Thấp đến cao</option>
                    <option>Giá: Cao đến thấp</option>
                    <option>Bán chạy nhất</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {mockProducts.slice(0, visibleProducts).map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-slate-100 overflow-hidden flex flex-col sm:flex-row gap-3 p-3">
                <div className="w-full sm:w-32 aspect-square bg-slate-100 rounded-lg relative flex items-center justify-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg" />
                  {showPromotionBadge && product.originalPrice && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-xs font-medium rounded">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                  {showWishlistButton && (
                    <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm">
                      <Heart size={14} className="text-slate-400" />
                    </button>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded w-fit mb-1.5" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                      {product.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-base font-bold" style={{ color: brandColor }}>{formatVND(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">{formatVND(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                  {showAddToCartButton && (
                    <button
                      className="mt-2.5 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-1.5"
                      style={{ backgroundColor: brandColor }}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart size={14} />
                      {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <PaginationPreview paginationType={paginationType} brandColor={brandColor} />
        </div>
      </div>
    );
  }

  // Sidebar layout
  const sidebarWidth = isDesktop ? 'lg:w-64' : '';
  const containerClass = isMobile ? 'flex-col' : (isDesktop ? 'lg:flex-row' : 'flex-col');
  const sidebarOrder = isMobile ? 'order-2' : (isDesktop ? 'lg:order-1' : 'order-2');
  const mainOrder = isMobile ? 'order-1' : (isDesktop ? 'lg:order-2' : 'order-1');

  return (
    <div className="py-6 md:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Sản phẩm</h2>
        </div>

        <div className={`flex ${containerClass} gap-5`}>
          <aside className={`${sidebarWidth} flex-shrink-0 ${sidebarOrder}`}>
            <div className="space-y-3">
              {showSearch && (
                <div className="bg-white rounded-lg border border-slate-200 p-3">
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <Search size={14} style={{ color: brandColor }} />
                    Tìm kiếm
                  </h3>
                  <input type="text" placeholder="Nhập từ khóa..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" disabled />
                </div>
              )}
              {showCategories && (
                <div className="bg-white rounded-lg border border-slate-200 p-3">
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <FileText size={14} style={{ color: brandColor }} />
                    Danh mục
                  </h3>
                  <ul className="space-y-0.5">
                    {categories.map((cat, i) => (
                      <li key={cat}>
                        <button className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${i === 0 ? 'font-medium' : 'text-slate-600'}`} style={i === 0 ? { backgroundColor: `${brandColor}15`, color: brandColor } : undefined} disabled>
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <h3 className="font-semibold text-slate-900 text-sm mb-2">Khoảng giá</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Từ" className="w-1/2 px-2 py-1.5 border border-slate-200 rounded text-sm" disabled />
                  <input type="text" placeholder="Đến" className="w-1/2 px-2 py-1.5 border border-slate-200 rounded text-sm" disabled />
                </div>
              </div>
            </div>
          </aside>

          <main className={`flex-1 ${mainOrder}`}>
            <div className={`grid ${gridClass} gap-3`}>
              {mockProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <PaginationPreview paginationType={paginationType} brandColor={brandColor} />
          </main>
        </div>
      </div>
    </div>
  );
}

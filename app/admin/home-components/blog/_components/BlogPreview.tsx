'use client';

import React from 'react';
import { ArrowRight, FileText, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { BLOG_STYLES } from '../_lib/constants';
import type { BlogPreviewItem, BlogStyle } from '../_types';

// Modern News Feed UI/UX - 6 Variants (Best Practice compliant)
// Styles: Grid, List, Featured, Magazine, Carousel, Minimal
export const BlogPreview = ({ 
  brandColor, 
  secondary,
  postCount, 
  selectedStyle, 
  onStyleChange,
  posts,
  title = 'Bài viết'
}: { 
  brandColor: string;
  secondary: string; 
  postCount: number; 
  selectedStyle?: BlogStyle; 
  onStyleChange?: (style: BlogStyle) => void;
  posts?: BlogPreviewItem[];
  title?: string;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle ?? 'grid';
  const setPreviewStyle = (s: string) => onStyleChange?.(s as BlogStyle);
  
  // Mock data
  const mockPosts: BlogPreviewItem[] = [
    { category: 'Thiết kế', date: '12/05/2024', excerpt: 'Khám phá những phong cách thiết kế đang thống trị thế giới công nghệ hiện đại và cách áp dụng vào dự án của bạn.', id: 1, readTime: '5 phút đọc', title: 'Xu hướng thiết kế UI/UX nổi bật năm 2024', views: 1250 },
    { category: 'Lập trình', date: '11/05/2024', excerpt: 'Những kỹ thuật và best practices để tối ưu performance cho ứng dụng React của bạn.', id: 2, readTime: '8 phút đọc', title: 'Tối ưu hóa hiệu năng React Application', views: 980 },
    { category: 'Công nghệ', date: '10/05/2024', excerpt: 'Phân tích sâu về tác động của AI đến việc làm và cách thích nghi với xu hướng mới.', id: 3, readTime: '6 phút đọc', title: 'AI và tương lai của thị trường lao động', views: 2100 },
    { category: 'Marketing', date: '09/05/2024', excerpt: 'Tất cả những gì developer cần biết về SEO để xây dựng website thân thiện với công cụ tìm kiếm.', id: 4, readTime: '7 phút đọc', title: 'Hướng dẫn SEO cho Developers', views: 750 },
    { category: 'Bảo mật', date: '08/05/2024', excerpt: 'Những lỗ hổng bảo mật phổ biến và cách phòng tránh trong ứng dụng web.', id: 5, readTime: '10 phút đọc', title: 'Bảo mật Web Application 101', views: 1500 },
    { category: 'Architecture', date: '07/05/2024', excerpt: 'So sánh chi tiết giữa hai kiến trúc phổ biến và cách đưa ra quyết định phù hợp.', id: 6, readTime: '9 phút đọc', title: 'Microservices vs Monolith: Khi nào nên chọn gì?', views: 890 }
  ];

  // Use real posts if provided, otherwise mock
  const displayPosts: BlogPreviewItem[] = posts && posts.length > 0 
    ? posts 
    : mockPosts.slice(0, Math.max(postCount, 6));
  
  const showViewAll = displayPosts.length > 3;

  // Image placeholder with brandColor
  const ImagePlaceholder = ({ size = 32 }: { size?: number }) => (
    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${brandColor}10` }}>
      <FileText size={size} style={{ color: `${brandColor}40` }} />
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColor}10` }}>
        <FileText size={32} style={{ color: brandColor }} />
      </div>
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có bài viết nào</h3>
      <p className="text-sm text-slate-500">Thêm bài viết để hiển thị ở đây</p>
    </div>
  );

  // "+N bài viết khác" component
  const MoreItemsCard = ({ count }: { count: number }) => (
    <div 
      className="flex flex-col items-center justify-center rounded-xl aspect-[16/10] border-2 border-dashed cursor-pointer"
      style={{ backgroundColor: `${brandColor}05`, borderColor: `${brandColor}30` }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${brandColor}15` }}>
        <Plus size={24} style={{ color: brandColor }} />
      </div>
      <span className="text-lg font-bold" style={{ color: brandColor }}>+{count}</span>
      <p className="text-xs text-slate-500">bài viết khác</p>
    </div>
  );

  // Style 1: Grid - Professional card grid với brandColor hover
  const renderGridStyle = () => {
    if (displayPosts.length === 0) {return <EmptyState />;}
    const visibleCount = device === 'mobile' ? 2 : 3;
    const visibleItems = displayPosts.slice(0, visibleCount);
    const remaining = displayPosts.length - visibleCount;

    // Centered layout for 1-2 items
    if (displayPosts.length <= 2) {
      return (
        <section className={cn("py-8 md:py-12", device === 'mobile' && 'px-3', device !== 'mobile' && 'px-4')}>
          <h2 className={cn("font-bold tracking-tighter text-left mb-6 md:mb-8", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
          <div className={cn("mx-auto", displayPosts.length === 1 ? 'max-w-md' : 'max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4')}>
            {displayPosts.map((post) => (
              <article 
                key={post.id} 
                className="group flex flex-col overflow-hidden rounded-xl border bg-white dark:bg-slate-800 transition-all duration-300 cursor-pointer"
                style={{ borderColor: `${brandColor}15` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${brandColor}15`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.thumbnail ? <PreviewImage src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ImagePlaceholder size={32} />}
                  <div className="absolute left-3 top-3">
                    <span className="px-2 py-1 text-xs font-medium rounded shadow-sm backdrop-blur-sm" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>{post.category ?? 'Tin tức'}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 text-base md:text-lg font-bold leading-tight text-slate-900 dark:text-slate-100 group-hover:opacity-80 transition-colors line-clamp-2">{post.title || 'Tiêu đề bài viết'}</h3>
                  {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{post.excerpt}</p>}
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <time className="text-xs text-slate-500">{post.date ?? 'Hôm nay'}</time>
                    {post.readTime && <span className="text-xs text-slate-400">{post.readTime}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className={cn("py-8 md:py-12", device === 'mobile' && 'px-3', device !== 'mobile' && 'px-4')}>
        <h2 className={cn("font-bold tracking-tighter text-left mb-6 md:mb-8", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
        <div className={cn("grid gap-4 md:gap-6", device === 'mobile' ? 'grid-cols-1' : (device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'))}>
          {visibleItems.map((post) => (
            <article 
              key={post.id} 
              className="group flex flex-col overflow-hidden rounded-xl border bg-white dark:bg-slate-800 transition-all duration-300 cursor-pointer"
              style={{ borderColor: `${brandColor}15` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${brandColor}15`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.thumbnail ? <PreviewImage src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ImagePlaceholder size={32} />}
                <div className="absolute left-3 top-3">
                  <span className="px-2 py-1 text-xs font-medium rounded shadow-sm backdrop-blur-sm" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>{post.category ?? 'Tin tức'}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-2 text-base md:text-lg font-bold leading-tight text-slate-900 dark:text-slate-100 group-hover:opacity-80 transition-colors line-clamp-2">{post.title || 'Tiêu đề bài viết'}</h3>
                {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{post.excerpt}</p>}
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <time className="text-xs text-slate-500">{post.date ?? 'Hôm nay'}</time>
                  {post.readTime && <span className="text-xs text-slate-400">{post.readTime}</span>}
                </div>
              </div>
            </article>
          ))}
          {remaining > 0 && device !== 'mobile' && <MoreItemsCard count={remaining} />}
        </div>
        {showViewAll && (
          <div className="flex justify-center pt-6 md:pt-8">
            <button className="group flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: brandColor }}>
              Xem tất cả <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </section>
    );
  };

  // Style 2: List - Horizontal cards với brandColor hover
  const renderListStyle = () => {
    if (displayPosts.length === 0) {return <EmptyState />;}
    return (
      <section className={cn("py-8 md:py-12", device === 'mobile' && 'px-3', device !== 'mobile' && 'px-4')}>
        <h2 className={cn("font-bold tracking-tighter text-left mb-6 md:mb-8", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
        <div className={cn("grid gap-4", device === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 max-w-4xl mx-auto')}>
          {displayPosts.slice(0, 4).map((post) => (
            <article 
              key={post.id} 
              className={cn("group flex w-full overflow-hidden rounded-lg border bg-white dark:bg-slate-800 transition-all cursor-pointer", device === 'mobile' ? 'flex-col' : 'flex-row')}
              style={{ borderColor: `${brandColor}15` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div className={cn("overflow-hidden flex-shrink-0", device === 'mobile' ? 'aspect-[16/9] w-full' : 'aspect-[4/3] w-[220px]')}>
                {post.thumbnail ? <PreviewImage src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ImagePlaceholder size={24} />}
              </div>
              <div className="flex flex-1 flex-col justify-center p-4 md:px-6">
                <div className="mb-2"><span className="text-xs font-semibold" style={{ color: brandColor }}>{post.category ?? 'Tin tức'}</span></div>
                <h3 className="mb-2 text-base md:text-lg font-bold leading-snug text-slate-900 dark:text-slate-100 group-hover:opacity-80 transition-colors line-clamp-2">{post.title || 'Tiêu đề bài viết'}</h3>
                {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{post.excerpt}</p>}
                <div className="flex items-center gap-3">
                  <time className="text-xs text-slate-500">{post.date ?? 'Hôm nay'}</time>
                  {post.readTime && <span className="text-xs text-slate-400">• {post.readTime}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
        {showViewAll && (
          <div className="flex justify-center pt-6 md:pt-8">
            <button className="group flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: brandColor }}>
              Xem tất cả <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </section>
    );
  };

  // Style 3: Featured - Hero post + list
  const renderFeaturedStyle = () => {
    if (displayPosts.length === 0) {return <EmptyState />;}
    const mainPost = displayPosts[0];
    const sidePosts = displayPosts.slice(1, device === 'mobile' ? 3 : 4);
    return (
      <section className={cn("py-8 md:py-12", device === 'mobile' && 'px-3', device !== 'mobile' && 'px-4')}>
        <h2 className={cn("font-bold tracking-tighter text-left mb-6 md:mb-8", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
        <div className={cn(device === 'mobile' ? 'space-y-6' : 'grid grid-cols-3 gap-6')}> 
          <article 
            className={cn("group overflow-hidden rounded-2xl border bg-white dark:bg-slate-800 transition-all duration-300 cursor-pointer", device === 'mobile' ? '' : 'col-span-2')}
            style={{ borderColor: `${brandColor}15` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 12px 30px ${brandColor}15`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {mainPost.thumbnail ? <PreviewImage src={mainPost.thumbnail} alt={mainPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ImagePlaceholder size={40} />}
              <div className="absolute left-4 top-4">
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm" style={{ backgroundColor: brandColor, color: 'white' }}>
                  {mainPost.category ?? 'Tin tức'}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className={cn("font-bold mb-2", device === 'mobile' ? 'text-lg' : 'text-2xl')}>{mainPost.title || 'Tiêu đề nổi bật'}</h3>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{mainPost.excerpt ?? 'Mô tả ngắn cho bài viết nổi bật...'}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <time>{mainPost.date ?? 'Hôm nay'}</time>
                {mainPost.readTime && <span>• {mainPost.readTime}</span>}
                {typeof mainPost.views === 'number' && <span>• {mainPost.views} lượt xem</span>}
              </div>
            </div>
          </article>
          <div className="space-y-4">
            {sidePosts.map((post) => (
              <article 
                key={post.id}
                className="group flex gap-4 items-center bg-white dark:bg-slate-800 border rounded-xl p-3 transition-all cursor-pointer"
                style={{ borderColor: `${brandColor}15` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {post.thumbnail ? <PreviewImage src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" /> : <ImagePlaceholder size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold mb-1" style={{ color: brandColor }}>{post.category ?? 'Tin tức'}</div>
                  <h4 className="text-sm font-semibold line-clamp-2">{post.title || 'Tiêu đề bài viết'}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Style 4: Magazine - Magazine layout with large left column
  const renderMagazineStyle = () => {
    if (displayPosts.length === 0) {return <EmptyState />;}
    const mainPost = displayPosts[0];
    const restPosts = displayPosts.slice(1, device === 'mobile' ? 3 : 6);
    return (
      <section className={cn("py-8 md:py-12", device === 'mobile' && 'px-3', device !== 'mobile' && 'px-4')}>
        <h2 className={cn("font-bold tracking-tighter text-left mb-6 md:mb-8", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
        <div className={cn(device === 'mobile' ? 'space-y-6' : 'grid grid-cols-12 gap-6')}> 
          <article className={cn(device === 'mobile' ? '' : 'col-span-7')}>
            <div className="group overflow-hidden rounded-2xl border bg-white dark:bg-slate-800 transition-all duration-300 cursor-pointer"
              style={{ borderColor: `${brandColor}15` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 12px 30px ${brandColor}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {mainPost.thumbnail ? <PreviewImage src={mainPost.thumbnail} alt={mainPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <ImagePlaceholder size={40} />}
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold mb-2" style={{ color: brandColor }}>{mainPost.category ?? 'Tin tức'}</div>
                <h3 className={cn("font-bold mb-2", device === 'mobile' ? 'text-lg' : 'text-2xl')}>{mainPost.title || 'Tiêu đề chính'}</h3>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-3">{mainPost.excerpt ?? 'Mô tả bài viết...'}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <time>{mainPost.date ?? 'Hôm nay'}</time>
                  {mainPost.readTime && <span>• {mainPost.readTime}</span>}
                </div>
              </div>
            </div>
          </article>
          <div className={cn(device === 'mobile' ? '' : 'col-span-5 space-y-4')}>
            {restPosts.map((post) => (
              <article key={post.id} className="group flex gap-4 items-center bg-white dark:bg-slate-800 border rounded-xl p-3 transition-all cursor-pointer"
                style={{ borderColor: `${brandColor}15` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${brandColor}40`; e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${brandColor}15`; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {post.thumbnail ? <PreviewImage src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" /> : <ImagePlaceholder size={18} />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold mb-1" style={{ color: brandColor }}>{post.category ?? 'Tin tức'}</div>
                  <h4 className="text-sm font-semibold line-clamp-2">{post.title || 'Tiêu đề bài viết'}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Style 5: Carousel - Horizontal scroll cards
  const renderCarouselStyle = () => {
    if (displayPosts.length === 0) {return <EmptyState />;}
    return (
      <section className={cn("py-8", device === 'mobile' ? 'py-6' : '')}>
        <h2 className={cn("font-bold text-left mb-6 px-4", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {displayPosts.map((post) => (
              <article 
                key={post.id} 
                className={cn(
                  "flex-shrink-0 snap-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden border transition-all",
                  device === 'mobile' ? 'w-[260px]' : 'w-[320px]'
                )}
                style={{ borderColor: `${brandColor}15` }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  {post.thumbnail ? <PreviewImage src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" /> : <ImagePlaceholder size={28} />}
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold mb-1" style={{ color: brandColor }}>{post.category ?? 'Tin tức'}</div>
                  <h3 className="text-base font-bold line-clamp-2">{post.title || 'Tiêu đề bài viết'}</h3>
                  {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">{post.excerpt}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Style 6: Minimal - Clean list with accent line
  const renderMinimalStyle = () => {
    if (displayPosts.length === 0) {return <EmptyState />;}
    return (
      <section className={cn("py-8 md:py-12", device === 'mobile' && 'px-3', device !== 'mobile' && 'px-4')}>
        <h2 className={cn("font-bold tracking-tighter text-left mb-6", device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl')}>{title}</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {displayPosts.slice(0, device === 'mobile' ? 3 : 5).map((post, idx) => (
            <article key={post.id} className="flex gap-4 items-start">
              <div className="w-1 rounded-full" style={{ backgroundColor: brandColor }} />
              <div className="flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                  <span className="font-semibold" style={{ color: brandColor }}>{post.category ?? 'Tin tức'}</span>
                  <span>•</span>
                  <time>{post.date ?? 'Hôm nay'}</time>
                </div>
                <h3 className="text-base font-semibold line-clamp-2">{post.title || `Bài viết ${idx + 1}`}</h3>
                {post.excerpt && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{post.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <PreviewWrapper
        title="Preview Blog"
        device={device}
        setDevice={setDevice}
        previewStyle={previewStyle}
        setPreviewStyle={setPreviewStyle}
        styles={BLOG_STYLES}
        info={`${displayPosts.length} bài viết`}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame url="yoursite.com/blog">
          {previewStyle === 'grid' && renderGridStyle()}
          {previewStyle === 'list' && renderListStyle()}
          {previewStyle === 'featured' && renderFeaturedStyle()}
          {previewStyle === 'magazine' && renderMagazineStyle()}
          {previewStyle === 'carousel' && renderCarouselStyle()}
          {previewStyle === 'minimal' && renderMinimalStyle()}
        </BrowserFrame>
      </PreviewWrapper>
      <ColorInfoPanel brandColor={brandColor} secondary={secondary} />
    </>
  );
};

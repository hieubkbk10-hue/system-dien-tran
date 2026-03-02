'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { BlogForm, type BlogPostItem } from '../../_components/BlogForm';
import { BlogPreview } from '../../_components/BlogPreview';
import { getBlogValidationResult } from '../../_lib/colors';
import { DEFAULT_BLOG_CONFIG, sortBlogPosts } from '../../_lib/constants';
import type { BlogSelectionMode, BlogStyle } from '../../_types';

const COMPONENT_TYPE = 'Blog';

export default function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);
  const postsData = useQuery(api.posts.listAll, { limit: 100 });
  const postCategoriesData = useQuery(api.postCategories.listAll, { limit: 200 });

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [blogStyle, setBlogStyle] = useState<BlogStyle>('grid');
  const [blogSelectionMode, setBlogSelectionMode] = useState<BlogSelectionMode>('auto');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [blogConfig, setBlogConfig] = useState({
    itemCount: DEFAULT_BLOG_CONFIG.itemCount,
    sortBy: DEFAULT_BLOG_CONFIG.sortBy
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warningMessages, setWarningMessages] = useState<string[]>([]);
  const [initialState, setInitialState] = useState('');

  const filteredPosts = useMemo(() => {
    if (!postsData) {return [];}
    return postsData
      .filter(post => post.status === 'Published')
      .filter(post => 
        !postSearchTerm || 
        post.title.toLowerCase().includes(postSearchTerm.toLowerCase())
      );
  }, [postsData, postSearchTerm]);

  const selectedPosts = useMemo(() => {
    if (!postsData || selectedPostIds.length === 0) {return [];}
    const postMap = new Map(postsData.map((post) => [post._id, post]));
    return selectedPostIds
      .map((postId) => postMap.get(postId as Id<'posts'>))
      .filter((post): post is Doc<'posts'> => post !== undefined);
  }, [postsData, selectedPostIds]);

  useEffect(() => {
    if (component) {
      if (component.type !== 'Blog') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      setBlogConfig({
        itemCount: (config.itemCount as number) ?? DEFAULT_BLOG_CONFIG.itemCount,
        sortBy: (config.sortBy as 'newest' | 'popular' | 'random') ?? DEFAULT_BLOG_CONFIG.sortBy,
      });
      const nextStyle = (config.style as BlogStyle) || 'grid';
      const nextSelectionMode = (config.selectionMode as BlogSelectionMode) || 'auto';
      const nextSelectedPostIds = (config.selectedPostIds as string[]) || [];

      setBlogStyle(nextStyle);
      setBlogSelectionMode(nextSelectionMode);
      setSelectedPostIds(nextSelectedPostIds);

      const snapshot = JSON.stringify({
        title: component.title,
        active: component.active,
        itemCount: (config.itemCount as number) ?? DEFAULT_BLOG_CONFIG.itemCount,
        sortBy: (config.sortBy as 'newest' | 'popular' | 'random') ?? DEFAULT_BLOG_CONFIG.sortBy,
        style: nextStyle,
        selectionMode: nextSelectionMode,
        selectedPostIds: nextSelectionMode === 'manual' ? nextSelectedPostIds : [],
      });
      setInitialState(snapshot);
    }
  }, [component, id, router]);

  const previewPosts = useMemo(() => {
    if (!postsData) {return undefined;}

    const published = postsData.filter((post) => post.status === 'Published');

    if (blogSelectionMode === 'manual') {
      if (selectedPostIds.length === 0) {return [];}
      const postMap = new Map(published.map((post) => [post._id, post]));
      return selectedPostIds
        .map((postId) => postMap.get(postId as Id<'posts'>))
        .filter((post): post is Doc<'posts'> => post !== undefined);
    }

    const sorted = sortBlogPosts(published, blogConfig.sortBy, title);

    return sorted.slice(0, blogConfig.itemCount);
  }, [blogConfig.itemCount, blogConfig.sortBy, blogSelectionMode, postsData, selectedPostIds, title]);

  const categoryMap = useMemo(() => {
    if (!postCategoriesData) {return undefined;}
    const map: Record<string, string> = {};
    postCategoriesData.forEach((category) => {
      map[category._id] = category.name;
    });
    return map;
  }, [postCategoriesData]);

  const typedPreviewPosts = previewPosts as BlogPostItem[] | undefined;
  const typedCategoryMap = categoryMap as Record<string, string> | undefined;

  const currentState = useMemo(() => JSON.stringify({
    title,
    active,
    itemCount: blogConfig.itemCount,
    sortBy: blogConfig.sortBy,
    style: blogStyle,
    selectionMode: blogSelectionMode,
    selectedPostIds: blogSelectionMode === 'manual' ? selectedPostIds : [],
  }), [active, blogConfig.itemCount, blogConfig.sortBy, blogSelectionMode, blogStyle, selectedPostIds, title]);

  const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
  const customChanged = showCustomBlock
    ? customState.enabled !== initialCustom.enabled
      || customState.mode !== initialCustom.mode
      || customState.primary !== initialCustom.primary
      || resolvedCustomSecondary !== initialCustom.secondary
    : false;
  const hasChanges = initialState.length > 0 && (currentState !== initialState || customChanged);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);

    const validation = getBlogValidationResult({
      primary: effectiveColors.primary,
      secondary: effectiveColors.secondary,
      mode: effectiveColors.mode,
    });

    const warnings: string[] = [];
    if (effectiveColors.mode === 'dual') {
      if (validation.harmonyStatus.isTooSimilar) {
        warnings.push(`Độ tương phản thương hiệu thấp (ΔE=${validation.harmonyStatus.deltaE}).`);
      }
      if (validation.accessibility.failing.length > 0) {
        warnings.push(`Có ${validation.accessibility.failing.length} cặp màu chưa đạt APCA (minLc=${validation.accessibility.minLc.toFixed(1)}).`);
      }
    }
    setWarningMessages(warnings);

    try {
      await updateMutation({
        active,
        config: {
          itemCount: blogConfig.itemCount,
          sortBy: blogConfig.sortBy,
          style: blogStyle,
          selectionMode: blogSelectionMode,
          selectedPostIds: blogSelectionMode === 'manual' ? selectedPostIds : [],
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      if (showCustomBlock) {
        const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
        await setTypeColorOverride({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
          type: COMPONENT_TYPE,
        });
      }
      toast.success('Đã cập nhật Blog');
      setInitialState(currentState);
      if (showCustomBlock) {
        setInitialCustom({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary),
        });
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDisabled = isSubmitting || !hasChanges;

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Blog</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText size={20} />
              Tin tức / Blog
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

        <BlogForm
          selectionMode={blogSelectionMode}
          onSelectionModeChange={setBlogSelectionMode}
          itemCount={blogConfig.itemCount}
          sortBy={blogConfig.sortBy}
          onConfigChange={(next) =>{
            setBlogConfig((prev) => ({
              itemCount: next.itemCount ?? prev.itemCount,
              sortBy: next.sortBy ?? prev.sortBy,
            }));
          }}
          selectedPosts={selectedPosts as BlogPostItem[]}
          selectedPostIds={selectedPostIds}
          onTogglePost={(postId) =>{
            setSelectedPostIds((ids) => ids.includes(postId) ? ids.filter(idValue => idValue !== postId) : [...ids, postId]);
          }}
          searchTerm={postSearchTerm}
          onSearchTermChange={setPostSearchTerm}
          filteredPosts={filteredPosts as BlogPostItem[]}
          isLoading={postsData === undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho Blog"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={customState.secondary}
                onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
                onModeChange={(next) => setCustomState((prev) => ({ ...prev, mode: next }))}
                onPrimaryChange={(value) => setCustomState((prev) => ({ ...prev, primary: value }))}
                onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
              />
            )}
            <BlogPreview
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode}
              postCount={blogSelectionMode === 'manual' ? selectedPostIds.length : blogConfig.itemCount}
              selectedStyle={blogStyle}
              onStyleChange={setBlogStyle}
              title={title}
              previewItems={typedPreviewPosts}
              categoryMap={typedCategoryMap}
            />
          </div>
        </div>

        {warningMessages.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 mb-4">
            <ul className="list-disc pl-4 space-y-1">
              {warningMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() =>{  router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={saveDisabled}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}

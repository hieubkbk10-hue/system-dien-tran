'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { BlogForm, type BlogPostItem } from '../../_components/BlogForm';
import { BlogPreview } from '../../_components/BlogPreview';
import { DEFAULT_BLOG_CONFIG } from '../../_lib/constants';
import type { BlogSelectionMode, BlogStyle } from '../../_types';

export default function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);
  const postsData = useQuery(api.posts.listAll, { limit: 100 });

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
    const postMap = new Map(postsData.map(p => [p._id, p]));
    return selectedPostIds
      .map(idValue => postMap.get(idValue as Id<'posts'>))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
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
      setBlogStyle((config.style as BlogStyle) || 'grid');
      setBlogSelectionMode((config.selectionMode as BlogSelectionMode) || 'auto');
      setSelectedPostIds((config.selectedPostIds as string[]) || []);
    }
  }, [component, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
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
      toast.success('Đã cập nhật Blog');
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
          <div className="lg:sticky lg:top-6 lg:self-start">
            <BlogPreview
              brandColor={primary}
              secondary={secondary}
              postCount={blogSelectionMode === 'manual' ? selectedPostIds.length : blogConfig.itemCount}
              selectedStyle={blogStyle}
              onStyleChange={setBlogStyle}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() =>{  router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Eye, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { AboutForm } from '../../_components/AboutForm';
import { AboutPreview } from '../../_components/AboutPreview';
import {
  createAboutEditorStat,
  DEFAULT_ABOUT_EDITOR_STATE,
  normalizeAboutEditorStats,
  normalizeAboutHarmony,
  normalizeAboutStyle,
  toAboutPersistStats,
} from '../../_lib/constants';
import {
  buildAboutWarningMessages,
  getAboutValidationResult,
} from '../../_lib/colors';
import type { AboutEditorState, AboutHarmony, AboutStyle } from '../../_types';

const buildAboutSnapshot = (payload: {
  title: string;
  active: boolean;
  state: AboutEditorState;
}) => JSON.stringify({
  title: payload.title,
  active: payload.active,
  subHeading: payload.state.subHeading,
  heading: payload.state.heading,
  description: payload.state.description,
  image: payload.state.image,
  imageCaption: payload.state.imageCaption,
  buttonText: payload.state.buttonText,
  buttonLink: payload.state.buttonLink,
  style: payload.state.style,
  harmony: payload.state.harmony,
  stats: toAboutPersistStats(payload.state.stats),
});

const normalizeEditorState = (rawConfig: Record<string, unknown>): AboutEditorState => {
  const normalizedStats = normalizeAboutEditorStats(rawConfig.stats);

  return {
    subHeading: typeof rawConfig.subHeading === 'string' ? rawConfig.subHeading : DEFAULT_ABOUT_EDITOR_STATE.subHeading,
    heading: typeof rawConfig.heading === 'string' ? rawConfig.heading : DEFAULT_ABOUT_EDITOR_STATE.heading,
    description: typeof rawConfig.description === 'string' ? rawConfig.description : DEFAULT_ABOUT_EDITOR_STATE.description,
    image: typeof rawConfig.image === 'string' ? rawConfig.image : '',
    imageCaption: typeof rawConfig.imageCaption === 'string' ? rawConfig.imageCaption : '',
    buttonText: typeof rawConfig.buttonText === 'string' ? rawConfig.buttonText : DEFAULT_ABOUT_EDITOR_STATE.buttonText,
    buttonLink: typeof rawConfig.buttonLink === 'string' ? rawConfig.buttonLink : DEFAULT_ABOUT_EDITOR_STATE.buttonLink,
    style: normalizeAboutStyle(rawConfig.style),
    harmony: normalizeAboutHarmony(rawConfig.harmony),
    stats: normalizedStats.length > 0
      ? normalizedStats
      : [
        createAboutEditorStat({ value: '10+', label: 'Năm kinh nghiệm' }),
      ],
  };
};

export default function AboutEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary, mode } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [state, setState] = useState<AboutEditorState>(DEFAULT_ABOUT_EDITOR_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'About') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    const rawConfig = (component.config ?? {}) as Record<string, unknown>;
    const nextState = normalizeEditorState(rawConfig);

    setTitle(component.title);
    setActive(component.active);
    setState(nextState);

    setInitialSnapshot(buildAboutSnapshot({
      title: component.title,
      active: component.active,
      state: nextState,
    }));
  }, [component, id, router]);

  const currentSnapshot = buildAboutSnapshot({ title, active, state });
  const hasChanges = initialSnapshot !== null && currentSnapshot !== initialSnapshot;

  const harmony = normalizeAboutHarmony(state.harmony);

  const validation = useMemo(
    () => getAboutValidationResult({
      primary,
      secondary,
      mode,
      harmony,
      style: state.style,
    }),
    [primary, secondary, mode, harmony, state.style],
  );

  const warningMessages = useMemo(
    () => buildAboutWarningMessages({ mode, validation }),
    [mode, validation],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);
    try {
      const normalizedStyle = normalizeAboutStyle(state.style) as AboutStyle;
      const normalizedHarmony = normalizeAboutHarmony(state.harmony) as AboutHarmony;

      await updateMutation({
        id: id as Id<'homeComponents'>,
        title,
        active,
        config: {
          subHeading: state.subHeading,
          heading: state.heading,
          description: state.description,
          image: state.image,
          imageCaption: state.imageCaption,
          buttonText: state.buttonText,
          buttonLink: state.buttonLink,
          stats: toAboutPersistStats(state.stats),
          style: normalizedStyle,
          harmony: normalizedHarmony,
        },
      });

      setInitialSnapshot(buildAboutSnapshot({ title, active, state: { ...state, style: normalizedStyle, harmony: normalizedHarmony } }));
      toast.success('Đã cập nhật About');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa About</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User size={20} />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(event) => { setTitle(event.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div
                className={cn(
                  'cursor-pointer inline-flex items-center justify-center rounded-full w-12 h-6 transition-colors',
                  active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600',
                )}
                onClick={() => { setActive(!active); }}
              >
                <div className={cn(
                  'w-5 h-5 bg-white rounded-full transition-transform shadow',
                  active ? 'translate-x-2.5' : '-translate-x-2.5',
                )}></div>
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <AboutForm state={state} onChange={setState} />

        {mode === 'dual' && warningMessages.length > 0 ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <div className="space-y-2">
              {warningMessages.map((message, idx) => (
                <div key={`${idx}-${message}`} className="flex items-start gap-2">
                  <Eye size={14} className="mt-0.5 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <AboutPreview
          config={{
            subHeading: state.subHeading,
            heading: state.heading,
            description: state.description,
            image: state.image,
            imageCaption: state.imageCaption,
            buttonText: state.buttonText,
            buttonLink: state.buttonLink,
            stats: toAboutPersistStats(state.stats),
            style: state.style,
            harmony,
          }}
          brandColor={validation.tokens.primary}
          secondary={validation.tokens.secondary}
          mode={mode}
          selectedStyle={state.style}
          onStyleChange={(style) => {
            setState((prev) => ({ ...prev, style }));
          }}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() => { router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={!hasChanges || isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}

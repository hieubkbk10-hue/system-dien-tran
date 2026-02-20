'use client';

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { TeamForm } from '../../_components/TeamForm';
import { TeamPreview } from '../../_components/TeamPreview';
import {
  normalizeTeamConfig,
  normalizeTeamHarmony,
  toTeamEditorMembers,
  toTeamPersistMembers,
  normalizeTeamStyle,
} from '../../_lib/constants';
import { getTeamValidationResult } from '../../_lib/colors';
import type {
  TeamBrandMode,
  TeamConfig,
  TeamEditorMember,
  TeamHarmony,
  TeamStyle,
} from '../../_types';

const serializeEditState = ({
  title,
  active,
  style,
  harmony,
  members,
}: {
  title: string;
  active: boolean;
  style: TeamStyle;
  harmony: TeamHarmony;
  members: TeamEditorMember[];
}) => JSON.stringify({
  title,
  active,
  style,
  harmony,
  members: toTeamPersistMembers(members),
});

export default function TeamEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary, mode } = useBrandColors();

  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = React.useState('');
  const [active, setActive] = React.useState(true);
  const [style, setStyle] = React.useState<TeamStyle>('grid');
  const [harmony, setHarmony] = React.useState<TeamHarmony>('analogous');
  const [members, setMembers] = React.useState<TeamEditorMember[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [initialSnapshot, setInitialSnapshot] = React.useState('');

  const brandMode: TeamBrandMode = mode === 'single' ? 'single' : 'dual';

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'Team') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    const normalizedConfig = normalizeTeamConfig(component.config);

    const editorMembers = toTeamEditorMembers(normalizedConfig.members);
    const nextStyle = normalizeTeamStyle(normalizedConfig.style);
    const nextHarmony = normalizeTeamHarmony(normalizedConfig.harmony);

    setTitle(component.title);
    setActive(component.active);
    setStyle(nextStyle);
    setHarmony(nextHarmony);
    setMembers(editorMembers);

    setInitialSnapshot(serializeEditState({
      title: component.title,
      active: component.active,
      style: nextStyle,
      harmony: nextHarmony,
      members: editorMembers,
    }));
  }, [component, id, router]);

  const validation = React.useMemo(() => getTeamValidationResult({
    primary,
    secondary,
    mode: brandMode,
    harmony,
  }), [primary, secondary, brandMode, harmony]);

  const warningMessages = React.useMemo(() => {
    if (brandMode !== 'dual') {
      return [] as string[];
    }

    const messages: string[] = [];

    if (validation.harmonyStatus.isTooSimilar) {
      messages.push(`Màu phụ đang gần màu chính (deltaE = ${validation.harmonyStatus.deltaE}).`);
    }

    if (validation.accessibility.failing.length > 0) {
      messages.push(`Một số cặp màu chữ/nền chưa đạt APCA (minLc = ${validation.accessibility.minLc.toFixed(1)}).`);
    }

    return messages;
  }, [brandMode, validation]);

  const currentSnapshot = React.useMemo(() => serializeEditState({
    title,
    active,
    style,
    harmony,
    members,
  }), [title, active, style, harmony, members]);

  const hasChanges = initialSnapshot.length > 0 && currentSnapshot !== initialSnapshot;

  const saveConfig: TeamConfig = React.useMemo(() => ({
    members: toTeamPersistMembers(members),
    style,
    harmony,
  }), [members, style, harmony]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);

    try {
      await updateMutation({
        id: id as Id<'homeComponents'>,
        title,
        active,
        config: saveConfig as unknown as Record<string, unknown>,
      });

      const nextSnapshot = serializeEditState({
        title,
        active,
        style,
        harmony,
        members,
      });

      setInitialSnapshot(nextSnapshot);
      toast.success('Đã cập nhật Team');
    } catch (error) {
      toast.error('Lỗi khi cập nhật Team');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return <div className="py-8 text-center text-slate-500">Không tìm thấy component</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Team</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div
                className={cn(
                  'inline-flex h-6 w-12 cursor-pointer items-center justify-center rounded-full transition-colors',
                  active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600',
                )}
                onClick={() => {
                  setActive((prev) => !prev);
                }}
              >
                <div
                  className={cn(
                    'h-5 w-5 rounded-full bg-white shadow transition-transform',
                    active ? 'translate-x-2.5' : '-translate-x-2.5',
                  )}
                />
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <TeamForm
          members={members}
          onChange={setMembers}
          secondary={validation.resolvedSecondary}
        />

        {brandMode === 'dual' && warningMessages.length > 0 ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="space-y-1">
                {warningMessages.map((message, idx) => (
                  <p key={`team-edit-warning-${idx}`}>{message}</p>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <TeamPreview
          members={members}
          brandColor={primary}
          secondary={secondary}
          mode={brandMode}
          harmony={harmony}
          title={title}
          selectedStyle={style}
          onStyleChange={setStyle}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => {
              router.push('/admin/home-components');
            }}
          >
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting || !hasChanges}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { CalendarDays, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../components/ui';
import { ModuleGuard } from '../../components/ModuleGuard';
import { useAdminAuth } from '../../auth/context';

const MODULE_KEY = 'calendar';

const PRIORITIES = [
  { value: 'LOW', label: 'Thấp' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HIGH', label: 'Cao' },
];

const STATUS_OPTIONS = [
  { value: 'Todo', label: 'Chưa làm' },
  { value: 'InProgress', label: 'Đang làm' },
  { value: 'Done', label: 'Hoàn thành' },
];

const WEEK_DAY_OPTIONS = [
  { value: 'MO', label: 'T2' },
  { value: 'TU', label: 'T3' },
  { value: 'WE', label: 'T4' },
  { value: 'TH', label: 'T5' },
  { value: 'FR', label: 'T6' },
  { value: 'SA', label: 'T7' },
  { value: 'SU', label: 'CN' },
];

function parseDateInput(value: string, allDay: boolean): number | undefined {
  if (!value) {
    return undefined;
  }
  if (allDay) {
    return new Date(`${value}T00:00:00`).getTime();
  }
  return new Date(value).getTime();
}

function buildRrule({
  freq,
  interval,
  byDay,
  until,
  count,
}: {
  freq: string;
  interval: number;
  byDay: string[];
  until?: string;
  count?: number;
}) {
  const parts = [`FREQ=${freq}`, `INTERVAL=${interval}`];
  if (byDay.length) {
    parts.push(`BYDAY=${byDay.join(',')}`);
  }
  if (until) {
    const formatted = until.replaceAll('-', '');
    parts.push(`UNTIL=${formatted}`);
  }
  if (count) {
    parts.push(`COUNT=${count}`);
  }
  return parts.join(';');
}

function extractUntilTimestamp(rule: string): number | undefined {
  const match = rule.match(/UNTIL=([0-9T]+Z?)/);
  if (!match) {
    return undefined;
  }
  const raw = match[1];
  if (/^\d{8}$/.test(raw)) {
    const year = Number(raw.slice(0, 4));
    const month = Number(raw.slice(4, 6)) - 1;
    const day = Number(raw.slice(6, 8));
    return Date.UTC(year, month, day, 23, 59, 59);
  }
  if (/^\d{8}T\d{6}Z$/.test(raw)) {
    const year = Number(raw.slice(0, 4));
    const month = Number(raw.slice(4, 6)) - 1;
    const day = Number(raw.slice(6, 8));
    const hour = Number(raw.slice(9, 11));
    const minute = Number(raw.slice(11, 13));
    const second = Number(raw.slice(13, 15));
    return Date.UTC(year, month, day, hour, minute, second);
  }
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export default function CalendarCreatePage() {
  return (
    <ModuleGuard moduleKey={MODULE_KEY}>
      <CalendarCreateForm />
    </ModuleGuard>
  );
}

function CalendarCreateForm() {
  const router = useRouter();
  const { user } = useAdminAuth();
  const createTask = useMutation(api.calendar.createCalendarTask);
  const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: MODULE_KEY });
  const fieldsData = useQuery(api.admin.modules.listEnabledModuleFields, { moduleKey: MODULE_KEY });
  const users = useQuery(api.users.listAll, {});

  const enabledFields = useMemo(() => new Set(fieldsData?.map(field => field.fieldKey)), [fieldsData]);
  const defaultStatus = settingsData?.find(setting => setting.settingKey === 'defaultStatus')?.value as string | undefined;
  const defaultPriority = settingsData?.find(setting => setting.settingKey === 'defaultPriority')?.value as string | undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('MEDIUM');
  const [allDay, setAllDay] = useState(false);
  const [startAt, setStartAt] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<Id<'users'> | ''>('');
  const [reminderOffset, setReminderOffset] = useState('');

  const [rruleInput, setRruleInput] = useState('');
  const [rruleFreq, setRruleFreq] = useState('WEEKLY');
  const [rruleInterval, setRruleInterval] = useState(1);
  const [rruleByDay, setRruleByDay] = useState<string[]>(['MO']);
  const [rruleUntil, setRruleUntil] = useState('');
  const [rruleCount, setRruleCount] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultStatus) {
      setStatus(defaultStatus);
    }
    if (defaultPriority) {
      setPriority(defaultPriority);
    }
  }, [defaultPriority, defaultStatus]);

  const handleApplyRrule = () => {
    const rule = buildRrule({
      freq: rruleFreq,
      interval: rruleInterval,
      byDay: rruleByDay,
      until: rruleUntil,
      count: rruleCount ? Number(rruleCount) : undefined,
    });
    setRruleInput(rule);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.id) {
      toast.error('Không xác định được tài khoản admin');
      return;
    }
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    const startAtValue = parseDateInput(startAt, allDay);
    const dueDateValue = parseDateInput(dueDate, allDay);
    if (!startAtValue && !dueDateValue) {
      toast.error('Vui lòng chọn ngày bắt đầu hoặc hạn xử lý');
      return;
    }

    setIsSubmitting(true);
    try {
      const reminderOffsetMinutes = reminderOffset ? Number(reminderOffset) : undefined;
      const recurrenceEndAt = rruleInput ? extractUntilTimestamp(rruleInput) : undefined;

      await createTask({
        allDay,
        assigneeId: assigneeId || undefined,
        createdBy: user.id as Id<'users'>,
        description: enabledFields.has('description') ? description.trim() || undefined : undefined,
        dueDate: enabledFields.has('dueDate') ? dueDateValue : undefined,
        notes: enabledFields.has('notes') ? notes.trim() || undefined : undefined,
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH',
        recurrenceEndAt,
        reminderOffsetMinutes,
        rrule: enabledFields.has('rrule') ? (rruleInput.trim() || undefined) : undefined,
        startAt: enabledFields.has('startAt') ? startAtValue : undefined,
        status: status as 'Todo' | 'InProgress' | 'Done',
        timezone: 'Asia/Ho_Chi_Minh',
        title: title.trim(),
      });
      toast.success('Đã tạo task');
      router.push('/admin/calendar');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Tạo task thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateInputType = allDay ? 'date' : 'datetime-local';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tạo task lịch</h1>
          <div className="text-sm text-slate-500">Thiết lập công việc cần theo dõi</div>
        </div>
        <Button type="submit" className="gap-2" disabled={isSubmitting}>
          <Save size={16} />
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Thông tin chính</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tiêu đề</Label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nhập tiêu đề" />
              </div>
              {enabledFields.has('description') && (
                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="min-h-[90px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              )}
              {enabledFields.has('notes') && (
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {enabledFields.has('rrule') && (
            <Card>
              <CardHeader><CardTitle className="text-base">Lịch lặp (RRULE)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tần suất</Label>
                    <select
                      value={rruleFreq}
                      onChange={(event) => setRruleFreq(event.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chu kỳ</Label>
                    <Input
                      type="number"
                      min={1}
                      value={rruleInterval}
                      onChange={(event) => setRruleInterval(Number(event.target.value) || 1)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>BYDAY</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAY_OPTIONS.map(day => (
                      <label key={day.value} className="inline-flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={rruleByDay.includes(day.value)}
                          onChange={(event) => {
                            setRruleByDay(prev => event.target.checked
                              ? [...prev, day.value]
                              : prev.filter(value => value !== day.value));
                          }}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        {day.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>UNTIL (yyyy-mm-dd)</Label>
                    <Input type="date" value={rruleUntil} onChange={(event) => setRruleUntil(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>COUNT</Label>
                    <Input type="number" min={1} value={rruleCount} onChange={(event) => setRruleCount(event.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={handleApplyRrule} className="gap-2">
                    <CalendarDays size={16} />
                    Tạo RRULE
                  </Button>
                  <span className="text-xs text-slate-400">Bạn có thể chỉnh sửa trực tiếp bên dưới.</span>
                </div>
                <div className="space-y-2">
                  <Label>RRULE</Label>
                  <Input value={rruleInput} onChange={(event) => setRruleInput(event.target.value)} placeholder="FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Thiết lập</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              {enabledFields.has('priority') && (
                <div className="space-y-2">
                  <Label>Ưu tiên</Label>
                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  >
                    {PRIORITIES.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(event) => setAllDay(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Cả ngày
              </label>
              {enabledFields.has('startAt') && (
                <div className="space-y-2">
                  <Label>Bắt đầu</Label>
                  <Input type={dateInputType} value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                </div>
              )}
              {enabledFields.has('dueDate') && (
                <div className="space-y-2">
                  <Label>Hạn xử lý</Label>
                  <Input type={dateInputType} value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                </div>
              )}
              {enabledFields.has('assigneeId') && (
                <div className="space-y-2">
                  <Label>Người phụ trách</Label>
                  <select
                    value={assigneeId}
                    onChange={(event) => setAssigneeId(event.target.value as Id<'users'> | '')}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  >
                    <option value="">Chưa gán</option>
                    {users?.map(user => (
                      <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {enabledFields.has('reminderAt') && (
                <div className="space-y-2">
                  <Label>Nhắc việc trước hạn</Label>
                  <select
                    value={reminderOffset}
                    onChange={(event) => setReminderOffset(event.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  >
                    <option value="">Không nhắc</option>
                    <option value="10">10 phút</option>
                    <option value="30">30 phút</option>
                    <option value="60">1 giờ</option>
                    <option value="1440">24 giờ</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

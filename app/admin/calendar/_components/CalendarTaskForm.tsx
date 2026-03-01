'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Button, Input, Label } from '../../components/ui';
import { useAdminAuth } from '../../auth/context';

type CalendarTaskFormMode = 'create' | 'edit';

type CalendarTaskFormProps = {
  mode: CalendarTaskFormMode;
  task?: Doc<'calendarTasks'> | null;
  onCancel: () => void;
  onSuccess: () => void;
};

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

type RecurrenceType = 'none' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type RecurrenceEndType = 'never' | 'until' | 'count';

function parseDateInput(value: string, allDay: boolean): number | undefined {
  if (!value) {
    return undefined;
  }
  if (allDay) {
    return new Date(`${value}T00:00:00`).getTime();
  }
  return new Date(value).getTime();
}

function formatDateInput(timestamp: number | undefined, allDay: boolean): string {
  if (!timestamp) {
    return '';
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (allDay) {
    return `${year}-${month}-${day}`;
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildRrule({
  freq,
  interval,
  byDay,
  byMonthDay,
  byMonth,
  until,
  count,
}: {
  freq: RecurrenceType;
  interval: number;
  byDay: string[];
  byMonthDay?: number;
  byMonth?: number;
  until?: string;
  count?: number;
}) {
  if (freq === 'none') {
    return '';
  }
  const parts = [`FREQ=${freq}`, `INTERVAL=${interval}`];
  if (byDay.length) {
    parts.push(`BYDAY=${byDay.join(',')}`);
  }
  if (byMonthDay) {
    parts.push(`BYMONTHDAY=${byMonthDay}`);
  }
  if (byMonth) {
    parts.push(`BYMONTH=${byMonth}`);
  }
  if (until) {
    parts.push(`UNTIL=${until.replaceAll('-', '')}`);
  }
  if (count) {
    parts.push(`COUNT=${count}`);
  }
  return parts.join(';');
}

function parseRrule(rule: string) {
  const parts = rule.split(';').map(part => part.trim()).filter(Boolean);
  const map = new Map<string, string>();
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      map.set(key.toUpperCase(), value.toUpperCase());
    }
  });
  return {
    freq: (map.get('FREQ') as RecurrenceType | undefined) ?? 'none',
    interval: Number(map.get('INTERVAL') ?? '1') || 1,
    byDay: map.get('BYDAY')?.split(',').filter(Boolean) ?? [],
    until: map.get('UNTIL')?.slice(0, 8) ?? '',
    count: map.get('COUNT') ?? '',
  };
}

function formatUntilInput(value: string) {
  if (!value || value.length !== 8) {
    return '';
  }
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
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

export function CalendarTaskForm({ mode, task, onCancel, onSuccess }: CalendarTaskFormProps) {
  const { user } = useAdminAuth();
  const createTask = useMutation(api.calendar.createCalendarTask);
  const updateTask = useMutation(api.calendar.updateCalendarTask);
  const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: MODULE_KEY });
  const fieldsData = useQuery(api.admin.modules.listEnabledModuleFields, { moduleKey: MODULE_KEY });
  const users = useQuery(api.users.listAll, {});

  const enabledFields = useMemo(() => new Set(fieldsData?.map(field => field.fieldKey)), [fieldsData]);
  const defaultStatus = settingsData?.find(setting => setting.settingKey === 'defaultStatus')?.value as string | undefined;
  const defaultPriority = settingsData?.find(setting => setting.settingKey === 'defaultPriority')?.value as string | undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('MEDIUM');
  const [allDay, setAllDay] = useState(false);
  const [startAt, setStartAt] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<Id<'users'> | ''>('');
  const [reminderOffset, setReminderOffset] = useState('');

  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceByDay, setRecurrenceByDay] = useState<string[]>(['MO']);
  const [recurrenceEndType, setRecurrenceEndType] = useState<RecurrenceEndType>('never');
  const [recurrenceUntil, setRecurrenceUntil] = useState('');
  const [recurrenceCount, setRecurrenceCount] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'create') {
      if (defaultStatus) {
        setStatus(defaultStatus);
      }
      if (defaultPriority) {
        setPriority(defaultPriority);
      }
      return;
    }
    if (!task) {
      return;
    }
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
    setPriority(task.priority);
    setAllDay(task.allDay);
    setStartAt(formatDateInput(task.startAt ?? task.dueDate, task.allDay));
    setDueDate(formatDateInput(task.dueDate ?? task.startAt, task.allDay));
    setAssigneeId(task.assigneeId ?? '');

    if (task.reminderAt && task.dueDate) {
      const offset = Math.max(Math.round((task.dueDate - task.reminderAt) / 60000), 0);
      setReminderOffset(String(offset));
    } else {
      setReminderOffset('');
    }

    if (task.rrule) {
      const parsed = parseRrule(task.rrule);
      setRecurrenceType(parsed.freq ?? 'none');
      setRecurrenceInterval(parsed.interval);
      setRecurrenceByDay(parsed.byDay.length ? parsed.byDay : ['MO']);
      if (parsed.until) {
        setRecurrenceEndType('until');
        setRecurrenceUntil(formatUntilInput(parsed.until));
      } else if (parsed.count) {
        setRecurrenceEndType('count');
        setRecurrenceCount(parsed.count);
      } else {
        setRecurrenceEndType('never');
      }
    } else {
      setRecurrenceType('none');
      setRecurrenceEndType('never');
      setRecurrenceCount('');
      setRecurrenceUntil('');
    }
  }, [defaultPriority, defaultStatus, mode, task]);

  const dateInputType = allDay ? 'date' : 'datetime-local';

  const handleToggleWeekday = (day: string) => {
    setRecurrenceByDay(prev => (prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day]));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'create' && !user?.id) {
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
      const baseTimestamp = startAtValue ?? dueDateValue ?? Date.now();
      const baseDate = new Date(baseTimestamp);
      const recurrenceRule = recurrenceType === 'none'
        ? undefined
        : buildRrule({
          freq: recurrenceType,
          interval: Math.max(recurrenceInterval, 1),
          byDay: recurrenceType === 'WEEKLY' ? recurrenceByDay : [],
          byMonthDay: recurrenceType === 'MONTHLY' || recurrenceType === 'YEARLY' ? baseDate.getDate() : undefined,
          byMonth: recurrenceType === 'YEARLY' ? baseDate.getMonth() + 1 : undefined,
          until: recurrenceEndType === 'until' && recurrenceUntil ? recurrenceUntil : undefined,
          count: recurrenceEndType === 'count' && recurrenceCount ? Number(recurrenceCount) : undefined,
        });
      const recurrenceEndAt = recurrenceRule ? extractUntilTimestamp(recurrenceRule) : undefined;

      if (mode === 'create') {
        await createTask({
          allDay,
          assigneeId: assigneeId || undefined,
          createdBy: user!.id as Id<'users'>,
          description: enabledFields.has('description') ? description.trim() || undefined : undefined,
          dueDate: enabledFields.has('dueDate') ? dueDateValue : undefined,
          priority: priority as 'LOW' | 'MEDIUM' | 'HIGH',
          recurrenceEndAt,
          reminderOffsetMinutes: enabledFields.has('reminderAt') ? reminderOffsetMinutes : undefined,
          rrule: enabledFields.has('rrule') ? recurrenceRule : undefined,
          startAt: enabledFields.has('startAt') ? startAtValue : undefined,
          status: status as 'Todo' | 'InProgress' | 'Done',
          timezone: 'Asia/Ho_Chi_Minh',
          title: title.trim(),
        });
        toast.success('Đã tạo task');
      } else if (task) {
        await updateTask({
          allDay,
          assigneeId: assigneeId || undefined,
          description: enabledFields.has('description') ? description.trim() || undefined : undefined,
          dueDate: enabledFields.has('dueDate') ? dueDateValue : undefined,
          id: task._id,
          priority: priority as 'LOW' | 'MEDIUM' | 'HIGH',
          recurrenceEndAt,
          reminderOffsetMinutes: enabledFields.has('reminderAt') ? reminderOffsetMinutes : undefined,
          rrule: enabledFields.has('rrule') ? recurrenceRule : undefined,
          startAt: enabledFields.has('startAt') ? startAtValue : undefined,
          status: status as 'Todo' | 'InProgress' | 'Done',
          timezone: 'Asia/Ho_Chi_Minh',
          title: title.trim(),
        });
        toast.success('Đã cập nhật task');
      }

      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lưu task thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Ưu tiên</Label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {PRIORITIES.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {enabledFields.has('allDay') && (
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(event) => setAllDay(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Cả ngày
        </label>
      )}

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {enabledFields.has('assigneeId') && (
          <div className="space-y-2">
            <Label>Người phụ trách</Label>
            <select
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value as Id<'users'> | '')}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Chưa phân công</option>
              {users?.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
        )}
        {enabledFields.has('reminderAt') && (
          <div className="space-y-2">
            <Label>Nhắc trước (phút)</Label>
            <Input
              type="number"
              min={0}
              value={reminderOffset}
              onChange={(event) => setReminderOffset(event.target.value)}
              placeholder="VD: 60"
            />
          </div>
        )}
      </div>

      {enabledFields.has('rrule') && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <div className="flex flex-col gap-2">
            <Label>Lịch lặp</Label>
            <select
              value={recurrenceType}
              onChange={(event) => setRecurrenceType(event.target.value as RecurrenceType)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              <option value="none">Không lặp</option>
              <option value="DAILY">Hàng ngày</option>
              <option value="WEEKLY">Hàng tuần</option>
              <option value="MONTHLY">Hàng tháng</option>
              <option value="YEARLY">Hàng năm</option>
            </select>
          </div>

          {recurrenceType !== 'none' && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Lặp mỗi</Label>
                  <Input
                    type="number"
                    min={1}
                    value={recurrenceInterval}
                    onChange={(event) => setRecurrenceInterval(Number(event.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị</Label>
                  <div className="h-10 rounded-md border border-slate-200 px-3 text-sm flex items-center">
                    {recurrenceType === 'DAILY' && 'Ngày'}
                    {recurrenceType === 'WEEKLY' && 'Tuần'}
                    {recurrenceType === 'MONTHLY' && 'Tháng'}
                    {recurrenceType === 'YEARLY' && 'Năm'}
                  </div>
                </div>
              </div>

              {recurrenceType === 'WEEKLY' && (
                <div className="space-y-2">
                  <Label>Chọn thứ</Label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAY_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleToggleWeekday(option.value)}
                        className={`rounded-md border px-3 py-1 text-sm ${recurrenceByDay.includes(option.value)
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Kết thúc</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="recurrenceEnd"
                      checked={recurrenceEndType === 'never'}
                      onChange={() => setRecurrenceEndType('never')}
                    />
                    Không bao giờ
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="recurrenceEnd"
                      checked={recurrenceEndType === 'until'}
                      onChange={() => setRecurrenceEndType('until')}
                    />
                    Đến ngày
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="recurrenceEnd"
                      checked={recurrenceEndType === 'count'}
                      onChange={() => setRecurrenceEndType('count')}
                    />
                    Sau số lần
                  </label>
                </div>
                {recurrenceEndType === 'until' && (
                  <Input type="date" value={recurrenceUntil} onChange={(event) => setRecurrenceUntil(event.target.value)} />
                )}
                {recurrenceEndType === 'count' && (
                  <Input type="number" min={1} value={recurrenceCount} onChange={(event) => setRecurrenceCount(event.target.value)} />
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu task'}
        </Button>
      </div>
    </form>
  );
}

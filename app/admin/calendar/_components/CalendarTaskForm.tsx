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

function parseDateInput(value: string): number | undefined {
  if (!value) {
    return undefined;
  }
  return new Date(`${value}T00:00:00`).getTime();
}

function formatDateInput(timestamp: number | undefined): string {
  if (!timestamp) {
    return '';
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CalendarTaskForm({ mode, task, onCancel, onSuccess }: CalendarTaskFormProps) {
  const { user } = useAdminAuth();
  const createTask = useMutation(api.calendar.createCalendarTask);
  const updateTask = useMutation(api.calendar.updateCalendarTask);
  const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: MODULE_KEY });
  const fieldsData = useQuery(api.admin.modules.listEnabledModuleFields, { moduleKey: MODULE_KEY });
  const users = useQuery(api.users.listAll, {});
  const customers = useQuery(api.customers.listAll, fieldsData?.some(field => field.fieldKey === 'customerId') ? {} : 'skip');
  const products = useQuery(api.products.listAll, fieldsData?.some(field => field.fieldKey === 'productId') ? {} : 'skip');

  const enabledFields = useMemo(() => new Set(fieldsData?.map(field => field.fieldKey)), [fieldsData]);
  const defaultStatus = settingsData?.find(setting => setting.settingKey === 'defaultStatus')?.value as string | undefined;
  const defaultPriority = settingsData?.find(setting => setting.settingKey === 'defaultPriority')?.value as string | undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<Id<'users'> | ''>('');
  const [reminderOffset, setReminderOffset] = useState('');
  const [customerId, setCustomerId] = useState<Id<'customers'> | ''>('');
  const [productId, setProductId] = useState<Id<'products'> | ''>('');

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
    setDueDate(formatDateInput(task.dueDate ?? task.startAt));
    setAssigneeId(task.assigneeId ?? '');
    setCustomerId(task.customerId ?? '');
    setProductId(task.productId ?? '');

    if (task.reminderAt && task.dueDate) {
      const offset = Math.max(Math.round((task.dueDate - task.reminderAt) / (24 * 60 * 60 * 1000)), 0);
      setReminderOffset(String(offset));
    } else {
      setReminderOffset('');
    }
  }, [defaultPriority, defaultStatus, mode, task]);

  const applyRenewalDays = (days: number) => {
    const current = parseDateInput(dueDate);
    if (!current) {
      return;
    }
    setDueDate(formatDateInput(current + days * 24 * 60 * 60 * 1000));
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

    const dueDateValue = parseDateInput(dueDate);
    if (!dueDateValue) {
      toast.error('Vui lòng chọn ngày hết hạn');
      return;
    }

    setIsSubmitting(true);
    try {
      const reminderOffsetMinutes = reminderOffset ? Number(reminderOffset) * 24 * 60 : undefined;

      if (mode === 'create') {
        await createTask({
          allDay: true,
          assigneeId: assigneeId || undefined,
          createdBy: user!.id as Id<'users'>,
          customerId: enabledFields.has('customerId') ? customerId || undefined : undefined,
          description: enabledFields.has('description') ? description.trim() || undefined : undefined,
          dueDate: enabledFields.has('dueDate') ? dueDateValue : undefined,
          priority: enabledFields.has('priority') ? (priority as 'LOW' | 'MEDIUM' | 'HIGH') : undefined,
          productId: enabledFields.has('productId') ? productId || undefined : undefined,
          reminderOffsetMinutes: enabledFields.has('reminderAt') ? reminderOffsetMinutes : undefined,
          status: status as 'Todo' | 'InProgress' | 'Done',
          timezone: 'Asia/Ho_Chi_Minh',
          title: title.trim(),
        });
        toast.success('Đã tạo task');
      } else if (task) {
        await updateTask({
          allDay: true,
          assigneeId: assigneeId || undefined,
          customerId: enabledFields.has('customerId') ? customerId || undefined : undefined,
          description: enabledFields.has('description') ? description.trim() || undefined : undefined,
          dueDate: enabledFields.has('dueDate') ? dueDateValue : undefined,
          id: task._id,
          priority: enabledFields.has('priority') ? (priority as 'LOW' | 'MEDIUM' | 'HIGH') : undefined,
          productId: enabledFields.has('productId') ? productId || undefined : undefined,
          reminderOffsetMinutes: enabledFields.has('reminderAt') ? reminderOffsetMinutes : undefined,
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
        {enabledFields.has('priority') && (
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
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {enabledFields.has('dueDate') && (
          <div className="space-y-2">
            <Label>Ngày hết hạn</Label>
            <Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            {mode === 'edit' && (
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => applyRenewalDays(30)}>+1 tháng</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyRenewalDays(90)}>+3 tháng</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyRenewalDays(365)}>+1 năm</Button>
              </div>
            )}
          </div>
        )}
        {enabledFields.has('reminderAt') && (
          <div className="space-y-2">
            <Label>Nhắc trước (ngày)</Label>
            <Input
              type="number"
              min={0}
              value={reminderOffset}
              onChange={(event) => setReminderOffset(event.target.value)}
              placeholder="VD: 3"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {enabledFields.has('customerId') && (
          <div className="space-y-2">
            <Label>Khách hàng</Label>
            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value as Id<'customers'> | '')}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Chưa chọn</option>
              {customers?.map(customer => (
                <option key={customer._id} value={customer._id}>{customer.name}</option>
              ))}
            </select>
          </div>
        )}
        {enabledFields.has('productId') && (
          <div className="space-y-2">
            <Label>Sản phẩm AI</Label>
            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value as Id<'products'> | '')}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Chưa chọn</option>
              {products?.map(product => (
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
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
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu task'}
        </Button>
      </div>
    </form>
  );
}

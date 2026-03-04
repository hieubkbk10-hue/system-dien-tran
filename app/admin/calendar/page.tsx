'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock, ListTodo, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, Button, Card, Input, Popover, PopoverContent, cn } from '../components/ui';
import { ModuleGuard } from '../components/ModuleGuard';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { BulkDeleteConfirmDialog } from '../components/BulkDeleteConfirmDialog';
import { BulkActionBar, SelectCheckbox } from '../components/TableUtilities';
import { CalendarTaskModal } from './_components/CalendarTaskModal';

type CalendarStatus = Doc<'calendarTasks'>['status'];
type CalendarPriority = Doc<'calendarTasks'>['priority'];
type CalendarView = 'month' | 'week' | 'day' | 'year' | 'list';

type CalendarRangeItem = {
  _id: string;
  allDay: boolean;
  assigneeId?: Id<'users'>;
  customerId?: Id<'customers'>;
  dueDate?: number;
  priority: CalendarPriority;
  productId?: Id<'products'>;
  sourceId: Id<'calendarTasks'>;
  startAt?: number;
  status: CalendarStatus;
  title: string;
};

const MODULE_KEY = 'calendar';

const STATUS_LABELS: Record<CalendarStatus, string> = {
  Todo: 'Chưa làm',
  InProgress: 'Đang làm',
  Done: 'Hoàn thành',
};

const STATUS_BADGES: Record<CalendarStatus, { label: string; variant: 'default' | 'warning' | 'secondary' }> = {
  Todo: { label: 'Chưa làm', variant: 'default' },
  InProgress: { label: 'Đang làm', variant: 'warning' },
  Done: { label: 'Hoàn thành', variant: 'secondary' },
};

const PRIORITY_LABELS: Record<CalendarPriority, { label: string; variant: 'secondary' | 'warning' | 'destructive' }> = {
  LOW: { label: 'Thấp', variant: 'secondary' },
  MEDIUM: { label: 'Trung bình', variant: 'warning' },
  HIGH: { label: 'Cao', variant: 'destructive' },
};

const UPCOMING_PRESETS = [
  { value: '24h', label: '24 giờ', hours: 24 },
  { value: '7d', label: '1 tuần', hours: 24 * 7 },
  { value: '1m', label: '1 tháng', hours: 24 * 30 },
  { value: '3m', label: '3 tháng', hours: 24 * 90 },
];

const WEEK_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildMonthGrid(baseDate: Date, weekStartsOn: 'monday' | 'sunday') {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  const firstWeekday = start.getDay();
  const weekStartIndex = weekStartsOn === 'monday' ? 1 : 0;
  const leadingDays = (firstWeekday - weekStartIndex + 7) % 7;
  const totalDays = end.getDate();
  const totalCells = Math.ceil((leadingDays + totalDays) / 7) * 7;

  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < totalCells; i += 1) {
    const dayOffset = i - leadingDays;
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), dayOffset + 1);
    days.push({ date, isCurrentMonth: dayOffset >= 0 && dayOffset < totalDays });
  }
  return days;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function getWeekStart(date: Date, weekStartsOn: 'monday' | 'sunday') {
  const day = date.getDay();
  const weekStartIndex = weekStartsOn === 'monday' ? 1 : 0;
  const diff = (day - weekStartIndex + 7) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  return startOfDay(start);
}

function buildWeekDays(baseDate: Date, weekStartsOn: 'monday' | 'sunday') {
  const start = getWeekStart(baseDate, weekStartsOn);
  return Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(start);
    date.setDate(start.getDate() + idx);
    return date;
  });
}

function getRangeForView(view: CalendarView, baseDate: Date, weekStartsOn: 'monday' | 'sunday') {
  if (view === 'week') {
    const weekStart = getWeekStart(baseDate, weekStartsOn);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return { start: weekStart.getTime(), end: endOfDay(weekEnd).getTime() };
  }
  if (view === 'day') {
    return { start: startOfDay(baseDate).getTime(), end: endOfDay(baseDate).getTime() };
  }
  if (view === 'year') {
    const start = new Date(baseDate.getFullYear(), 0, 1);
    const end = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59);
    return { start: start.getTime(), end: end.getTime() };
  }
  const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59);
  return { start: monthStart.getTime(), end: monthEnd.getTime() };
}

export default function CalendarPage() {
  return (
    <ModuleGuard moduleKey={MODULE_KEY}>
      <CalendarWorkspace />
    </ModuleGuard>
  );
}

function CalendarWorkspace() {
  const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: MODULE_KEY });
  const featuresData = useQuery(api.admin.modules.listModuleFeatures, { moduleKey: MODULE_KEY });
  const fieldsData = useQuery(api.admin.modules.listEnabledModuleFields, { moduleKey: MODULE_KEY });
  const users = useQuery(api.users.listAll, {});
  const customers = useQuery(
    api.customers.listAll,
    fieldsData?.some(field => field.fieldKey === 'customerId') ? {} : 'skip'
  );
  const products = useQuery(
    api.products.listAll,
    fieldsData?.some(field => field.fieldKey === 'productId') ? {} : 'skip'
  );
  const deleteTask = useMutation(api.calendar.deleteCalendarTask);
  const deleteAllTasks = useMutation(api.calendar.deleteAllCalendarTasks);
  const deleteOverdueTasks = useMutation(api.calendar.deleteOverdueCalendarTasks);
  const markDone = useMutation(api.calendar.markCalendarTaskDone);
  const setModuleSetting = useMutation(api.admin.modules.setModuleSetting);

  const enabledFeatures = useMemo(() => {
    const features: Record<string, boolean> = {};
    featuresData?.forEach(feature => {
      features[feature.featureKey] = feature.enabled;
    });
    return features;
  }, [featuresData]);

  const calendarPerPage = useMemo(() => {
    const raw = settingsData?.find(setting => setting.settingKey === 'calendarPerPage')?.value as number | undefined;
    return Math.min(Math.max(raw ?? 20, 10), 100);
  }, [settingsData]);

  const upcomingWindowPreset = useMemo(() => {
    const raw = settingsData?.find(setting => setting.settingKey === 'upcomingWindowPreset')?.value as string | undefined;
    return raw && UPCOMING_PRESETS.some(preset => preset.value === raw) ? raw : '24h';
  }, [settingsData]);

  const weekStartsOn = useMemo(() => {
    const raw = settingsData?.find(setting => setting.settingKey === 'weekStartsOn')?.value as string | undefined;
    return raw === 'sunday' ? 'sunday' : 'monday';
  }, [settingsData]);

  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [upcomingPreset, setUpcomingPreset] = useState(upcomingWindowPreset);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<CalendarStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<CalendarPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<Id<'users'> | 'all'>('all');
  const [customerFilter, setCustomerFilter] = useState<Id<'customers'> | 'all'>('all');
  const [productFilter, setProductFilter] = useState<Id<'products'> | 'all'>('all');
  const [queryNow, setQueryNow] = useState(() => Date.now());

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ _id: Id<'calendarTasks'>; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteOldDialogOpen, setDeleteOldDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDeletingOld, setIsDeletingOld] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Id<'calendarTasks'>[]>([]);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTaskId, setEditingTaskId] = useState<Id<'calendarTasks'> | null>(null);

  const enableMonthView = enabledFeatures.enableMonthView ?? true;
  const enableListView = enabledFeatures.enableListView ?? true;
  const isPriorityEnabled = fieldsData?.some(field => field.fieldKey === 'priority') ?? true;
  const isAssigneeEnabled = fieldsData?.some(field => field.fieldKey === 'assigneeId') ?? true;
  const isCustomerEnabled = fieldsData?.some(field => field.fieldKey === 'customerId') ?? true;
  const isProductEnabled = fieldsData?.some(field => field.fieldKey === 'productId') ?? true;

  const refreshNow = () => setQueryNow(Date.now());
  const resetListState = () => {
    setSelectedIds([]);
    setCursorStack([]);
    setCurrentCursor(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!enableMonthView && enableListView) {
      setView('list');
      return;
    }
    if (!enableListView && enableMonthView) {
      setView('month');
    }
  }, [enableMonthView, enableListView]);

  useEffect(() => {
    setUpcomingPreset(upcomingWindowPreset);
  }, [upcomingWindowPreset]);

  useEffect(() => {
    setCursorStack([]);
    setCurrentCursor(null);
    setCurrentPage(1);
    setSelectedIds([]);
    refreshNow();
  }, [statusFilter, priorityFilter, assigneeFilter, customerFilter, productFilter]);

  useEffect(() => {
    if (!isPriorityEnabled && priorityFilter !== 'all') {
      setPriorityFilter('all');
    }
  }, [isPriorityEnabled, priorityFilter]);

  useEffect(() => {
    if (!isAssigneeEnabled && assigneeFilter !== 'all') {
      setAssigneeFilter('all');
    }
  }, [assigneeFilter, isAssigneeEnabled]);

  useEffect(() => {
    if (!isCustomerEnabled && customerFilter !== 'all') {
      setCustomerFilter('all');
    }
  }, [customerFilter, isCustomerEnabled]);

  useEffect(() => {
    if (!isProductEnabled && productFilter !== 'all') {
      setProductFilter('all');
    }
  }, [productFilter, isProductEnabled]);

  useEffect(() => {
    if (view === 'day') {
      setSelectedDateKey(getDateKey(currentDate));
    }
  }, [currentDate, view]);

  useEffect(() => {
    setSelectedIds([]);
  }, [keyword, currentCursor, currentPage, view]);

  const currentMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const viewForRange = view === 'list' ? 'month' : view;
  const { start: rangeStart, end: rangeEnd } = useMemo(
    () => getRangeForView(viewForRange, currentDate, weekStartsOn),
    [currentDate, viewForRange, weekStartsOn]
  );

  const rangeItems = useQuery(api.calendar.listCalendarTasksRange, {
    assigneeId: isAssigneeEnabled && assigneeFilter !== 'all' ? assigneeFilter : undefined,
    customerId: isCustomerEnabled && customerFilter !== 'all' ? customerFilter : undefined,
    from: rangeStart,
    priority: isPriorityEnabled && priorityFilter !== 'all' ? priorityFilter : undefined,
    productId: isProductEnabled && productFilter !== 'all' ? productFilter : undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    to: rangeEnd,
    limit: 300,
  });

  const upcomingWindowHours = useMemo(
    () => UPCOMING_PRESETS.find(preset => preset.value === upcomingPreset)?.hours ?? 24,
    [upcomingPreset]
  );

  const upcomingData = useQuery(api.calendar.listUpcomingTasks, {
    horizonHours: upcomingWindowHours,
    limit: 8,
    now: queryNow,
  });

  const listData = useQuery(api.calendar.listCalendarTasksPage, {
    assigneeId: isAssigneeEnabled && assigneeFilter !== 'all' ? assigneeFilter : undefined,
    customerId: isCustomerEnabled && customerFilter !== 'all' ? customerFilter : undefined,
    cursor: currentCursor ?? undefined,
    pageSize: calendarPerPage,
    priority: isPriorityEnabled && priorityFilter !== 'all' ? priorityFilter : undefined,
    productId: isProductEnabled && productFilter !== 'all' ? productFilter : undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const keywordLower = keyword.trim().toLowerCase();
  const filteredRangeItems = useMemo(() => {
    if (!rangeItems) {
      return [];
    }
    if (!keywordLower) {
      return rangeItems;
    }
    return rangeItems.filter(item => item.title.toLowerCase().includes(keywordLower));
  }, [rangeItems, keywordLower]);

  const listItems = useMemo(() => {
    if (!listData?.items) {
      return [];
    }
    if (!keywordLower) {
      return listData.items;
    }
    return listData.items.filter(task => task.title.toLowerCase().includes(keywordLower));
  }, [listData, keywordLower]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, CalendarRangeItem[]>();
    filteredRangeItems.forEach(item => {
      const target = item.dueDate ?? item.startAt;
      if (!target) {
        return;
      }
      const dateKey = getDateKey(new Date(target));
      const bucket = map.get(dateKey) ?? [];
      bucket.push(item);
      map.set(dateKey, bucket);
    });
    return map;
  }, [filteredRangeItems]);

  const tasksByMonth = useMemo(() => {
    const map = new Map<string, CalendarRangeItem[]>();
    filteredRangeItems.forEach(item => {
      const target = item.dueDate ?? item.startAt;
      if (!target) {
        return;
      }
      const date = new Date(target);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const bucket = map.get(key) ?? [];
      bucket.push(item);
      map.set(key, bucket);
    });
    return map;
  }, [filteredRangeItems]);

  const monthDays = useMemo(() => buildMonthGrid(currentMonth, weekStartsOn), [currentMonth, weekStartsOn]);
  const weekDays = useMemo(() => buildWeekDays(currentDate, weekStartsOn), [currentDate, weekStartsOn]);

  const selectedTasks = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }
    return tasksByDay.get(selectedDateKey) ?? [];
  }, [selectedDateKey, tasksByDay]);

  const usersMap = useMemo(() => {
    const map = new Map<string, Doc<'users'>>();
    users?.forEach(user => map.set(user._id, user));
    return map;
  }, [users]);

  const customersMap = useMemo(() => {
    const map = new Map<string, Doc<'customers'>>();
    customers?.forEach(customer => map.set(customer._id, customer));
    return map;
  }, [customers]);

  const productsMap = useMemo(() => {
    const map = new Map<string, Doc<'products'>>();
    products?.forEach(product => map.set(product._id, product));
    return map;
  }, [products]);

  const getTaskLabel = (task: { title: string; customerId?: Id<'customers'>; productId?: Id<'products'> }) => {
    const customerName = task.customerId ? customersMap.get(task.customerId)?.name : undefined;
    const productName = task.productId ? productsMap.get(task.productId)?.name : undefined;
    if (customerName && productName) {
      return `${customerName} — ${productName}`;
    }
    return customerName ?? productName ?? task.title;
  };

  const getTaskMeta = (task: { customerId?: Id<'customers'>; productId?: Id<'products'> }) => {
    const customerName = task.customerId ? customersMap.get(task.customerId)?.name : undefined;
    const productName = task.productId ? productsMap.get(task.productId)?.name : undefined;
    if (customerName && productName) {
      return `${customerName} — ${productName}`;
    }
    return customerName ?? productName ?? '';
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteTask({ id: deleteTarget._id });
      toast.success('Đã xóa task');
      refreshNow();
      setDeleteTarget(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa task thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkDone = async (taskId: Id<'calendarTasks'>) => {
    try {
      await markDone({ id: taskId });
      toast.success('Đã hoàn thành task');
      refreshNow();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cập nhật thất bại');
    }
  };

  const handleToggleSelectAll = () => {
    if (listItems.length === 0) {
      return;
    }
    const allSelected = listItems.every(task => selectedIds.includes(task._id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !listItems.some(task => task._id === id)));
      return;
    }
    setSelectedIds(prev => {
      const next = new Set(prev);
      listItems.forEach(task => next.add(task._id));
      return Array.from(next);
    });
  };

  const handleToggleSelectItem = (taskId: Id<'calendarTasks'>) => {
    setSelectedIds(prev => (prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      return;
    }
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteTask({ id })));
      toast.success(`Đã xóa ${selectedIds.length} task`);
      setSelectedIds([]);
      setBulkDeleteDialogOpen(false);
      refreshNow();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa task thất bại');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const result = await deleteAllTasks({});
      const deletedCount = result?.deletedCount ?? 0;
      toast.success(deletedCount > 0 ? `Đã xóa ${deletedCount} task` : 'Không có task để xóa');
      resetListState();
      refreshNow();
      setDeleteAllDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa task thất bại');
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleDeleteOverdue = async () => {
    setIsDeletingOld(true);
    try {
      const result = await deleteOverdueTasks({ now: Date.now() });
      const deletedCount = result?.deletedCount ?? 0;
      toast.success(deletedCount > 0 ? `Đã xóa ${deletedCount} task quá hạn` : 'Không có task quá hạn để xóa');
      resetListState();
      refreshNow();
      setDeleteOldDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa task thất bại');
    } finally {
      setIsDeletingOld(false);
    }
  };

  const handlePrevRange = () => {
    setCurrentDate(prev => {
      if (view === 'week') {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7);
      }
      if (view === 'day') {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1);
      }
      if (view === 'year') {
        return new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate());
      }
      return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
    });
    setSelectedDateKey(null);
    refreshNow();
  };

  const handleNextRange = () => {
    setCurrentDate(prev => {
      if (view === 'week') {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7);
      }
      if (view === 'day') {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1);
      }
      if (view === 'year') {
        return new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate());
      }
      return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
    });
    setSelectedDateKey(null);
    refreshNow();
  };

  const handleNextPage = () => {
    if (!listData?.continueCursor) {
      return;
    }
    setCursorStack(prev => [...prev, currentCursor]);
    setCurrentCursor(listData.continueCursor);
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCursorStack(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const next = [...prev];
      const previousCursor = next.pop() ?? null;
      setCurrentCursor(previousCursor);
      setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
      return next;
    });
  };

  const handleUpcomingPresetChange = async (value: string) => {
    setUpcomingPreset(value);
    try {
      await setModuleSetting({ moduleKey: MODULE_KEY, settingKey: 'upcomingWindowPreset', value });
      toast.success('Đã cập nhật cửa sổ nhắc việc');
      refreshNow();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cập nhật thất bại');
    }
  };

  const isLoading = settingsData === undefined
    || featuresData === undefined
    || fieldsData === undefined
    || rangeItems === undefined
    || listData === undefined
    || upcomingData === undefined
    || (isCustomerEnabled && customers === undefined)
    || (isProductEnabled && products === undefined);
  const listColSpan = 5
    + (isPriorityEnabled ? 1 : 0)
    + (isAssigneeEnabled ? 1 : 0)
    + (isCustomerEnabled ? 1 : 0)
    + (isProductEnabled ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Calendar</h1>
          <p className="text-sm text-slate-500">Theo dõi công việc sắp đến hạn và lịch nội bộ.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setModalMode('create');
              setEditingTaskId(null);
              setModalOpen(true);
            }}
          >
            <Plus size={16} />
            Tạo task
          </Button>
          <Popover>
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setActionMenuOpen(prev => !prev)}
              >
                Hành động
                <ChevronDown size={14} />
              </Button>
              {actionMenuOpen && (
                <PopoverContent align="end" className="w-56 p-2">
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => {
                      setActionMenuOpen(false);
                      setDeleteAllDialogOpen(true);
                    }}
                  >
                    Xóa toàn bộ task
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setActionMenuOpen(false);
                      setDeleteOldDialogOpen(true);
                    }}
                  >
                    Xóa toàn bộ task cũ
                  </button>
                </PopoverContent>
              )}
            </div>
          </Popover>
          {(enableMonthView || enableListView) && (
            <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
              {enableMonthView && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setView('month');
                      refreshNow();
                    }}
                    className={cn('px-3 py-2 text-sm flex items-center gap-2', view === 'month' ? 'bg-blue-50 text-blue-600' : 'text-slate-500')}
                  >
                    <CalendarDays size={16} /> Month
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('week');
                      setSelectedDateKey(null);
                      refreshNow();
                    }}
                    className={cn('px-3 py-2 text-sm flex items-center gap-2', view === 'week' ? 'bg-blue-50 text-blue-600' : 'text-slate-500')}
                  >
                    <CalendarDays size={16} /> Week
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('day');
                      refreshNow();
                    }}
                    className={cn('px-3 py-2 text-sm flex items-center gap-2', view === 'day' ? 'bg-blue-50 text-blue-600' : 'text-slate-500')}
                  >
                    <Clock size={16} /> Day
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('year');
                      refreshNow();
                    }}
                    className={cn('px-3 py-2 text-sm flex items-center gap-2', view === 'year' ? 'bg-blue-50 text-blue-600' : 'text-slate-500')}
                  >
                    <CalendarDays size={16} /> Year
                  </button>
                </>
              )}
              {enableListView && (
                <button
                  type="button"
                  onClick={() => {
                    setView('list');
                    refreshNow();
                  }}
                  className={cn('px-3 py-2 text-sm flex items-center gap-2', view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500')}
                >
                  <ListTodo size={16} /> List
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo tiêu đề"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as CalendarStatus | 'all')}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {isPriorityEnabled && (
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as CalendarPriority | 'all')}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả ưu tiên</option>
                {Object.entries(PRIORITY_LABELS).map(([value, meta]) => (
                  <option key={value} value={value}>{meta.label}</option>
                ))}
              </select>
            )}
            {isAssigneeEnabled && (
              <select
                value={assigneeFilter}
                onChange={(event) => setAssigneeFilter(event.target.value as Id<'users'> | 'all')}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả người phụ trách</option>
                {users?.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            )}
            {isCustomerEnabled && (
              <select
                value={customerFilter}
                onChange={(event) => setCustomerFilter(event.target.value as Id<'customers'> | 'all')}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả khách hàng</option>
                {customers?.map(customer => (
                  <option key={customer._id} value={customer._id}>{customer.name}</option>
                ))}
              </select>
            )}
            {isProductEnabled && (
              <select
                value={productFilter}
                onChange={(event) => setProductFilter(event.target.value as Id<'products'> | 'all')}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">Tất cả sản phẩm</option>
                {products?.map(product => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock size={16} /> Quá hạn
          </div>
          <div className="mt-3 space-y-2">
            {(upcomingData?.overdue ?? []).length === 0 && (
              <div className="text-sm text-slate-400">Không có task quá hạn</div>
            )}
            {(upcomingData?.overdue ?? []).map(task => (
              <div key={task._id} className="flex items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left text-slate-700"
                  onClick={() => {
                    setModalMode('edit');
                    setEditingTaskId(task._id);
                    setModalOpen(true);
                  }}
                >
                  <div className="truncate">{task.title}</div>
                  {getTaskMeta(task) && (
                    <div className="text-xs text-slate-400 truncate">{getTaskMeta(task)}</div>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{new Date(task.dueDate ?? task.startAt ?? 0).toLocaleDateString('vi-VN')}</Badge>
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={() => {
                      setModalMode('edit');
                      setEditingTaskId(task._id);
                      setModalOpen(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => {
                      setDeleteTarget({ _id: task._id, title: task.title });
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Clock size={16} /> Sắp đến hạn
            </div>
            <select
              value={upcomingPreset}
              onChange={(event) => handleUpcomingPresetChange(event.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"
            >
              {UPCOMING_PRESETS.map(preset => (
                <option key={preset.value} value={preset.value}>{preset.label}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 space-y-2">
            {(upcomingData?.dueSoon ?? []).length === 0 && (
              <div className="text-sm text-slate-400">Không có task sắp đến hạn</div>
            )}
            {(upcomingData?.dueSoon ?? []).map(task => (
              <div key={task._id} className="flex items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left text-slate-700"
                  onClick={() => {
                    setModalMode('edit');
                    setEditingTaskId(task._id);
                    setModalOpen(true);
                  }}
                >
                  <div className="truncate">{task.title}</div>
                  {getTaskMeta(task) && (
                    <div className="text-xs text-slate-400 truncate">{getTaskMeta(task)}</div>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{new Date(task.dueDate ?? task.startAt ?? 0).toLocaleDateString('vi-VN')}</Badge>
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={() => {
                      setModalMode('edit');
                      setEditingTaskId(task._id);
                      setModalOpen(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => {
                      setDeleteTarget({ _id: task._id, title: task.title });
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {view === 'month' && enableMonthView && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevRange}>
                <ChevronLeft size={16} />
              </Button>
              <div className="text-lg font-semibold">
                {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </div>
              <Button variant="ghost" size="icon" onClick={handleNextRange}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-slate-400">
            {(weekStartsOn === 'monday' ? [...WEEK_LABELS.slice(1), WEEK_LABELS[0]] : WEEK_LABELS).map(label => (
              <div key={label} className="text-center">{label}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthDays.map(({ date, isCurrentMonth }) => {
              const dateKey = getDateKey(date);
              const items = tasksByDay.get(dateKey) ?? [];
              const overdueCount = items.filter(item => item.status !== 'Done' && (item.dueDate ?? item.startAt ?? 0) < queryNow).length;
              const priorityCounts = isPriorityEnabled ? items.reduce((acc, item) => {
                if (item.status === 'Done') {
                  return acc;
                }
                acc[item.priority] += 1;
                return acc;
              }, { LOW: 0, MEDIUM: 0, HIGH: 0 }) : null;
              const statusCounts = items.reduce((acc, item) => {
                acc[item.status] += 1;
                return acc;
              }, { Todo: 0, InProgress: 0, Done: 0 });
              const isSelected = selectedDateKey === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDateKey(dateKey)}
                  className={cn(
                    'min-h-[92px] rounded-md border px-2 py-2 text-left text-xs transition',
                    isCurrentMonth ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400',
                    isSelected && 'ring-2 ring-blue-500'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{date.getDate()}</span>
                    <div className="flex items-center gap-1">
                      {isPriorityEnabled && priorityCounts && priorityCounts.HIGH > 0 && (
                        <Badge variant={PRIORITY_LABELS.HIGH.variant} className="text-[10px]">Cao {priorityCounts.HIGH}</Badge>
                      )}
                      {isPriorityEnabled && priorityCounts && priorityCounts.MEDIUM > 0 && (
                        <Badge variant={PRIORITY_LABELS.MEDIUM.variant} className="text-[10px]">TB {priorityCounts.MEDIUM}</Badge>
                      )}
                      {isPriorityEnabled && priorityCounts && priorityCounts.LOW > 0 && (
                        <Badge variant={PRIORITY_LABELS.LOW.variant} className="text-[10px]">Thấp {priorityCounts.LOW}</Badge>
                      )}
                      {overdueCount > 0 && (
                        <Badge variant="destructive" className="text-[10px]">QH {overdueCount}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {statusCounts.Todo > 0 && (
                      <Badge variant={STATUS_BADGES.Todo.variant} className="text-[10px]">{STATUS_BADGES.Todo.label} {statusCounts.Todo}</Badge>
                    )}
                    {statusCounts.InProgress > 0 && (
                      <Badge variant={STATUS_BADGES.InProgress.variant} className="text-[10px]">{STATUS_BADGES.InProgress.label} {statusCounts.InProgress}</Badge>
                    )}
                    {statusCounts.Done > 0 && (
                      <Badge variant={STATUS_BADGES.Done.variant} className="text-[10px]">{STATUS_BADGES.Done.label} {statusCounts.Done}</Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {items.slice(0, 2).map(item => (
                      <div key={item._id} className="truncate text-[11px] text-slate-600">
                        • {getTaskLabel(item)}
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-[10px] text-slate-400">+{items.length - 2} task</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDateKey && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold">Task ngày {selectedDateKey}</div>
              {selectedTasks.length === 0 ? (
                <div className="text-sm text-slate-400 mt-2">Không có task</div>
              ) : (
                <div className="mt-2 space-y-2">
                  {selectedTasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{task.title}</div>
                        {getTaskMeta(task) && (
                          <div className="text-xs text-slate-500 truncate">{getTaskMeta(task)}</div>
                        )}
                        <div className="text-xs text-slate-500">{STATUS_LABELS[task.status]}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPriorityEnabled && (
                          <Badge variant={PRIORITY_LABELS[task.priority].variant}>{PRIORITY_LABELS[task.priority].label}</Badge>
                        )}
                        <button
                          type="button"
                          className="text-xs text-blue-600"
                          onClick={() => {
                            setModalMode('edit');
                            setEditingTaskId(task.sourceId);
                            setModalOpen(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="text-xs text-red-600"
                          onClick={() => {
                            setDeleteTarget({ _id: task.sourceId, title: task.title });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {view === 'week' && enableMonthView && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevRange}>
                <ChevronLeft size={16} />
              </Button>
              <div className="text-lg font-semibold">
                {weekDays[0]?.toLocaleDateString('vi-VN')} - {weekDays[6]?.toLocaleDateString('vi-VN')}
              </div>
              <Button variant="ghost" size="icon" onClick={handleNextRange}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-slate-400">
            {(weekStartsOn === 'monday' ? [...WEEK_LABELS.slice(1), WEEK_LABELS[0]] : WEEK_LABELS).map(label => (
              <div key={label} className="text-center">{label}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {weekDays.map(date => {
              const dateKey = getDateKey(date);
              const items = tasksByDay.get(dateKey) ?? [];
              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => {
                    setCurrentDate(date);
                    setSelectedDateKey(getDateKey(date));
                  }}
                  className={cn(
                    'min-h-[110px] rounded-md border px-2 py-2 text-left text-xs transition',
                    'border-slate-200 bg-white'
                  )}
                >
                  <div className="text-sm font-semibold text-slate-700">{date.getDate()}</div>
                  <div className="mt-2 space-y-1">
                    {items.slice(0, 3).map(item => (
                      <div key={item._id} className="truncate text-[11px] text-slate-600">• {getTaskLabel(item)}</div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-[10px] text-slate-400">+{items.length - 3} task</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDateKey && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold">Task ngày {selectedDateKey}</div>
              {selectedTasks.length === 0 ? (
                <div className="text-sm text-slate-400 mt-2">Không có task</div>
              ) : (
                <div className="mt-2 space-y-2">
                  {selectedTasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{task.title}</div>
                        {getTaskMeta(task) && (
                          <div className="text-xs text-slate-500 truncate">{getTaskMeta(task)}</div>
                        )}
                        <div className="text-xs text-slate-500">{STATUS_LABELS[task.status]}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPriorityEnabled && (
                          <Badge variant={PRIORITY_LABELS[task.priority].variant}>{PRIORITY_LABELS[task.priority].label}</Badge>
                        )}
                        <button
                          type="button"
                          className="text-xs text-blue-600"
                          onClick={() => {
                            setModalMode('edit');
                            setEditingTaskId(task.sourceId);
                            setModalOpen(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="text-xs text-red-600"
                          onClick={() => {
                            setDeleteTarget({ _id: task.sourceId, title: task.title });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {view === 'day' && enableMonthView && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevRange}>
                <ChevronLeft size={16} />
              </Button>
              <div className="text-lg font-semibold">
                {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <Button variant="ghost" size="icon" onClick={handleNextRange}>
                <ChevronRight size={16} />
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setModalMode('create');
                setEditingTaskId(null);
                setModalOpen(true);
              }}
            >
              <Plus size={14} />
              <span className="ml-1">Tạo task</span>
            </Button>
          </div>

          <div className="mt-4 space-y-2">
            {(tasksByDay.get(getDateKey(currentDate)) ?? []).length === 0 && (
              <div className="text-sm text-slate-400">Không có task</div>
            )}
            {(tasksByDay.get(getDateKey(currentDate)) ?? []).map(task => (
              <div key={task._id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{task.title}</div>
                  {getTaskMeta(task) && (
                    <div className="text-xs text-slate-500 truncate">{getTaskMeta(task)}</div>
                  )}
                  <div className="text-xs text-slate-500">{STATUS_LABELS[task.status]}</div>
                </div>
                <div className="flex items-center gap-2">
                  {isPriorityEnabled && (
                    <Badge variant={PRIORITY_LABELS[task.priority].variant}>{PRIORITY_LABELS[task.priority].label}</Badge>
                  )}
                  <button
                    type="button"
                    className="text-xs text-blue-600"
                    onClick={() => {
                      setModalMode('edit');
                      setEditingTaskId(task.sourceId);
                      setModalOpen(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => {
                      setDeleteTarget({ _id: task.sourceId, title: task.title });
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === 'year' && enableMonthView && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevRange}>
                <ChevronLeft size={16} />
              </Button>
              <div className="text-lg font-semibold">Năm {currentDate.getFullYear()}</div>
              <Button variant="ghost" size="icon" onClick={handleNextRange}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, index) => {
              const monthDate = new Date(currentDate.getFullYear(), index, 1);
              const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
              const items = tasksByMonth.get(monthKey) ?? [];
              return (
                <button
                  key={monthKey}
                  type="button"
                  className="rounded-md border border-slate-200 px-3 py-3 text-left"
                  onClick={() => {
                    setView('month');
                    setCurrentDate(monthDate);
                    refreshNow();
                  }}
                >
                  <div className="text-sm font-semibold text-slate-700">
                    {monthDate.toLocaleDateString('vi-VN', { month: 'long' })}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{items.length} task</div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {view === 'list' && enableListView && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">Danh sách task</div>
            <div className="text-xs text-slate-400">Trang {currentPage}</div>
          </div>
          <BulkActionBar
            selectedCount={selectedIds.length}
            onDelete={() => setBulkDeleteDialogOpen(true)}
            onClearSelection={() => setSelectedIds([])}
            isLoading={isBulkDeleting}
          />
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-4 w-[40px]">
                    <SelectCheckbox
                      checked={listItems.length > 0 && listItems.every(task => selectedIds.includes(task._id))}
                      indeterminate={selectedIds.length > 0 && listItems.some(task => !selectedIds.includes(task._id))}
                      onChange={handleToggleSelectAll}
                      disabled={listItems.length === 0}
                      title="Chọn tất cả"
                    />
                  </th>
                  <th className="py-2 pr-4">Task</th>
                  {isCustomerEnabled && (
                    <th className="py-2 pr-4">Khách hàng</th>
                  )}
                  {isProductEnabled && (
                    <th className="py-2 pr-4">Sản phẩm</th>
                  )}
                  <th className="py-2 pr-4">Hạn</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  {isPriorityEnabled && (
                    <th className="py-2 pr-4">Ưu tiên</th>
                  )}
                  {isAssigneeEnabled && (
                    <th className="py-2 pr-4">Phụ trách</th>
                  )}
                  <th className="py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listItems.length === 0 && (
                  <tr>
                    <td colSpan={listColSpan} className="py-6 text-center text-slate-400">Chưa có task</td>
                  </tr>
                )}
                {listItems.map(task => (
                  <tr key={task._id} className="border-t border-slate-100">
                    <td className="py-3 pr-4">
                      <SelectCheckbox
                        checked={selectedIds.includes(task._id)}
                        onChange={() => handleToggleSelectItem(task._id)}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-800">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-slate-400 line-clamp-1">{task.description}</div>
                      )}
                    </td>
                    {isCustomerEnabled && (
                      <td className="py-3 pr-4 text-slate-600">
                        {task.customerId ? customersMap.get(task.customerId)?.name ?? '---' : '---'}
                      </td>
                    )}
                    {isProductEnabled && (
                      <td className="py-3 pr-4 text-slate-600">
                        {task.productId ? productsMap.get(task.productId)?.name ?? '---' : '---'}
                      </td>
                    )}
                    <td className="py-3 pr-4 text-slate-600">
                      {new Date(task.dueDate ?? task.startAt ?? 0).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={task.status === 'Done' ? 'secondary' : 'default'}>{STATUS_LABELS[task.status]}</Badge>
                    </td>
                    {isPriorityEnabled && (
                      <td className="py-3 pr-4">
                        <Badge variant={PRIORITY_LABELS[task.priority].variant}>{PRIORITY_LABELS[task.priority].label}</Badge>
                      </td>
                    )}
                    {isAssigneeEnabled && (
                      <td className="py-3 pr-4 text-slate-600">
                        {task.assigneeId ? usersMap.get(task.assigneeId)?.name ?? '---' : '---'}
                      </td>
                    )}
                    <td className="py-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs text-blue-600"
                        onClick={() => {
                          setModalMode('edit');
                          setEditingTaskId(task._id);
                          setModalOpen(true);
                        }}
                      >
                        Sửa
                      </button>
                      {task.status !== 'Done' && (
                        <button
                          type="button"
                          className="text-xs text-emerald-600"
                          onClick={() => handleMarkDone(task._id)}
                        >
                          Hoàn thành
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-xs text-red-600 flex items-center gap-1"
                        onClick={() => {
                          setDeleteTarget({ _id: task._id, title: task.title });
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={12} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={cursorStack.length === 0}>
              Trang trước
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={Boolean(listData?.isDone) || !listData?.continueCursor}>
              Trang sau
            </Button>
          </div>
        </Card>
      )}

      <BulkDeleteConfirmDialog
        open={deleteAllDialogOpen}
        onOpenChange={setDeleteAllDialogOpen}
        title="Xóa toàn bộ task"
        description="Hành động này sẽ xóa toàn bộ task trong hệ thống. Không thể hoàn tác."
        onConfirm={handleDeleteAll}
        isLoading={isDeletingAll}
      />

      <BulkDeleteConfirmDialog
        open={deleteOldDialogOpen}
        onOpenChange={setDeleteOldDialogOpen}
        title="Xóa toàn bộ task cũ"
        description="Hành động này sẽ xóa toàn bộ task quá hạn (dueDate < hiện tại)."
        onConfirm={handleDeleteOverdue}
        isLoading={isDeletingOld}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xóa task"
        itemName={deleteTarget?.title ?? 'task'}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Xóa các task đã chọn"
        itemName={`${selectedIds.length} task`}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
      />

      <CalendarTaskModal
        open={modalOpen}
        mode={modalMode}
        taskId={editingTaskId ?? undefined}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refreshNow();
        }}
      />

      {isLoading && (
        <div className="text-sm text-slate-400">Đang tải dữ liệu...</div>
      )}
    </div>
  );
}

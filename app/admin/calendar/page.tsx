'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, ListTodo, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, Button, Card, Input, cn } from '../components/ui';
import { ModuleGuard } from '../components/ModuleGuard';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

type CalendarStatus = Doc<'calendarTasks'>['status'];
type CalendarPriority = Doc<'calendarTasks'>['priority'];

type CalendarRangeItem = {
  _id: string;
  allDay: boolean;
  assigneeId?: Id<'users'>;
  dueDate?: number;
  priority: CalendarPriority;
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

const PRIORITY_LABELS: Record<CalendarPriority, { label: string; variant: 'secondary' | 'warning' | 'destructive' }> = {
  LOW: { label: 'Thấp', variant: 'secondary' },
  MEDIUM: { label: 'Trung bình', variant: 'warning' },
  HIGH: { label: 'Cao', variant: 'destructive' },
};

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

export default function CalendarPage() {
  return (
    <ModuleGuard moduleKey={MODULE_KEY}>
      <CalendarWorkspace />
    </ModuleGuard>
  );
}

function CalendarWorkspace() {
  const router = useRouter();
  const settingsData = useQuery(api.admin.modules.listModuleSettings, { moduleKey: MODULE_KEY });
  const featuresData = useQuery(api.admin.modules.listModuleFeatures, { moduleKey: MODULE_KEY });
  const users = useQuery(api.users.listAll, {});
  const deleteTask = useMutation(api.calendar.deleteCalendarTask);
  const markDone = useMutation(api.calendar.markCalendarTaskDone);

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

  const upcomingWindowHours = useMemo(() => {
    const raw = settingsData?.find(setting => setting.settingKey === 'upcomingWindowHours')?.value as number | undefined;
    return Math.min(Math.max(raw ?? 24, 1), 168);
  }, [settingsData]);

  const weekStartsOn = useMemo(() => {
    const raw = settingsData?.find(setting => setting.settingKey === 'weekStartsOn')?.value as string | undefined;
    return raw === 'sunday' ? 'sunday' : 'monday';
  }, [settingsData]);

  const [view, setView] = useState<'month' | 'list'>('month');
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<CalendarStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<CalendarPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<Id<'users'> | 'all'>('all');
  const [queryNow, setQueryNow] = useState(() => Date.now());

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Doc<'calendarTasks'> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const enableMonthView = enabledFeatures.enableMonthView ?? true;
  const enableListView = enabledFeatures.enableListView ?? true;

  const refreshNow = () => setQueryNow(Date.now());

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
    setCursorStack([]);
    setCurrentCursor(null);
    setCurrentPage(1);
    refreshNow();
  }, [statusFilter, priorityFilter, assigneeFilter]);

  const rangeStart = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getTime(), [currentMonth]);
  const rangeEnd = useMemo(() => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59).getTime(), [currentMonth]);

  const rangeItems = useQuery(api.calendar.listCalendarTasksRange, {
    assigneeId: assigneeFilter === 'all' ? undefined : assigneeFilter,
    from: rangeStart,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    to: rangeEnd,
    limit: 300,
  });

  const upcomingData = useQuery(api.calendar.listUpcomingTasks, {
    horizonHours: upcomingWindowHours,
    limit: 8,
    now: queryNow,
  });

  const listData = useQuery(api.calendar.listCalendarTasksPage, {
    assigneeId: assigneeFilter === 'all' ? undefined : assigneeFilter,
    cursor: currentCursor ?? undefined,
    pageSize: calendarPerPage,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
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

  const monthDays = useMemo(() => buildMonthGrid(currentMonth, weekStartsOn), [currentMonth, weekStartsOn]);

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

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDateKey(null);
    refreshNow();
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
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

  const isLoading = settingsData === undefined || featuresData === undefined || rangeItems === undefined || listData === undefined || upcomingData === undefined;

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
            onClick={() => router.push('/admin/calendar/create')}
          >
            <Plus size={16} />
            Tạo task
          </Button>
          {enableMonthView && enableListView && (
            <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
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
                  setView('list');
                  refreshNow();
                }}
                className={cn('px-3 py-2 text-sm flex items-center gap-2', view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500')}
              >
                <ListTodo size={16} /> List
              </button>
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
              <div key={task._id} className="flex items-center justify-between text-sm">
                <span className="truncate">{task.title}</span>
                <Badge variant="destructive">{new Date(task.dueDate ?? task.startAt ?? 0).toLocaleDateString('vi-VN')}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock size={16} /> Sắp đến hạn ({upcomingWindowHours}h)
          </div>
          <div className="mt-3 space-y-2">
            {(upcomingData?.dueSoon ?? []).length === 0 && (
              <div className="text-sm text-slate-400">Không có task sắp đến hạn</div>
            )}
            {(upcomingData?.dueSoon ?? []).map(task => (
              <div key={task._id} className="flex items-center justify-between text-sm">
                <span className="truncate">{task.title}</span>
                <Badge variant="secondary">{new Date(task.dueDate ?? task.startAt ?? 0).toLocaleDateString('vi-VN')}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {view === 'month' && enableMonthView && (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft size={16} />
              </Button>
              <div className="text-lg font-semibold">
                {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </div>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
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
                    {overdueCount > 0 && (
                      <Badge variant="destructive" className="text-[10px]">{overdueCount}</Badge>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {items.slice(0, 2).map(item => (
                      <div key={item._id} className="truncate text-[11px] text-slate-600">
                        • {item.title}
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
                        <div className="text-xs text-slate-500">{STATUS_LABELS[task.status]}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={PRIORITY_LABELS[task.priority].variant}>{PRIORITY_LABELS[task.priority].label}</Badge>
                        <Link href={`/admin/calendar/${task.sourceId}/edit`} className="text-xs text-blue-600">Sửa</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {view === 'list' && enableListView && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">Danh sách task</div>
            <div className="text-xs text-slate-400">Trang {currentPage}</div>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Task</th>
                  <th className="py-2 pr-4">Hạn</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2 pr-4">Ưu tiên</th>
                  <th className="py-2 pr-4">Phụ trách</th>
                  <th className="py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">Chưa có task</td>
                  </tr>
                )}
                {listItems.map(task => (
                  <tr key={task._id} className="border-t border-slate-100">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-800">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-slate-400 line-clamp-1">{task.description}</div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {new Date(task.dueDate ?? task.startAt ?? 0).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={task.status === 'Done' ? 'secondary' : 'default'}>{STATUS_LABELS[task.status]}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={PRIORITY_LABELS[task.priority].variant}>{PRIORITY_LABELS[task.priority].label}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {task.assigneeId ? usersMap.get(task.assigneeId)?.name ?? '---' : '---'}
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <Link href={`/admin/calendar/${task._id}/edit`} className="text-xs text-blue-600">Sửa</Link>
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
                          setDeleteTarget(task);
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

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xóa task"
        itemName={deleteTarget?.title ?? 'task'}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      {isLoading && (
        <div className="text-sm text-slate-400">Đang tải dữ liệu...</div>
      )}
    </div>
  );
}

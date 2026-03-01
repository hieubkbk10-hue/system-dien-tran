import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';

const calendarStatus = v.union(
  v.literal('Todo'),
  v.literal('InProgress'),
  v.literal('Done')
);

const calendarPriority = v.union(
  v.literal('LOW'),
  v.literal('MEDIUM'),
  v.literal('HIGH')
);

const calendarTaskDoc = v.object({
  _creationTime: v.number(),
  _id: v.id('calendarTasks'),
  allDay: v.boolean(),
  assigneeId: v.optional(v.id('users')),
  completedAt: v.optional(v.number()),
  createdAt: v.number(),
  createdBy: v.id('users'),
  description: v.optional(v.string()),
  dueDate: v.optional(v.number()),
  notes: v.optional(v.string()),
  order: v.number(),
  priority: calendarPriority,
  recurrenceEndAt: v.optional(v.number()),
  reminderAt: v.optional(v.number()),
  rrule: v.optional(v.string()),
  startAt: v.optional(v.number()),
  status: calendarStatus,
  timezone: v.string(),
  title: v.string(),
  updatedAt: v.number(),
  exdates: v.optional(v.array(v.number())),
});

const FAR_FUTURE = Date.UTC(2100, 0, 1);

const DAY_MAP: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface ByDaySpec {
  day: number;
  ordinal?: number;
}

interface RRuleSpec {
  freq: Frequency;
  interval: number;
  byDay?: ByDaySpec[];
  byMonthDay?: number[];
  byMonth?: number[];
  count?: number;
  until?: number;
}

function parseUntil(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    const hour = Number(value.slice(9, 11));
    const minute = Number(value.slice(11, 13));
    const second = Number(value.slice(13, 15));
    return Date.UTC(year, month, day, hour, minute, second);
  }

  if (/^\d{8}$/.test(value)) {
    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6)) - 1;
    const day = Number(value.slice(6, 8));
    return Date.UTC(year, month, day, 23, 59, 59);
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseByDay(value: string | undefined): ByDaySpec[] | undefined {
  if (!value) {
    return undefined;
  }

  const specs = value.split(',').map((token) => token.trim()).filter(Boolean);
  if (specs.length === 0) {
    return undefined;
  }

  const results: ByDaySpec[] = [];
  specs.forEach((spec) => {
    const match = spec.match(/^([+-]?\d{1,2})?(SU|MO|TU|WE|TH|FR|SA)$/);
    if (!match) {
      return;
    }
    const ordinal = match[1] ? Number(match[1]) : undefined;
    const day = DAY_MAP[match[2]];
    results.push({ day, ordinal: Number.isNaN(ordinal) ? undefined : ordinal });
  });

  return results.length ? results : undefined;
}

function parseNumberList(value?: string): number[] | undefined {
  if (!value) {
    return undefined;
  }
  const numbers = value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((num) => !Number.isNaN(num));
  return numbers.length ? numbers : undefined;
}

function parseRrule(rule: string): RRuleSpec | null {
  const parts = rule.split(';').map((part) => part.trim()).filter(Boolean);
  const map = new Map<string, string>();
  parts.forEach((part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      map.set(key.toUpperCase(), value.toUpperCase());
    }
  });

  const freq = map.get('FREQ') as Frequency | undefined;
  if (!freq) {
    return null;
  }

  return {
    freq,
    interval: Number(map.get('INTERVAL') ?? '1') || 1,
    byDay: parseByDay(map.get('BYDAY')),
    byMonthDay: parseNumberList(map.get('BYMONTHDAY')),
    byMonth: parseNumberList(map.get('BYMONTH')),
    count: map.get('COUNT') ? Number(map.get('COUNT')) : undefined,
    until: map.get('UNTIL') ? parseUntil(map.get('UNTIL') ?? '') : undefined,
  };
}

function getUtcDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfUtcDay(timestamp: number): number {
  const date = new Date(timestamp);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function addUtcDays(timestamp: number, days: number): number {
  return timestamp + days * 24 * 60 * 60 * 1000;
}

function getDaysInMonthUtc(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function getNthWeekdayOfMonthUtc(year: number, month: number, weekday: number, ordinal: number): number | null {
  const daysInMonth = getDaysInMonthUtc(year, month);
  if (ordinal > 0) {
    const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const offset = (weekday - firstDay + 7) % 7;
    const dayOfMonth = 1 + offset + (ordinal - 1) * 7;
    return dayOfMonth > daysInMonth ? null : dayOfMonth;
  }

  const lastDay = new Date(Date.UTC(year, month, daysInMonth)).getUTCDay();
  const offset = (lastDay - weekday + 7) % 7;
  const dayOfMonth = daysInMonth - offset + (ordinal + 1) * 7;
  return dayOfMonth < 1 ? null : dayOfMonth;
}

function shouldIncludeMonth(month: number, byMonth?: number[]): boolean {
  if (!byMonth || byMonth.length === 0) {
    return true;
  }
  return byMonth.includes(month + 1);
}

function normalizeMonthDays(days: number[], daysInMonth: number): number[] {
  return days
    .map((day) => (day < 0 ? daysInMonth + 1 + day : day))
    .filter((day) => day >= 1 && day <= daysInMonth);
}

function buildMonthlyDates(year: number, month: number, rule: RRuleSpec, fallbackDay: number): number[] {
  const daysInMonth = getDaysInMonthUtc(year, month);
  if (rule.byMonthDay && rule.byMonthDay.length) {
    return normalizeMonthDays(rule.byMonthDay, daysInMonth);
  }

  if (rule.byDay && rule.byDay.length) {
    const dates: number[] = [];
    rule.byDay.forEach((spec) => {
      if (spec.ordinal) {
        const day = getNthWeekdayOfMonthUtc(year, month, spec.day, spec.ordinal);
        if (day) {
          dates.push(day);
        }
        return;
      }
      for (let d = 1; d <= daysInMonth; d += 1) {
        const weekday = new Date(Date.UTC(year, month, d)).getUTCDay();
        if (weekday === spec.day) {
          dates.push(d);
        }
      }
    });
    return Array.from(new Set(dates)).sort((a, b) => a - b);
  }

  return [Math.min(fallbackDay, daysInMonth)];
}

function expandRruleInstances({
  rule,
  startAt,
  from,
  to,
  limit,
  exdates,
}: {
  rule: string;
  startAt: number;
  from: number;
  to: number;
  limit: number;
  exdates: number[];
}): number[] {
  const parsed = parseRrule(rule);
  if (!parsed) {
    return [];
  }

  const occurrences: number[] = [];
  const countLimit = parsed.count ?? Number.MAX_SAFE_INTEGER;
  const until = parsed.until ?? Number.MAX_SAFE_INTEGER;
  const interval = Math.max(parsed.interval, 1);
  const startDate = new Date(startAt);
  const startDayOfMonth = startDate.getUTCDate();
  const startMonth = startDate.getUTCMonth();
  const startYear = startDate.getUTCFullYear();
  const startTimeMs = startAt - startOfUtcDay(startAt);
  const exdateSet = new Set(exdates.map((value) => getUtcDateKey(value)));

  let totalGenerated = 0;

  const pushOccurrence = (timestamp: number) => {
    if (timestamp < from || timestamp > to) {
      if (timestamp > until) {
        return;
      }
      if (exdateSet.has(getUtcDateKey(timestamp))) {
        return;
      }
      totalGenerated += 1;
      return;
    }
    if (timestamp > until) {
      return;
    }
    if (exdateSet.has(getUtcDateKey(timestamp))) {
      return;
    }
    totalGenerated += 1;
    occurrences.push(timestamp);
  };

  const stopIfDone = () => occurrences.length >= limit || totalGenerated >= countLimit;

  if (parsed.freq === 'DAILY') {
    let current = startAt;
    while (current <= to && !stopIfDone()) {
      const currentDate = new Date(current);
      const weekday = currentDate.getUTCDay();
      const month = currentDate.getUTCMonth();
      const monthDay = currentDate.getUTCDate();
      const allowByDay = !parsed.byDay || parsed.byDay.some(spec => spec.day === weekday && !spec.ordinal);
      const allowByMonth = shouldIncludeMonth(month, parsed.byMonth);
      const allowByMonthDay = !parsed.byMonthDay || normalizeMonthDays(parsed.byMonthDay, getDaysInMonthUtc(currentDate.getUTCFullYear(), month)).includes(monthDay);
      if (allowByDay && allowByMonth && allowByMonthDay) {
        pushOccurrence(current);
      }
      if (current > until) {
        break;
      }
      current = addUtcDays(current, interval);
    }
    return occurrences;
  }

  if (parsed.freq === 'WEEKLY') {
    const byDays = parsed.byDay?.length ? parsed.byDay.filter(spec => !spec.ordinal).map(spec => spec.day) : [startDate.getUTCDay()];
    let weekStart = startOfUtcDay(startAt) - startDate.getUTCDay() * 24 * 60 * 60 * 1000;
    while (weekStart <= to && !stopIfDone()) {
      for (const weekday of byDays) {
        const dayTimestamp = weekStart + weekday * 24 * 60 * 60 * 1000 + startTimeMs;
        if (dayTimestamp < startAt) {
          continue;
        }
        if (!shouldIncludeMonth(new Date(dayTimestamp).getUTCMonth(), parsed.byMonth)) {
          continue;
        }
        pushOccurrence(dayTimestamp);
        if (stopIfDone()) {
          break;
        }
      }
      if (weekStart > until) {
        break;
      }
      weekStart = addUtcDays(weekStart, interval * 7);
    }
    return occurrences;
  }

  if (parsed.freq === 'MONTHLY') {
    let year = startYear;
    let month = startMonth;
    let step = 0;
    while (!stopIfDone()) {
      if (shouldIncludeMonth(month, parsed.byMonth)) {
        const monthDays = buildMonthlyDates(year, month, parsed, startDayOfMonth);
        for (const day of monthDays) {
          const timestamp = Date.UTC(year, month, day) + startTimeMs;
          if (timestamp < startAt) {
            continue;
          }
          pushOccurrence(timestamp);
          if (stopIfDone()) {
            break;
          }
        }
      }

      step += 1;
      month += interval;
      year += Math.floor(month / 12);
      month %= 12;
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      if (Date.UTC(year, month, 1) > to || step > 1200) {
        break;
      }
    }
    return occurrences;
  }

  if (parsed.freq === 'YEARLY') {
    let year = startYear;
    let step = 0;
    while (!stopIfDone()) {
      const months = parsed.byMonth && parsed.byMonth.length ? parsed.byMonth.map(m => m - 1) : [startMonth];
      for (const month of months) {
        if (!shouldIncludeMonth(month, parsed.byMonth)) {
          continue;
        }
        const monthDays = buildMonthlyDates(year, month, parsed, startDayOfMonth);
        for (const day of monthDays) {
          const timestamp = Date.UTC(year, month, day) + startTimeMs;
          if (timestamp < startAt) {
            continue;
          }
          pushOccurrence(timestamp);
          if (stopIfDone()) {
            break;
          }
        }
        if (stopIfDone()) {
          break;
        }
      }
      step += 1;
      year += interval;
      if (Date.UTC(year, 0, 1) > to || step > 200) {
        break;
      }
    }
    return occurrences;
  }

  return occurrences;
}

function getEffectiveDueDate(task: Doc<'calendarTasks'>): number | null {
  return task.dueDate ?? task.startAt ?? null;
}

function buildReminderAt(targetAt: number | undefined, offsetMinutes?: number): number | undefined {
  if (!targetAt || !offsetMinutes) {
    return undefined;
  }
  return targetAt - offsetMinutes * 60 * 1000;
}

export const getCalendarTask = query({
  args: { id: v.id('calendarTasks') },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
  returns: v.union(v.null(), calendarTaskDoc),
});

export const listCalendarTasksRange = query({
  args: {
    assigneeId: v.optional(v.id('users')),
    from: v.number(),
    limit: v.optional(v.number()),
    priority: v.optional(calendarPriority),
    status: v.optional(calendarStatus),
    to: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 200, 500);
    const tasksMap = new Map<string, Doc<'calendarTasks'>>();

    const dueQuery = args.assigneeId
      ? ctx.db.query('calendarTasks').withIndex('by_assignee_dueDate', q => q.eq('assigneeId', args.assigneeId).gte('dueDate', args.from).lt('dueDate', args.to))
      : args.status
        ? ctx.db.query('calendarTasks').withIndex('by_status_dueDate', q => q.eq('status', args.status!).gte('dueDate', args.from).lt('dueDate', args.to))
        : ctx.db.query('calendarTasks').withIndex('by_dueDate', q => q.gte('dueDate', args.from).lt('dueDate', args.to));

    const dueTasks = await dueQuery.take(limit);

    dueTasks.forEach(task => tasksMap.set(task._id, task));

    const recurringTasks = await ctx.db
      .query('calendarTasks')
      .withIndex('by_recurrence_end', q => q.gte('recurrenceEndAt', args.from))
      .take(limit);

    const baseTasks = Array.from(tasksMap.values()).filter(task => {
      if (args.status && task.status !== args.status) {
        return false;
      }
      if (args.priority && task.priority !== args.priority) {
        return false;
      }
      if (args.assigneeId && task.assigneeId !== args.assigneeId) {
        return false;
      }
      return true;
    });

    const recurringItems = recurringTasks.filter(task => task.rrule && task.startAt && task.startAt <= args.to);
    const occurrences = recurringItems.flatMap(task => {
      const instances = expandRruleInstances({
        rule: task.rrule ?? '',
        startAt: task.startAt ?? args.from,
        from: args.from,
        to: args.to,
        limit,
        exdates: task.exdates ?? [],
      });

      const duration = task.dueDate && task.startAt ? task.dueDate - task.startAt : 0;
      return instances.map((instanceAt) => ({
        _id: `${task._id}_${instanceAt}`,
        allDay: task.allDay,
        assigneeId: task.assigneeId,
        dueDate: duration ? instanceAt + duration : instanceAt,
        priority: task.priority,
        sourceId: task._id,
        startAt: instanceAt,
        status: task.status,
        title: task.title,
      }));
    });

    const items = baseTasks.map(task => ({
      _id: task._id,
      allDay: task.allDay,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      priority: task.priority,
      sourceId: task._id,
      startAt: task.startAt,
      status: task.status,
      title: task.title,
    }));

    const merged = [...items, ...occurrences].filter(item => {
      if (args.status && item.status !== args.status) {
        return false;
      }
      if (args.priority && item.priority !== args.priority) {
        return false;
      }
      if (args.assigneeId && item.assigneeId !== args.assigneeId) {
        return false;
      }
      const effectiveDue = item.dueDate ?? item.startAt ?? null;
      return effectiveDue !== null && effectiveDue >= args.from && effectiveDue < args.to;
    });

    return merged.slice(0, limit);
  },
  returns: v.array(v.object({
    _id: v.string(),
    allDay: v.boolean(),
    assigneeId: v.optional(v.id('users')),
    dueDate: v.optional(v.number()),
    priority: v.optional(calendarPriority),
    sourceId: v.id('calendarTasks'),
    startAt: v.optional(v.number()),
    status: calendarStatus,
    title: v.string(),
  })),
});

export const listCalendarTasksPage = query({
  args: {
    assigneeId: v.optional(v.id('users')),
    cursor: v.optional(v.string()),
    pageSize: v.optional(v.number()),
    priority: v.optional(calendarPriority),
    status: v.optional(calendarStatus),
  },
  handler: async (ctx, args) => {
    const pageSize = Math.min(args.pageSize ?? 20, 100);

    const baseQuery = args.assigneeId
      ? ctx.db.query('calendarTasks').withIndex('by_assignee_dueDate', q => q.eq('assigneeId', args.assigneeId).gte('dueDate', 0))
      : args.status
        ? ctx.db.query('calendarTasks').withIndex('by_status_dueDate', q => q.eq('status', args.status!).gte('dueDate', 0))
        : args.priority
          ? ctx.db.query('calendarTasks').withIndex('by_priority_dueDate', q => q.eq('priority', args.priority!).gte('dueDate', 0))
          : ctx.db.query('calendarTasks').withIndex('by_dueDate', q => q.gte('dueDate', 0));

    const result = await baseQuery
      .order('asc')
      .paginate({ numItems: pageSize, cursor: args.cursor ?? null });

    const items = result.page.filter(task => {
      if (args.status && task.status !== args.status) {
        return false;
      }
      if (args.priority && task.priority !== args.priority) {
        return false;
      }
      if (args.assigneeId && task.assigneeId !== args.assigneeId) {
        return false;
      }
      return true;
    });

    return {
      continueCursor: result.continueCursor,
      isDone: result.isDone,
      items,
    };
  },
  returns: v.object({
    continueCursor: v.union(v.null(), v.string()),
    isDone: v.boolean(),
    items: v.array(calendarTaskDoc),
  }),
});

export const listUpcomingTasks = query({
  args: {
    horizonHours: v.optional(v.number()),
    limit: v.optional(v.number()),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    const horizon = args.now + (args.horizonHours ?? 24) * 60 * 60 * 1000;
    const statuses: Array<Doc<'calendarTasks'>['status']> = ['Todo', 'InProgress'];

    const overdue: Doc<'calendarTasks'>[] = [];
    const dueSoon: Doc<'calendarTasks'>[] = [];

    for (const status of statuses) {
      const overdueItems = await ctx.db
        .query('calendarTasks')
        .withIndex('by_status_dueDate', q => q.eq('status', status).lt('dueDate', args.now))
        .take(limit);
      overdue.push(...overdueItems);

      const dueSoonItems = await ctx.db
        .query('calendarTasks')
        .withIndex('by_status_dueDate', q => q.eq('status', status).gte('dueDate', args.now).lt('dueDate', horizon))
        .take(limit);
      dueSoon.push(...dueSoonItems);
    }

    const sortByDueDate = (a: Doc<'calendarTasks'>, b: Doc<'calendarTasks'>) => (getEffectiveDueDate(a) ?? 0) - (getEffectiveDueDate(b) ?? 0);
    return {
      dueSoon: dueSoon.sort(sortByDueDate).slice(0, limit),
      overdue: overdue.sort(sortByDueDate).slice(0, limit),
    };
  },
  returns: v.object({
    dueSoon: v.array(calendarTaskDoc),
    overdue: v.array(calendarTaskDoc),
  }),
});

export const createCalendarTask = mutation({
  args: {
    allDay: v.boolean(),
    assigneeId: v.optional(v.id('users')),
    createdBy: v.id('users'),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    priority: calendarPriority,
    recurrenceEndAt: v.optional(v.number()),
    reminderOffsetMinutes: v.optional(v.number()),
    rrule: v.optional(v.string()),
    startAt: v.optional(v.number()),
    status: calendarStatus,
    timezone: v.string(),
    title: v.string(),
    exdates: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const resolvedStartAt = args.startAt ?? args.dueDate;
    const resolvedDueDate = args.dueDate ?? args.startAt;
    if (!resolvedDueDate) {
      throw new Error('Cần chọn ngày bắt đầu hoặc hạn xử lý');
    }

    const recurrenceEndAt = args.rrule ? (args.recurrenceEndAt ?? FAR_FUTURE) : undefined;
    const reminderAt = buildReminderAt(resolvedDueDate, args.reminderOffsetMinutes);

    return ctx.db.insert('calendarTasks', {
      allDay: args.allDay,
      assigneeId: args.assigneeId,
      completedAt: args.status === 'Done' ? now : undefined,
      createdAt: now,
      createdBy: args.createdBy,
      description: args.description,
      dueDate: resolvedDueDate,
      exdates: args.exdates,
      notes: args.notes,
      order: now,
      priority: args.priority,
      recurrenceEndAt,
      reminderAt,
      rrule: args.rrule,
      startAt: resolvedStartAt,
      status: args.status,
      timezone: args.timezone,
      title: args.title,
      updatedAt: now,
    });
  },
  returns: v.id('calendarTasks'),
});

export const updateCalendarTask = mutation({
  args: {
    allDay: v.optional(v.boolean()),
    assigneeId: v.optional(v.id('users')),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    id: v.id('calendarTasks'),
    notes: v.optional(v.string()),
    priority: v.optional(calendarPriority),
    recurrenceEndAt: v.optional(v.number()),
    reminderOffsetMinutes: v.optional(v.number()),
    rrule: v.optional(v.string()),
    startAt: v.optional(v.number()),
    status: v.optional(calendarStatus),
    timezone: v.optional(v.string()),
    title: v.optional(v.string()),
    exdates: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error('Task không tồn tại');
    }

    const nextStartAt = args.startAt ?? args.dueDate ?? task.startAt ?? task.dueDate;
    const nextDueDate = args.dueDate ?? args.startAt ?? task.dueDate ?? task.startAt;
    const reminderAt = args.reminderOffsetMinutes === undefined
      ? task.reminderAt
      : buildReminderAt(nextDueDate ?? undefined, args.reminderOffsetMinutes);
    const nextStatus = args.status ?? task.status;

    await ctx.db.patch(args.id, {
      allDay: args.allDay ?? task.allDay,
      assigneeId: args.assigneeId ?? task.assigneeId,
      completedAt: nextStatus === 'Done' ? Date.now() : undefined,
      description: args.description ?? task.description,
      dueDate: nextDueDate,
      exdates: args.exdates ?? task.exdates,
      notes: args.notes ?? task.notes,
      priority: args.priority ?? task.priority,
      recurrenceEndAt: args.rrule ? (args.recurrenceEndAt ?? FAR_FUTURE) : (args.rrule === '' ? undefined : task.recurrenceEndAt),
      reminderAt,
      rrule: args.rrule ?? task.rrule,
      startAt: nextStartAt,
      status: nextStatus,
      timezone: args.timezone ?? task.timezone,
      title: args.title ?? task.title,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const deleteCalendarTask = mutation({
  args: { id: v.id('calendarTasks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});

export const markCalendarTaskDone = mutation({
  args: { id: v.id('calendarTasks') },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error('Task không tồn tại');
    }
    await ctx.db.patch(args.id, { status: 'Done', completedAt: Date.now(), updatedAt: Date.now() });
    return null;
  },
  returns: v.null(),
});

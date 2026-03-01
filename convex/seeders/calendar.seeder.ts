/**
 * Calendar Seeder
 */

import { BaseSeeder, type SeedConfig, type SeedDependency } from './base';
import type { Doc, DataModel } from '../_generated/dataModel';
import type { GenericMutationCtx } from 'convex/server';

type CalendarTaskData = Omit<Doc<'calendarTasks'>, '_creationTime' | '_id'>;

export class CalendarSeeder extends BaseSeeder<CalendarTaskData> {
  moduleName = 'calendar';
  tableName = 'calendarTasks';
  dependencies: SeedDependency[] = [
    { module: 'users', required: true, minRecords: 1 },
  ];

  private users: Doc<'users'>[] = [];

  constructor(ctx: GenericMutationCtx<DataModel>) {
    super(ctx);
  }

  async seed(config: SeedConfig) {
    await this.seedModuleConfig();
    this.users = await this.ctx.db.query('users').collect();
    if (this.users.length === 0) {
      throw new Error('No users found. Seed users first.');
    }
    return super.seed(config);
  }

  generateFake(): CalendarTaskData {
    const createdBy = this.randomElement(this.users);
    const assignee = this.randomBoolean(0.6) ? this.randomElement(this.users) : undefined;
    const statusPool: CalendarTaskData['status'][] = ['Todo', 'InProgress', 'Done'];
    const priorityPool: CalendarTaskData['priority'][] = ['LOW', 'MEDIUM', 'HIGH'];
    const status = this.randomElement(statusPool);
    const priority = this.randomElement(priorityPool);
    const baseDayOffset = this.randomInt(-5, 20);
    const startOfDay = Date.now() + baseDayOffset * 24 * 60 * 60 * 1000;
    const allDay = this.randomBoolean(0.35);
    const startAt = allDay
      ? new Date(new Date(startOfDay).toDateString()).getTime()
      : startOfDay + this.randomInt(8, 17) * 60 * 60 * 1000;
    const dueDate = startAt + this.randomInt(1, 6) * 60 * 60 * 1000;
    const useRecurring = this.randomBoolean(0.25);
    const rrule = useRecurring
      ? this.randomElement([
        'FREQ=DAILY;INTERVAL=1',
        'FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR',
        'FREQ=MONTHLY;INTERVAL=1;BYDAY=1MO',
      ])
      : undefined;

    return {
      allDay,
      assigneeId: assignee?._id,
      completedAt: status === 'Done' ? Date.now() : undefined,
      createdAt: Date.now(),
      createdBy: createdBy._id,
      description: this.randomBoolean(0.6) ? this.faker.lorem.sentences({ min: 1, max: 2 }) : undefined,
      dueDate,
      exdates: undefined,
      notes: this.randomBoolean(0.3) ? this.faker.lorem.sentence({ min: 6, max: 12 }) : undefined,
      order: Date.now(),
      priority,
      recurrenceEndAt: rrule ? Date.now() + 90 * 24 * 60 * 60 * 1000 : undefined,
      reminderAt: dueDate - 60 * 60 * 1000,
      rrule,
      startAt,
      status,
      timezone: 'Asia/Ho_Chi_Minh',
      title: this.faker.lorem.sentence({ min: 3, max: 6 }),
      updatedAt: Date.now(),
    };
  }

  validateRecord(record: CalendarTaskData): boolean {
    return !!record.title && !!record.dueDate && !!record.createdBy;
  }

  private async seedModuleConfig(): Promise<void> {
    const existingFeatures = await this.ctx.db
      .query('moduleFeatures')
      .withIndex('by_module', q => q.eq('moduleKey', 'calendar'))
      .first();
    if (!existingFeatures) {
      const features = [
        { description: 'Hỗ trợ RRULE cho lịch lặp', enabled: true, featureKey: 'enableRecurring', linkedFieldKey: 'rrule', moduleKey: 'calendar', name: 'Lịch lặp (RRULE)' },
        { description: 'Phân công người phụ trách', enabled: true, featureKey: 'enableAssignee', linkedFieldKey: 'assigneeId', moduleKey: 'calendar', name: 'Phân công' },
        { description: 'Thiết lập nhắc việc trước hạn', enabled: true, featureKey: 'enableReminder', linkedFieldKey: 'reminderAt', moduleKey: 'calendar', name: 'Nhắc việc' },
        { description: 'Thiết lập mức ưu tiên', enabled: true, featureKey: 'enablePriority', linkedFieldKey: 'priority', moduleKey: 'calendar', name: 'Ưu tiên' },
        { description: 'Hiển thị dạng danh sách', enabled: true, featureKey: 'enableListView', moduleKey: 'calendar', name: 'List View' },
        { description: 'Hiển thị dạng month view', enabled: true, featureKey: 'enableMonthView', moduleKey: 'calendar', name: 'Month View' },
      ];
      await Promise.all(features.map(feature => this.ctx.db.insert('moduleFeatures', feature)));
    }

    const existingFields = await this.ctx.db
      .query('moduleFields')
      .withIndex('by_module', q => q.eq('moduleKey', 'calendar'))
      .first();
    if (!existingFields) {
      const fields = [
        { enabled: true, fieldKey: 'title', isSystem: true, moduleKey: 'calendar', name: 'Tiêu đề', order: 0, required: true, type: 'text' as const },
        { enabled: true, fieldKey: 'description', isSystem: false, moduleKey: 'calendar', name: 'Mô tả', order: 1, required: false, type: 'textarea' as const },
        { enabled: true, fieldKey: 'status', isSystem: true, moduleKey: 'calendar', name: 'Trạng thái', order: 2, required: true, type: 'select' as const },
        { enabled: true, fieldKey: 'priority', isSystem: false, linkedFeature: 'enablePriority', moduleKey: 'calendar', name: 'Ưu tiên', order: 3, required: false, type: 'select' as const },
        { enabled: true, fieldKey: 'startAt', isSystem: false, moduleKey: 'calendar', name: 'Bắt đầu', order: 4, required: false, type: 'date' as const },
        { enabled: true, fieldKey: 'dueDate', isSystem: false, moduleKey: 'calendar', name: 'Hạn xử lý', order: 5, required: false, type: 'date' as const },
        { enabled: true, fieldKey: 'allDay', isSystem: false, moduleKey: 'calendar', name: 'Cả ngày', order: 6, required: false, type: 'boolean' as const },
        { enabled: true, fieldKey: 'assigneeId', isSystem: false, linkedFeature: 'enableAssignee', moduleKey: 'calendar', name: 'Người phụ trách', order: 7, required: false, type: 'select' as const },
        { enabled: true, fieldKey: 'reminderAt', isSystem: false, linkedFeature: 'enableReminder', moduleKey: 'calendar', name: 'Nhắc việc', order: 8, required: false, type: 'date' as const },
        { enabled: true, fieldKey: 'rrule', isSystem: false, linkedFeature: 'enableRecurring', moduleKey: 'calendar', name: 'RRULE', order: 9, required: false, type: 'text' as const },
        { enabled: true, fieldKey: 'timezone', isSystem: false, moduleKey: 'calendar', name: 'Múi giờ', order: 10, required: false, type: 'text' as const },
      ];
      await Promise.all(fields.map(field => this.ctx.db.insert('moduleFields', field)));
    }

    const existingSettings = await this.ctx.db
      .query('moduleSettings')
      .withIndex('by_module', q => q.eq('moduleKey', 'calendar'))
      .first();
    if (!existingSettings) {
      const settings = [
        { moduleKey: 'calendar', settingKey: 'calendarPerPage', value: 20 },
        { moduleKey: 'calendar', settingKey: 'defaultStatus', value: 'Todo' },
        { moduleKey: 'calendar', settingKey: 'defaultPriority', value: 'MEDIUM' },
        { moduleKey: 'calendar', settingKey: 'upcomingWindowPreset', value: '24h' },
        { moduleKey: 'calendar', settingKey: 'timezoneDefault', value: 'Asia/Ho_Chi_Minh' },
        { moduleKey: 'calendar', settingKey: 'weekStartsOn', value: 'monday' },
      ];
      await Promise.all(settings.map(setting => this.ctx.db.insert('moduleSettings', setting)));
    }
  }
}

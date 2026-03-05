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
    const statusPool: CalendarTaskData['status'][] = ['Todo', 'Contacted', 'Churned'];
    const status = this.randomElement(statusPool);
    const daysOffset = this.randomInt(-10, 60);
    const dueDate = Date.now() + daysOffset * 24 * 60 * 60 * 1000;
    const customerNames = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Cường', 'Phạm Thu Dung', 'Hoàng Văn Em'];
    const productNames = ['ChatGPT Plus', 'Claude Pro', 'Gemini Advanced', 'Copilot Pro', 'Midjourney'];
    const customerName = this.randomElement(customerNames);
    const productName = this.randomElement(productNames);

    return {
      allDay: true,
      completedAt: status === 'Churned' ? Date.now() : undefined,
      createdAt: Date.now(),
      createdBy: createdBy._id,
      dueDate,
      order: Date.now(),
      status,
      timezone: 'Asia/Ho_Chi_Minh',
      title: `Gia hạn ${productName} — ${customerName}`,
      updatedAt: Date.now(),
    };
  }

  validateRecord(record: CalendarTaskData): boolean {
    return !!record.title && !!record.dueDate && !!record.createdBy;
  }

  private async seedModuleConfig(): Promise<void> {
    const existingFields = await this.ctx.db
      .query('moduleFields')
      .withIndex('by_module', q => q.eq('moduleKey', 'calendar'))
      .first();
    if (!existingFields) {
      const fields = [
        { enabled: true, fieldKey: 'title', isSystem: true, moduleKey: 'calendar', name: 'Tiêu đề', order: 0, required: true, type: 'text' as const },
        { enabled: true, fieldKey: 'status', isSystem: true, moduleKey: 'calendar', name: 'Trạng thái', order: 1, required: true, type: 'select' as const },
        { enabled: true, fieldKey: 'dueDate', isSystem: false, moduleKey: 'calendar', name: 'Ngày nhắc', order: 2, required: true, type: 'date' as const },
        { enabled: true, fieldKey: 'customerId', isSystem: false, linkedFeature: 'enableCustomerLink', moduleKey: 'calendar', name: 'Khách hàng', order: 3, required: true, type: 'select' as const },
        { enabled: true, fieldKey: 'productId', isSystem: false, linkedFeature: 'enableProductLink', moduleKey: 'calendar', name: 'Sản phẩm', order: 4, required: true, type: 'select' as const },
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
        { moduleKey: 'calendar', settingKey: 'weekStartsOn', value: 'monday' },
        { moduleKey: 'calendar', settingKey: 'warningDays', value: 7 },
      ];
      await Promise.all(settings.map(setting => this.ctx.db.insert('moduleSettings', setting)));
    }
  }
}

import { Bell, CalendarDays, ListTodo, Users } from 'lucide-react';
import { defineModule } from '../define-module';

export const calendarModule = defineModule({
  key: 'calendar',
  name: 'Calendar',
  description: 'Quản lý lịch nhắc việc nội bộ theo tháng và danh sách',
  icon: CalendarDays,
  color: 'blue',

  features: [
    { key: 'enableMonthView', label: 'Month View', icon: CalendarDays },
    { key: 'enableListView', label: 'List View', icon: ListTodo },
    { key: 'enableAssignee', label: 'Phân công', icon: Users, linkedField: 'assigneeId' },
    { key: 'enableReminder', label: 'Nhắc việc', icon: Bell, linkedField: 'reminderAt' },
    { key: 'enablePriority', label: 'Ưu tiên', icon: ListTodo, linkedField: 'priority' },
    { key: 'enableCustomerLink', label: 'Liên kết khách hàng', icon: Users, linkedField: 'customerId' },
    { key: 'enableProductLink', label: 'Liên kết sản phẩm AI', icon: ListTodo, linkedField: 'productId' },
  ],

  settings: [
    {
      key: 'calendarPerPage',
      label: 'Số dòng mỗi trang',
      type: 'number',
      default: 20,
    },
    {
      key: 'defaultStatus',
      label: 'Trạng thái mặc định',
      type: 'select',
      default: 'Todo',
      options: [
        { value: 'Todo', label: 'Chưa làm' },
        { value: 'InProgress', label: 'Đang làm' },
        { value: 'Done', label: 'Hoàn thành' },
      ],
    },
    {
      key: 'defaultPriority',
      label: 'Ưu tiên mặc định',
      type: 'select',
      default: 'MEDIUM',
      options: [
        { value: 'LOW', label: 'Thấp' },
        { value: 'MEDIUM', label: 'Trung bình' },
        { value: 'HIGH', label: 'Cao' },
      ],
    },
    {
      key: 'upcomingWindowPreset',
      label: 'Cửa sổ nhắc việc',
      type: 'select',
      default: '24h',
      options: [
        { value: '24h', label: '24 giờ' },
        { value: '7d', label: '1 tuần' },
        { value: '1m', label: '1 tháng' },
        { value: '3m', label: '3 tháng' },
      ],
    },
    {
      key: 'weekStartsOn',
      label: 'Bắt đầu tuần',
      type: 'select',
      default: 'monday',
      options: [
        { value: 'monday', label: 'Thứ 2' },
        { value: 'sunday', label: 'Chủ nhật' },
      ],
    },
  ],

  conventionNote: 'Quản lý task theo lịch tháng và danh sách, tối ưu nhắc gia hạn.',
  tabs: ['config'],
});

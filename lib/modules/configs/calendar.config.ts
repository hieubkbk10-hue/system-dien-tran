import { CalendarDays, ListTodo, Users } from 'lucide-react';
import { defineModule } from '../define-module';

export const calendarModule = defineModule({
  key: 'calendar',
  name: 'Calendar',
  description: 'Quản lý lịch nhắc gia hạn theo danh sách và board',
  icon: CalendarDays,
  color: 'blue',

  features: [
    { key: 'enableListView', label: 'List View', icon: ListTodo },
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
        { value: 'Todo', label: 'Chưa nhắc' },
        { value: 'Contacted', label: 'Đã liên hệ' },
        { value: 'Renewed', label: 'Đã gia hạn' },
        { value: 'Churned', label: 'Không gia hạn' },
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

  conventionNote: 'Tối ưu quy trình nhắc gia hạn khách hàng.',
  tabs: ['config'],
});

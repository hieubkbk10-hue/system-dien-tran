import { CalendarDays } from 'lucide-react';
import { defineModule } from '../define-module';

export const calendarModule = defineModule({
  key: 'calendar',
  name: 'Calendar',
  description: 'Quản lý lịch nhắc gia hạn theo danh sách và board',
  icon: CalendarDays,
  color: 'blue',

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
        { value: 'Churned', label: 'Không gia hạn' },
      ],
    },
    {
      key: 'warningDays',
      label: 'Cảnh báo sớm (ngày)',
      type: 'number',
      default: 7,
    },
  ],

  conventionNote: 'Tối ưu quy trình nhắc gia hạn khách hàng.',
  tabs: ['config'],
});

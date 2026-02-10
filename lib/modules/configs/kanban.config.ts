import { LayoutGrid, ListTodo, Users } from 'lucide-react';
import { defineModule } from '../define-module';

export const kanbanModule = defineModule({
  key: 'kanban',
  name: 'Kanban Board',
  description: 'Quản lý công việc nội bộ theo dạng Kanban',
  icon: LayoutGrid,
  color: 'indigo',

  features: [
    { key: 'enableWipLimit', label: 'Giới hạn WIP', icon: ListTodo },
    { key: 'enableAssignee', label: 'Phân công người phụ trách', icon: Users },
  ],

  settings: [
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
  ],

  conventionNote: 'Kéo thả để sắp xếp task giữa các cột, hỗ trợ WIP limit và phân công.',
  tabs: ['config'],
});

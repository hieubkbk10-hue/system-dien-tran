import { Inbox, Send, LayoutDashboard } from 'lucide-react';
import { defineModule } from '../define-module';

export const contactInboxModule = defineModule({
  key: 'contactInbox',
  name: 'Contact Inbox',
  description: 'Lưu trữ và quản lý tin nhắn liên hệ từ website',
  icon: Inbox,
  color: 'cyan',

  features: [
    { key: 'enableContactFormSubmission', label: 'Cho phép gửi form', icon: Send },
    { key: 'enableContactInboxAdmin', label: 'Quản trị inbox', icon: Inbox },
    { key: 'enableContactDashboardWidget', label: 'Widget dashboard', icon: LayoutDashboard },
  ],

  settings: [
    { key: 'requireEmail', label: 'Bắt buộc Email', type: 'toggle', default: false },
    { key: 'requirePhone', label: 'Bắt buộc Số điện thoại', type: 'toggle', default: false },
    { key: 'inboxRetentionDays', label: 'Số ngày lưu trữ (0 = không giới hạn)', type: 'number', default: 0 },
  ],

  conventionNote: 'Inbox lưu dữ liệu inbound, không gửi email. Bật/tắt form và widget qua feature flags.',

  tabs: ['config'],
});

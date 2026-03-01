'use client';

import { ModuleConfigPage } from '@/components/modules/ModuleConfigPage';
import { calendarModule } from '@/lib/modules/configs/calendar.config';

export default function CalendarModuleConfigPage() {
  return (
    <ModuleConfigPage config={calendarModule} />
  );
}

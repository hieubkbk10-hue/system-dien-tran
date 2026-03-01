'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleGuard } from '../../../components/ModuleGuard';

const MODULE_KEY = 'calendar';

export default function CalendarEditPage() {
  return (
    <ModuleGuard moduleKey={MODULE_KEY}>
      <CalendarRedirect />
    </ModuleGuard>
  );
}

function CalendarRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/calendar');
  }, [router]);

  return <div className="text-sm text-slate-400">Đang chuyển về lịch...</div>;
}

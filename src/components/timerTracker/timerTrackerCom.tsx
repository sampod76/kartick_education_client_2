// components/TimeTrackerMount.tsx
'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { useTimeTracker } from '@/lib/useTimeTracker';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';

function TimeTrackerInner() {
  const pathname = usePathname();
  const search = useSearchParams();
  const { userInfo } = useGlobalContext();

  useTimeTracker({
    disabled: userInfo?.role !== 'student',
    page: pathname,
    userId: userInfo?.id,
    milestoneId: search.get('milestoneId') || search.get('milestone_id') || '',
    heartbeatSec: process.env.NEXT_PUBLIC_TIME_TRACKER_SECOND
      ? Number(process.env.NEXT_PUBLIC_TIME_TRACKER_SECOND)
      : 300,
    idleAfterSec: 60,
  });

  return null;
}

export default function TimeTrackerMount() {
  return (
    <Suspense fallback={null}>
      <TimeTrackerInner />
    </Suspense>
  );
}

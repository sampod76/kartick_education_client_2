'use client';
import { useTimeTracker } from '@/lib/useTimeTracker';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function TimerTrackerCom() {
  const pathname = usePathname();
  const [seconds, setSeconds] = useState(0);
  //   useTimeTracker({
  //     page: pathname,
  //     lessonId: '',
  //     heartbeatSec: 120, // 2 minutes
  //     idleAfterSec: 60, // idle হলে কাউন্ট বন্ধ
  //     onTickSeconds: setSeconds,
  //     // userId: "student-123" // কুকি না থাকলে fallback
  //   });
  return (
    <div>
      <div>{seconds}</div>
    </div>
  );
}

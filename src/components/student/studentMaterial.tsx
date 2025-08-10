'use client';
import { useGetAllTimeTrackerQuery } from '@/redux/api/timeTracker';
import React, { use } from 'react';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
export type TimeEntry = {
  _id?: string;
  user?: {
    role?: string;
    userId?: string;
    roleBaseUserId?: string;
  };
  date: string; // ISO string (UTC)
  totalSeconds: number; // seconds spent that day
  isDelete?: 'yes' | 'no';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

// Utils
function formatDhakaDate(iso: string) {
  const dt = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
  };
  return new Intl.DateTimeFormat(undefined, opts).format(dt);
}

function isTodayInDhaka(iso: string) {
  const now = new Date();
  const tz = 'Asia/Dhaka';
  const d1 = new Date(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now),
  );
  const d2 = new Date(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso)),
  );
  return d1.getTime() === d2.getTime();
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, '0')}s`;
  return `${s}s`;
}

function sumSeconds(entries: TimeEntry[]) {
  return entries.reduce((acc, e) => acc + (e.totalSeconds || 0), 0);
}

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}
export default function StudentMaterial() {
  const search = useSearchParams();
  const user_id = search.get('user_id');
  const { data, isLoading } = useGetAllTimeTrackerQuery({ userId: user_id });
  if (isLoading) return <LoadingSkeleton />;
  const cleaned = (data?.data || [])
    .filter((x) => x && x.totalSeconds >= 0 && x.isDelete !== 'yes')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first

  const maxSeconds = Math.max(1, ...cleaned.map((e) => e.totalSeconds));
  const total = sumSeconds(cleaned);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
              {"Dhaka's Time Tracker"}
            </h2>
            <p className="text-sm text-gray-500">Timezone: Asia/Dhaka</p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-gray-500">Total</div>
            <div className="text-lg sm:text-xl font-semibold text-gray-900">
              {formatDuration(total)}
            </div>
          </div>
        </div>

        {/* List */}
        <ul className="divide-y divide-gray-100">
          {cleaned.length === 0 && (
            <li className="px-5 py-8 sm:px-6 text-center text-gray-500 text-sm">
              No data found
            </li>
          )}

          {cleaned.map((row) => {
            const widthPct = Math.round((row.totalSeconds / maxSeconds) * 100);
            const today = isTodayInDhaka(row.date);
            return (
              <li key={`${row._id}-${row.date}`} className="px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Date + badge */}
                  <div className="min-w-[8rem] sm:min-w-[12rem]">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDhakaDate(row.date)}
                    </div>
                    <div className="mt-1">
                      <span
                        className={classNames(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          today
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700',
                        )}
                        title={new Date(row.date).toISOString()}
                      >
                        {today ? 'Today' : 'Recorded'}
                      </span>
                    </div>
                  </div>

                  {/* Bar + time */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">Time spent</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDuration(row.totalSeconds)}
                      </div>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400"
                        style={{ width: `${widthPct}%` }}
                        aria-valuenow={widthPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400">
                      {widthPct}% of best day
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-5 py-4 sm:px-6 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="block w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400" />
              Study minutes per day
            </span>
            <span className="opacity-60">•</span>
            <span>Max day = {formatDuration(maxSeconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

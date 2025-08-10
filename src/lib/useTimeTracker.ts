/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { useEffect, useRef } from 'react';
import { useAddTimeTrackerMutation } from '@/redux/api/timeTracker';

type BatchItem = { page: string; milestoneId?: string | null; seconds: number };

type Opts = {
  apiUrl?: string; // RTK mutation এর জন্য (same as your existing endpoint path)
  beaconUrl?: string; // ABSOLUTE URL strongly recommended for sendBeacon/keepalive
  heartbeatSec?: number; // default: 120
  idleAfterSec?: number; // default: 60
  maxSecsPerBeat?: number; // per-beat cap per page, default: 300
  page?: string;
  milestoneId?: string | null;
  userId?: string | null;
  authToken?: string | null; // OPTIONAL: cross-origin হলে include করুন (server will verify)
  onTickSeconds?: (s: number) => void;
  disabled?: boolean;
  maxBeaconBytes?: number; // default ~ 60000 (keepalive safe limit)
};

export function useTimeTracker(opts: Opts = { disabled: false }) {
  const [addTimeTracker] = useAddTimeTrackerMutation();

  const {
    apiUrl = '/time-tracker',
    beaconUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/time-tracker`,
    heartbeatSec = 120,
    idleAfterSec = 60,
    maxSecsPerBeat = 300,
    page,
    milestoneId = null,
    userId = null,
    authToken = null,
    onTickSeconds,
    disabled = false,
    maxBeaconBytes = 60000,
  } = opts;

  // ------------ IDs ------------
  const tabIdRef = useRef<string>(getOrSetTabId());
  const sessionIdRef = useRef<string>(getOrSetSessionId());

  function getOrSetTabId() {
    if (typeof window === 'undefined') return null; // SSR: skip

    let id = sessionStorage.getItem('tt.tabId');
    if (!id) {
      id = crypto.randomUUID?.() ?? String(Math.random());
      sessionStorage.setItem('tt.tabId', id);
    }
    return id;
  }
  function getOrSetSessionId() {
    if (typeof window === 'undefined') return null; // SSR: skip
    let id = localStorage.getItem('tt.sessionId');
    if (!id) {
      id = crypto.randomUUID?.() ?? String(Math.random());
      localStorage.setItem('tt.sessionId', id);
    }
    return id;
  }

  // ------------ state/clocks ------------
  const startTs = useRef<number>(Date.now());
  const currentPageMs = useRef<number>(0);
  const lastActivity = useRef<number>(Date.now());
  const active = useRef<boolean>(true);

  // single-active-tab ownership + netlock
  const isOwner = useRef<boolean>(false);
  const OWNER_KEY = 'tt.owner.v3';
  const OWNER_TTL_MS = 5000;
  const NETLOCK_KEY = 'tt.netlock.v2';
  const NETLOCK_TTL_MS = 4000;

  // timers
  const hbTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ownerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // storage keys
  const PAGE_ACC_KEY = 'tt.pageAcc.v1';
  const QUEUE_KEY = 'tt.queue.v1';

  const isVisible = () => document.visibilityState === 'visible';
  const isIdle = () =>
    idleAfterSec > 0 && Date.now() - lastActivity.current > idleAfterSec * 1000;

  // ------------ storage helpers ------------
  const readJSON = <T>(k: string): T | null => {
    try {
      return JSON.parse(localStorage.getItem(k) || 'null');
    } catch {
      return null;
    }
  };
  const writeJSON = (k: string, v: any | null) => {
    try {
      v === null
        ? localStorage.removeItem(k)
        : localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };

  // page accumulators
  const readPageAcc = (): Record<string, number> =>
    readJSON<Record<string, number>>(PAGE_ACC_KEY) || {};
  const writePageAcc = (m: Record<string, number>) => writeJSON(PAGE_ACC_KEY, m);
  const addToPageAcc = (pg: string, secs: number) => {
    if (secs <= 0) return;
    const acc = readPageAcc();
    acc[pg] = (acc[pg] || 0) + secs;
    writePageAcc(acc);
  };

  // queue
  const readQueue = () =>
    readJSON<Array<{ batch: BatchItem[]; meta: any }>>(QUEUE_KEY) || [];
  const writeQueue = (q: Array<{ batch: BatchItem[]; meta: any }>) =>
    writeJSON(QUEUE_KEY, q);
  const enqueueBatch = (batch: BatchItem[]) => {
    if (!batch.length) return;
    const q = readQueue();
    q.push({
      batch,
      meta: { sessionId: sessionIdRef.current, tabId: tabIdRef.current, ts: Date.now() },
    });
    writeQueue(q);
  };

  // owner helpers
  const readOwner = () => readJSON<{ tabId: string; until: number }>(OWNER_KEY);
  const writeOwner = (data: { tabId: string; until: number } | null) =>
    writeJSON(OWNER_KEY, data);
  const tryAcquireOwnership = () => {
    if (!isVisible()) return false;
    const now = Date.now();
    const cur = readOwner();
    if (!cur || cur.until < now || cur.tabId === tabIdRef.current) {
      isOwner.current = true;
      writeOwner({ tabId: tabIdRef.current as string, until: now + OWNER_TTL_MS });
      ensureHeartbeat();
      return true;
    }
    isOwner.current = false;
    stopHeartbeat();
    return false;
  };
  const ownerBeat = () => {
    if (isOwner.current && isVisible())
      writeOwner({ tabId: tabIdRef.current as string, until: Date.now() + OWNER_TTL_MS });
  };
  const releaseOwnership = () => {
    const cur = readOwner();
    if (cur && cur.tabId === tabIdRef.current) writeOwner(null);
    isOwner.current = false;
    stopHeartbeat();
  };

  // net lock
  const readLock = () => readJSON<{ tabId: string; until: number }>(NETLOCK_KEY);
  const writeLock = (data: { tabId: string; until: number } | null) =>
    writeJSON(NETLOCK_KEY, data);
  const acquireNetLock = () => {
    const now = Date.now();
    const cur = readLock();
    if (!cur || cur.until < now) {
      writeLock({ tabId: tabIdRef.current as string, until: now + NETLOCK_TTL_MS });
      return true;
    }
    return cur.tabId === tabIdRef.current;
  };
  const releaseNetLock = () => {
    const cur = readLock();
    if (cur && cur.tabId === tabIdRef.current) writeLock(null);
  };

  // ------------ tick / fold ------------
  const resolvePage = () => page ?? window.location.pathname;
  const tick = () => {
    const now = Date.now();
    const canCount = active.current && isVisible() && !isIdle() && isOwner.current;
    if (canCount) {
      const delta = now - startTs.current;
      currentPageMs.current += delta;
      onTickSeconds?.(Math.floor(currentPageMs.current / 1000));
    }
    startTs.current = now;
  };
  const foldCurrentPageToStore = () => {
    const secs = Math.floor(currentPageMs.current / 1000);
    if (secs > 0) addToPageAcc(resolvePage(), Math.min(secs, maxSecsPerBeat));
    currentPageMs.current = 0;
  };

  // ------------ heartbeat (owner only) ------------
  const ensureHeartbeat = () => {
    if (!isOwner.current) return;
    if (hbTimer.current) return;
    const jitter = Math.floor(Math.random() * 5000);
    const start = () => {
      hbTimer.current = setInterval(async () => {
        tick();
        foldCurrentPageToStore();
        await sendAllPagesBatch();
      }, heartbeatSec * 1000);
    };
    setTimeout(start, jitter);
  };
  const stopHeartbeat = () => {
    if (hbTimer.current) {
      clearInterval(hbTimer.current);
      hbTimer.current = null;
    }
  };

  const mergeByPage = (arr: BatchItem[]) => {
    const map = new Map<string, number>();
    const lessons = new Map<string, string | null>();
    for (const it of arr) {
      map.set(it.page, (map.get(it.page) || 0) + it.seconds);
      if (!lessons.has(it.page) && it.milestoneId !== undefined)
        lessons.set(it.page, it.milestoneId ?? null);
    }
    return Array.from(map.entries()).map(([pg, secs]) => ({
      page: pg,
      milestoneId: lessons.get(pg) ?? null,
      seconds: secs,
    }));
  };

  const buildBatchFromStore = (): BatchItem[] => {
    const acc = readPageAcc();
    return Object.entries(acc)
      .map(([pg, secs]) => ({
        page: pg,
        milestoneId: pg === resolvePage() ? milestoneId : null,
        seconds: Math.floor(secs),
      }))
      .filter((it) => it.seconds > 0);
  };

  const sendAllPagesBatch = async () => {
    if (!isOwner.current || !navigator.onLine) return;
    if (!acquireNetLock()) return;
    try {
      const accBatch = buildBatchFromStore();
      const queued = readQueue()
        .map((x) => x.batch)
        .flat();
      const all = mergeByPage([...accBatch, ...queued]);
      if (!all.length) return;

      await addTimeTracker({
        batch: all,
        userId,
        sessionId: sessionIdRef.current,
        tabId: tabIdRef.current,
        authToken: authToken ?? undefined,
      });

      writePageAcc({});
      writeQueue([]);
    } catch {
      const batch = buildBatchFromStore();
      if (batch.length) enqueueBatch(batch);
    } finally {
      releaseNetLock();
    }
  };

  // ------------ helpers for beacon ------------
  const toAbsoluteUrl = (u?: string) => {
    if (!u) return undefined;
    try {
      // absolute?
      // eslint-disable-next-line no-new
      new URL(u);
      return u;
    } catch {
      return `${window.location.origin}${u.startsWith('/') ? '' : '/'}${u}`;
    }
  };

  const chunkAndSend = (payloadObj: any) => {
    const url = toAbsoluteUrl(beaconUrl ?? apiUrl); // IMPORTANT
    if (!url) return;

    const sendOne = (obj: any) => {
      const json = JSON.stringify(obj);
      // Use text/plain to avoid preflight during unload
      const blob = new Blob([json], { type: 'text/plain;charset=UTF-8' });

      let sent = false;
      if ('sendBeacon' in navigator) {
        try {
          sent = navigator.sendBeacon(url, blob);
        } catch {
          /* ignore */
        }
      }
      if (!sent) {
        try {
          void fetch(url, {
            method: 'POST',
            body: json,
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            keepalive: true,
            credentials: 'include', // same-origin cookies only
          });
          sent = true;
        } catch {
          /* ignore */
        }
      }
      return sent;
    };

    // size guard
    const jsonStr = JSON.stringify(payloadObj);
    if (new TextEncoder().encode(jsonStr).length <= maxBeaconBytes) {
      return sendOne(payloadObj);
    }

    // chunk batches if too large
    const items: BatchItem[] = payloadObj.batch ?? [];
    let idx = 0;
    while (idx < items.length) {
      const chunk: BatchItem[] = [];
      // grow until near the byte limit
      while (idx < items.length) {
        chunk.push(items[idx]);
        const test = JSON.stringify({ ...payloadObj, batch: chunk });
        if (new TextEncoder().encode(test).length > maxBeaconBytes) {
          chunk.pop();
          break;
        }
        idx++;
      }
      if (!chunk.length) break;
      sendOne({ ...payloadObj, batch: chunk, part: true });
    }
    return true;
  };

  // ------------ final flush on exit/reload ------------
  const finalFlushOnClose = () => {
    tick();
    foldCurrentPageToStore();

    const batch: BatchItem[] = buildBatchFromStore();
    if (!batch.length) return;

    const payload = {
      batch,
      userId,
      sessionId: sessionIdRef.current,
      tabId: tabIdRef.current,
      authToken: authToken ?? undefined,
      ts: Date.now(),
      source: 'beacon',
    };

    const ok = chunkAndSend(payload);

    if (ok) {
      // optimistic clear
      writePageAcc({});
      writeQueue([]);
    } else {
      enqueueBatch(batch);
    }
  };

  // ------------ effects ------------
  useEffect(() => {
    if (disabled) return;

    const act = () => {
      lastActivity.current = Date.now();
    };
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, act, { passive: true }),
    );

    tryAcquireOwnership();
    ownerTimer.current = setInterval(ownerBeat, 3000);

    const onVis = () => {
      if (isVisible()) {
        tryAcquireOwnership();
        active.current = true;
        startTs.current = Date.now();
      } else {
        tick();
        foldCurrentPageToStore();
        active.current = false;
        releaseOwnership();
        finalFlushOnClose(); // send immediately on hidden
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const onOnline = () => {
      void sendAllPagesBatch();
    };
    window.addEventListener('online', onOnline);

    // multiple safety nets on exit/reload
    window.addEventListener('pagehide', finalFlushOnClose, { capture: true });
    window.addEventListener('beforeunload', finalFlushOnClose, { capture: true });
    window.addEventListener('unload', finalFlushOnClose, { capture: true });

    return () => {
      ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, act),
      );
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('pagehide', finalFlushOnClose);
      window.removeEventListener('beforeunload', finalFlushOnClose);
      window.removeEventListener('unload', finalFlushOnClose);

      // persist to local only
      tick();
      foldCurrentPageToStore();

      if (hbTimer.current) clearInterval(hbTimer.current);
      if (ownerTimer.current) clearInterval(ownerTimer.current);
      releaseOwnership();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    apiUrl,
    beaconUrl,
    heartbeatSec,
    idleAfterSec,
    maxSecsPerBeat,
    page,
    milestoneId,
    userId,
    authToken,
    disabled,
    maxBeaconBytes,
  ]);
}

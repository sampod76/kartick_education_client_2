/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';

type BatchItem = { page: string; milestoneId?: string | null; seconds: number };

type Opts = {
  apiUrl?: string; // default: /api/save-time
  heartbeatSec?: number; // default: 120
  idleAfterSec?: number; // default: 60
  maxSecsPerBeat?: number; // per-beat cap per page, default: 300
  page?: string; // current pathname (e.g., usePathname())

  milestoneId?: string | null;
  userId?: string | null; // dev fallback if cookie missing
  onTickSeconds?: (s: number) => void; // seconds on current page (for UI)
  disabled: boolean;
};

export function useTimeTracker(opts: Opts = { disabled: false }) {
  const {
    apiUrl = '/api/save-time',
    heartbeatSec = 120,
    idleAfterSec = 60,
    maxSecsPerBeat = 300,
    page,
    milestoneId = null,
    userId = null,
    onTickSeconds,
  } = opts;

  // ------------ IDs ------------
  const tabIdRef = useRef<string>(getOrSetTabId());
  const sessionIdRef = useRef<string>(getOrSetSessionId());

  function getOrSetTabId() {
    let id = sessionStorage.getItem('tt.tabId');
    if (!id) {
      id = crypto.randomUUID?.() ?? String(Math.random());
      sessionStorage.setItem('tt.tabId', id);
    }
    return id;
  }
  function getOrSetSessionId() {
    let id = localStorage.getItem('tt.sessionId');
    if (!id) {
      id = crypto.randomUUID?.() ?? String(Math.random());
      localStorage.setItem('tt.sessionId', id);
    }
    return id;
  }

  // ------------ state/clocks ------------
  const startTs = useRef<number>(Date.now());
  const currentPageMs = useRef<number>(0); // শুধুমাত্র current পেজের accumulator (UI/debug)
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
  const PAGE_ACC_KEY = 'tt.pageAcc.v1'; // { [page]: seconds }
  const QUEUE_KEY = 'tt.queue.v1'; // queued batches: Array<{ batch: BatchItem[], meta... }>

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
      writeOwner({ tabId: tabIdRef.current, until: now + OWNER_TTL_MS });
      ensureHeartbeat();
      return true;
    }
    isOwner.current = false;
    stopHeartbeat();
    return false;
  };
  const ownerBeat = () => {
    if (isOwner.current && isVisible())
      writeOwner({ tabId: tabIdRef.current, until: Date.now() + OWNER_TTL_MS });
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
      writeLock({ tabId: tabIdRef.current, until: now + NETLOCK_TTL_MS });
      return true;
    }
    return cur.tabId === tabIdRef.current;
  };
  const releaseNetLock = () => {
    const cur = readLock();
    if (cur && cur.tabId === tabIdRef.current) writeLock(null);
  };

  // ------------ tick: শুধু লোকালি জমা ------------
  const tick = () => {
    const now = Date.now();
    const canCount = active.current && isVisible() && !isIdle() && isOwner.current;
    if (canCount) {
      const delta = now - startTs.current;
      currentPageMs.current += delta; // UI/debug
      onTickSeconds?.(Math.floor(currentPageMs.current / 1000));
    }
    startTs.current = now;
  };

  // current page accumulator → pageAcc store এ যোগ
  const foldCurrentPageToStore = () => {
    const secs = Math.floor(currentPageMs.current / 1000);
    if (secs > 0) addToPageAcc(resolvePage(), Math.min(secs, maxSecsPerBeat));
    currentPageMs.current = 0;
  };
  const resolvePage = () => page ?? window.location.pathname;

  // ------------ heartbeat: batch send (owner only) ------------
  const ensureHeartbeat = () => {
    if (!isOwner.current) return;
    if (hbTimer.current) return;
    const jitter = Math.floor(Math.random() * 5000);
    const start = () => {
      hbTimer.current = setInterval(async () => {
        // প্রতি বিটে: টিক + current পেজের জমা লোকালি যোগ + সব পেজ ব্যাচ সেন্ড
        tick();
        foldCurrentPageToStore(); // শুধু লোকাল স্টোরে যোগ, সাথে সাথে API না
        await sendAllPagesBatch(); // owner হলে কেবল API কল
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

  // সব পেজের ব্যাচ বানিয়ে পাঠানো
  const sendAllPagesBatch = async () => {
    if (!isOwner.current || !navigator.onLine) return;

    // queue-তে পুরনো থাকলে আগে পাঠানোর চেষ্টা (merge আগেই হয়েছে ধরে নিচ্ছি)
    if (!acquireNetLock()) return;
    try {
      // build batch from pageAcc store
      const acc = readPageAcc();
      const batch: BatchItem[] = Object.entries(acc)
        .map(([pg, secs]) => ({
          page: pg,
          milestoneId: pg === resolvePage() ? milestoneId : null,
          seconds: Math.floor(secs),
        }))
        .filter((it) => it.seconds > 0);

      // কিউতে পুরনো থাকলে merge করে একসাথে পাঠানো
      const q = readQueue();
      const queuedBatches = q.map((x) => x.batch).flat();
      const all = mergeByPage([...batch, ...queuedBatches]);

      if (!all.length) return;
      console.log({
        batch: all,
        userId, // dev fallback
        sessionId: sessionIdRef.current,
        tabId: tabIdRef.current,
      });
      // POST one batch payload
      await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiUrl}`
          : apiUrl,
        {
          batch: all,
          userId, // dev fallback
          sessionId: sessionIdRef.current,
          tabId: tabIdRef.current,
        },
        { withCredentials: true },
      );

      // success হলে pageAcc থেকে শূন্য করা + queue ক্লিয়ার
      writePageAcc({});
      writeQueue([]);
    } catch {
      // ব্যর্থ হলে: বর্তমান batch কিউতে ঢোকাও (merge করে)
      const acc = readPageAcc();
      const batch: BatchItem[] = Object.entries(acc)
        .map(([pg, secs]) => ({
          page: pg,
          milestoneId: pg === resolvePage() ? milestoneId : null,
          seconds: Math.floor(secs),
        }))
        .filter((it) => it.seconds > 0);
      if (batch.length) {
        const q = readQueue();
        q.push({
          batch,
          meta: {
            sessionId: sessionIdRef.current,
            tabId: tabIdRef.current,
            ts: Date.now(),
          },
        });
        writeQueue(q);
      }
    } finally {
      releaseNetLock();
    }
  };

  // helper: merge same page entries
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

  // ------------ immediate flush on close ONLY ------------
  const finalFlushOnClose = () => {
    // ১) বর্তমান পেজের জমা লোকাল স্টোরে যোগ
    tick();
    foldCurrentPageToStore();

    // ২) batch payload বানাও
    const acc = readPageAcc();
    const batch: BatchItem[] = Object.entries(acc)
      .map(([pg, secs]) => ({
        page: pg,
        milestoneId: pg === resolvePage() ? milestoneId : null,
        seconds: Math.floor(secs),
      }))
      .filter((it) => it.seconds > 0);
    if (!batch.length) return;

    // ৩) sendBeacon ট্রাই (owner হলে); না হলে কিউ
    const payload = JSON.stringify({
      batch,
      userId,
      sessionId: sessionIdRef.current,
      tabId: tabIdRef.current,
    });
    const blob = new Blob([payload], { type: 'application/json' });
    const url = process.env.NEXT_PUBLIC_API_BASE
      ? `${process.env.NEXT_PUBLIC_API_BASE}${apiUrl}`
      : apiUrl;

    if (isOwner.current && 'sendBeacon' in navigator) {
      const ok = navigator.sendBeacon(url, blob);
      if (ok) {
        // সাকসেস হলে লোকাল মেমরি শূন্য
        writePageAcc({});
        writeQueue([]);
      } else {
        enqueueBatch(batch);
      }
    } else {
      enqueueBatch(batch);
    }
  };

  // ------------ effects ------------
  useEffect(() => {
    if (opts.disabled) {
      return; // হুক কিছুই করবে না
    }
    // user activity
    const act = () => {
      lastActivity.current = Date.now();
    };
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, act, { passive: true }),
    );

    // ownership init + keep alive
    tryAcquireOwnership();
    ownerTimer.current = setInterval(ownerBeat, 3000);

    // visibility:
    // - visible: শুধু owner নেওয়ার চেষ্টা + হার্টবিট চালু + কোনো API কল না
    // - hidden: শুধু current page accumulator লোকাল স্টোরে যোগ; **API কল না**
    const onVis = () => {
      if (isVisible()) {
        tryAcquireOwnership();
        active.current = true;
        startTs.current = Date.now();
        // NO immediate tryFlushQueue here
      } else {
        tick();
        foldCurrentPageToStore(); // শুধু লোকালি সেভ
        active.current = false;
        // owner ছাড়ুন যাতে অন্য visible ট্যাব নিতে পারে
        releaseOwnership();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    // online হলে owner হলে ব্যাচ সেন্ড
    const onOnline = () => {
      sendAllPagesBatch();
    };
    window.addEventListener('online', onOnline);

    // close/tab leave → একবার batch try (sendBeacon/queue)
    window.addEventListener('pagehide', finalFlushOnClose, { capture: true });
    window.addEventListener('beforeunload', finalFlushOnClose, { capture: true });

    // NOTE: প্রথমে কোনো তাত্ক্ষণিক API কল নেই; শুধু heartbeat অপেক্ষা করবে

    return () => {
      ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach((ev) =>
        window.removeEventListener(ev, act),
      );
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('pagehide', finalFlushOnClose);
      window.removeEventListener('beforeunload', finalFlushOnClose);

      // unmount এও **কোনো API কল না** — শুধু লোকাল স্টোরে current page সেভ করলে চাইলে:
      tick();
      foldCurrentPageToStore();

      if (hbTimer.current) clearInterval(hbTimer.current);
      if (ownerTimer.current) clearInterval(ownerTimer.current);
      releaseOwnership();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, heartbeatSec, idleAfterSec, maxSecsPerBeat, page, milestoneId, userId]);
}

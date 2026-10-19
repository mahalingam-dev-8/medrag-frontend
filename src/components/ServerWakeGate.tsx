import { useEffect, useState, type ReactNode } from 'react';
import { env } from '@/config/env';

const HEALTH_URL = `${env.apiUrl}/health`;
const POLL_INTERVAL_MS = 3000;
const REQUEST_TIMEOUT_MS = 10_000;
// A server that is already awake answers well within this, so the screen never flashes.
const SHOW_SCREEN_AFTER_MS = 800;
const GIVE_UP_AFTER_MS = 180_000;
// Typical free-tier cold start, used only to pace the progress bar.
const EXPECTED_WAKE_SECONDS = 60;

type Status = 'checking' | 'waking' | 'ready' | 'failed';

async function isHealthy(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(HEALTH_URL, { signal: controller.signal, cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Holds the app back until the backend responds. The API runs on a free host that sleeps when
 * idle and takes up to a minute to wake, so the first visit gets a progress screen instead of
 * failing requests.
 */
export function ServerWakeGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('checking');
  const [elapsed, setElapsed] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();
    const showScreen = setTimeout(
      () => setStatus(s => (s === 'checking' ? 'waking' : s)),
      SHOW_SCREEN_AFTER_MS,
    );
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    const stopTimers = () => {
      clearTimeout(showScreen);
      clearInterval(tick);
    };

    const poll = async () => {
      while (!cancelled) {
        if (await isHealthy()) {
          stopTimers();
          if (!cancelled) setStatus('ready');
          return;
        }
        if (Date.now() - started > GIVE_UP_AFTER_MS) {
          stopTimers();
          if (!cancelled) setStatus('failed');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    };
    poll();

    return () => {
      cancelled = true;
      stopTimers();
    };
  }, [attempt]);

  if (status === 'ready') return <>{children}</>;
  if (status === 'checking') return null;

  if (status === 'failed') {
    return (
      <div className="flex h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-900">The server didn&apos;t respond</h1>
          <p className="mt-2 text-sm text-gray-600">
            It may still be starting or temporarily unavailable. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => {
              setElapsed(0);
              setStatus('waking');
              setAttempt(a => a + 1);
            }}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.min(95, (elapsed / EXPECTED_WAKE_SECONDS) * 100);

  return (
    <div className="flex h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <h1 className="mt-6 text-xl font-semibold text-gray-900">Waking up the server…</h1>
        <p className="mt-2 text-sm text-gray-600">
          MedRAG runs on a server that sleeps when idle. The first visit takes about 30–60 seconds,
          and the app opens automatically when it&apos;s ready.
        </p>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {elapsed < 90 ? `${elapsed}s` : `${elapsed}s · still starting, almost there`}
        </p>
      </div>
    </div>
  );
}

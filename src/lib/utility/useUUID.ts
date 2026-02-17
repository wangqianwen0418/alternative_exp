import { useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { uuidAtom } from 'app/atoms';
import { getCookieString, setCookieString } from 'lib/utility/cookies';

/**
 * lib/utility/useUUID
 *
 * React hook for establishing a stable, anonymous UUID for the current browser.
 *
 * The UUID is persisted in a cookie (`uuid`) and also written into global Jotai
 * state so other parts of the app (e.g. logging) can reference it.
 */

/**
 * Returns the persisted UUID from cookies, creating it if missing.
 *
 * Returns `null` in non-browser environments.
 */
function getOrCreateUUIDFromCookie(): string | null {
  // Prefer an existing identifier to keep the session stable across reloads.
  const existing = getCookieString('uuid');
  if (existing) return existing;

  if (typeof document === 'undefined') return null;

  const created = uuidv4();
  setCookieString('uuid', created);
  return created;
}

/**
 * Hook that provides the current UUID and ensures `uuidAtom` is populated.
 */
export function useUUID(): string | null {
  // Store the UUID in global state for components that don't read cookies.
  const [, setUUID] = useAtom(uuidAtom);

  const uuid = useMemo(() => getOrCreateUUIDFromCookie(), []);

  useEffect(() => {
    if (uuid) {
      setUUID(uuid);
    }
  }, [setUUID, uuid]);

  return uuid;
}

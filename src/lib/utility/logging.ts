import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { uuidAtom } from 'app/atoms';
import { postJson } from 'lib/utility/postJson';

/**
 * lib/utility/logging
 *
 * Lightweight client-side event logging.
 *
 * Events are POSTed to a Google Apps Script endpoint configured via
 * `WEBURL_ENDPOINT`. The hook `useLogging()` binds the current user/session UUID
 * (stored in Jotai state) into each payload.
 */

export type LogEventPayload = {
  uuid: string;
  timestamp: string;
  log_type: string;
  description: string;
  second_graph_type?: string;
};

type LoggerOptions = {
  endpoint?: string;
  silent?: boolean;
};

export async function logEvent(
  payload: LogEventPayload,
  opts: LoggerOptions = {},
): Promise<void> {
  // Allow overriding the endpoint in tests; default to env-based config.
  await postJson(payload, { endpoint: opts.endpoint, silent: opts.silent });
}

export function useLogging() {
  // Pull the session/user identifier from global state.
  const uuid = useAtomValue(uuidAtom);

  // Memoize the returned logger so its identity is stable across renders.
  return useCallback(
    async (
      logType: string,
      description: string,
      second_graph_type?: string,
    ) => {
      // Each call constructs a timestamped payload and fire-and-forgets the POST.
      // If we haven't established a UUID yet, skip logging.
      if (!uuid) return;

      const payload: LogEventPayload = {
        uuid,
        timestamp: new Date().toLocaleString(),
        log_type: logType,
        description,
        second_graph_type: second_graph_type ?? 'N/A',
      };

      await logEvent(payload);
    },
    [uuid],
  );
}

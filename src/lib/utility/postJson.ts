import { WEBURL_ENDPOINT } from 'lib/config';

/**
 * lib/utility/postJson
 *
 * Shared, SSR-safe JSON POST helper.
 *
 * Several parts of the app send JSON payloads to the same Google Apps Script
 * endpoint configured via `WEBURL_ENDPOINT`. Centralizing that logic keeps the
 * request shape consistent and prevents duplicated `fetch` boilerplate.
 */

type PostJsonOptions = {
  endpoint?: string;
  /** If true, suppress console error logging on network failures. */
  silent?: boolean;
};

export async function postJson(
  payload: unknown,
  opts: PostJsonOptions = {},
): Promise<void> {
  const endpoint = opts.endpoint ?? WEBURL_ENDPOINT;
  if (!endpoint) return;

  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    if (!opts.silent) {
      console.error('POST failed:', err);
    }
  }
}

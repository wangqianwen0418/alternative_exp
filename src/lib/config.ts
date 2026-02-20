/**
 * lib/config
 *
 * Centralized configuration values for the client application.
 *
 * Notes:
 * - Values are read from build-time environment variables (e.g. CRA-style
 *   `REACT_APP_*` variables).
 * - `WEBURL_ENDPOINT` selects between dev/prod endpoints based on `NODE_ENV`.
 */

const isProd = process.env.NODE_ENV === 'production';

// Google Apps Script endpoints
export const DEV_WEBURL_ENDPOINT = process.env.REACT_APP_DEV_WEBURL_ENDPOINT;
export const PROD_WEBURL_ENDPOINT = process.env.REACT_APP_PROD_WEBURL_ENDPOINT;

// Select endpoint based on environment
export const WEBURL_ENDPOINT = isProd
  ? PROD_WEBURL_ENDPOINT
  : DEV_WEBURL_ENDPOINT;

// OpenAI config
export const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
export const OPENAI_MODEL = process.env.REACT_APP_OPENAI_MODEL;

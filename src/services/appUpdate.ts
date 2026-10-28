/**
 * Force-update check against Firebase Realtime Database.
 *
 * Firebase project: bhagavad-gita-hindi-shlok
 * Node: /kickcounter
 *   appVersion  "2.0.1"                          <- latest version (store as a STRING)
 *   appURL      "https://play.google.com/..."    <- opened by the "Update Now" button
 *   message     (optional) text shown in the modal
 *   forceUpdate (optional) set to false to switch the check off
 *
 * Only a successful read of a valid version can lock the app. If Firebase is
 * unreachable or the data is malformed, the app opens normally.
 */
import { getApp, getApps } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import { isValidStoreUrl, parseVersion } from '../utils/appVersion';

const DATABASE_URL = 'https://bhagavad-gita-hindi-shlok-default-rtdb.firebaseio.com';
const PATH = 'kickcounter';
const DEFAULT_MESSAGE = 'A new version of Kick Counter is available. Please update the app to continue.';

export type RequiredAppVersion = {
  requiredVersion: string | null;
  storeUrl: string | null;
  message: string;
  enabled: boolean;
};

const toVersion = (v: unknown): string | null => {
  const text = typeof v === 'string' ? v.trim() : typeof v === 'number' && Number.isFinite(v) ? String(v) : null;
  return text && parseVersion(text) ? text : null;
};

export function parseConfig(raw: unknown): RequiredAppVersion {
  const d = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const message = typeof d.message === 'string' ? d.message.trim() : '';
  return {
    requiredVersion: toVersion(d.appVersion),
    storeUrl: isValidStoreUrl(d.appURL) ? d.appURL.trim() : null,
    message: message || DEFAULT_MESSAGE,
    enabled: d.forceUpdate !== false,
  };
}

/** Live subscription to /appVersion; returns the unsubscribe function. */
export function subscribeAppVersion(
  onConfig: (config: RequiredAppVersion) => void,
  onError: (error: Error) => void,
): () => void {
  if (getApps().length === 0) return () => {};
  return onValue(
    ref(getDatabase(getApp(), DATABASE_URL), PATH),
    snap => onConfig(parseConfig(snap.val())),
    onError,
  );
}

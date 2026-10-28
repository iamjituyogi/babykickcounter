import AsyncStorage from '@react-native-async-storage/async-storage';

export type Session = {
  id: string;
  date: string; // ISO date of first kick
  first: number; // epoch ms
  last: number; // epoch ms
  count: number;
};

const KEY = 'kick_sessions_json';

export async function loadSessions(): Promise<Session[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

export async function saveSession(s: Session): Promise<Session[]> {
  const all = await loadSessions();
  const next = [s, ...all];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function clearSessions() {
  await AsyncStorage.removeItem(KEY);
}

const pad = (n: number) => String(n).padStart(2, '0');
export const fmtTime = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const fmtDate = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const fmtPeriod = (from: number, to: number) => {
  const mins = Math.max(0, Math.floor((to - from) / 60000));
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

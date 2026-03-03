let accessToken: string | null = null;
const listeners = new Set<(token: string | null) => void>();

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  listeners.forEach(listener => listener(token));
};

export const getAccessToken = () => {
  return accessToken;
};

export const subscribeToToken = (listener: (token: string | null) => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

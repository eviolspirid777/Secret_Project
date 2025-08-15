export const localStorageService = {
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  getToken: (): string | null => {
    return localStorage.getItem("sessionToken");
  },
  setToken: (token: string) => {
    localStorage.setItem("sessionToken", token);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  getUserId: (): string => {
    return localStorage.getItem("userId")!;
  },
  setUserId: (userId: string) => {
    localStorage.setItem("userId", userId);
  },
  removeUserId: () => {
    localStorage.removeItem("userId");
  },
  clear: () => {
    localStorage.clear();
  },
};

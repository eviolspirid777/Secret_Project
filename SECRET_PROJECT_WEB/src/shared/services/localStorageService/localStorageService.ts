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
  getUserId: (): string | null => {
    return localStorage.getItem("userId");
  },
  setUserId: (userId: string) => {
    localStorage.setItem("userId", userId);
  },
  clear: () => {
    localStorage.clear();
  },
};

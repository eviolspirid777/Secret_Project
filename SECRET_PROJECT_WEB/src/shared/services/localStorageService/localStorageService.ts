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
  clear: () => {
    localStorage.clear();
  },
};

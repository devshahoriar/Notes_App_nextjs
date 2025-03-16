// Simple in-memory token store
let accessToken: string | null = null;

export const tokenStore = {
  setToken: (token: string) => {
    accessToken = token;
  },
  
  getToken: (): string | null => {
    return accessToken;
  },
  
  clearToken: () => {
    accessToken = null;
  },
  
  hasToken: (): boolean => {
    return accessToken !== null;
  }
};

import { create } from "zustand";

const ACCOUNT_SESSION_KEY = "beauty-prive-account-session";
const ACCOUNT_PERSISTED_KEY = "beauty-prive-account-persisted";

export interface AccountInfo {
  phone: string;
  firstName: string;
  lastName: string;
}

function getStored(key: string): AccountInfo | null {
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as AccountInfo;
    if (data.phone && data.firstName && data.lastName) return data;
    return null;
  } catch {
    return null;
  }
}

function setStored(key: string, data: AccountInfo, persist: boolean): void {
  try {
    const json = JSON.stringify(data);
    sessionStorage.setItem(ACCOUNT_SESSION_KEY, json);
    if (persist) localStorage.setItem(ACCOUNT_PERSISTED_KEY, json);
    else localStorage.removeItem(ACCOUNT_PERSISTED_KEY);
  } catch {
    // ignore
  }
}

function clearStored(): void {
  try {
    sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
    localStorage.removeItem(ACCOUNT_PERSISTED_KEY);
  } catch {
    // ignore
  }
}

/** Lit la session courante : sessionStorage d’abord, puis localStorage (mémoire de connexion). */
function loadAccount(): AccountInfo | null {
  return getStored(ACCOUNT_SESSION_KEY) ?? getStored(ACCOUNT_PERSISTED_KEY);
}

interface AccountState {
  account: AccountInfo | null;
  isLoggedIn: boolean;
  hasHydrated: boolean;
  setAccount: (phone: string, firstName: string, lastName: string, rememberMe: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAccount = create<AccountState>((set) => ({
  account: null,
  isLoggedIn: false,
  hasHydrated: false,

  setAccount: (phone, firstName, lastName, rememberMe) => {
    const account: AccountInfo = { phone, firstName, lastName };
    setStored(ACCOUNT_SESSION_KEY, account, rememberMe);
    if (rememberMe) setStored(ACCOUNT_PERSISTED_KEY, account, true);
    set({ account, isLoggedIn: true });
  },

  logout: () => {
    clearStored();
    set({ account: null, isLoggedIn: false });
  },

  hydrate: () => {
    const account = loadAccount();
    set({ account, isLoggedIn: !!account, hasHydrated: true });
  },
}));

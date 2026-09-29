import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(undefined); // undefined = "checking", null = "logged out"

  async function refresh() {
    try {
      const data = await api.adminMe();
      setAdmin(data);
    } catch {
      setAdmin(null);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(email, password) {
    const data = await api.adminLogin({ email, password });
    setAdmin(data);
    return data;
  }

  async function logout() {
    await api.adminLogout().catch(() => {});
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, refresh }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}

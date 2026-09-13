import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch("/admin/auth/me");
        setAdmin(data.data?.admin || null);
      } catch {
        localStorage.removeItem("adminToken");
        setToken("");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiFetch("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const nextToken = data.data?.token;
    const nextAdmin = data.data?.admin;

    if (!nextToken) {
      throw new Error("Login failed");
    }

    localStorage.setItem("adminToken", nextToken);
    setToken(nextToken);
    setAdmin(nextAdmin);
    return nextAdmin;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setAdmin(null);
  };

  const value = useMemo(() => ({ admin, token, loading, login, logout }), [admin, token, loading]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => useContext(AdminAuthContext);

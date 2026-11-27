'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdminSession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session', { cache: 'no-store' });
      const data = await response.json();
      setAdmin(response.ok ? data.admin : null);
      return response.ok ? data.admin : null;
    } catch (error) {
      console.error('Admin session refresh failed:', error);
      setAdmin(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => refreshAdminSession());
  }, [refreshAdminSession]);

  const logoutAdmin = useCallback(async () => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE' });
    } finally {
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({ admin, isLoading, refreshAdminSession, logoutAdmin }),
    [admin, isLoading, refreshAdminSession, logoutAdmin]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}

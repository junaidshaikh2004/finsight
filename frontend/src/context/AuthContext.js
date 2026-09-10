'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signup(name, email, password) {
    const data = await apiFetch('/api/auth/signup', { method: 'POST', body: { name, email, password } });
    setUser(data.user);
    return data.user;
  }

  async function login(email, password) {
    const data = await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

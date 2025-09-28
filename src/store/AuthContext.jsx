import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DB } from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const db = DB.get();
    const u = db.users.find((x) => x.id === db.session.userId) || null;
    setUser(u);
  }, []);

  const login = (email, password) => {
    const db = DB.get();
    const u = db.users.find((x) => x.email === email && x.password === password);
    if (!u) throw new Error('Invalid credentials');
    DB.set((d) => ({ ...d, session: { ...d.session, userId: u.id } }));
    setUser(u);
    return u;
  };

  const logout = () => {
    DB.set((d) => ({ ...d, session: { ...d.session, userId: null } }));
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthed: !!user,
    login,
    logout,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

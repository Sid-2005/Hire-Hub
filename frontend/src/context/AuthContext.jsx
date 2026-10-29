import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hirehub_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.sub,
            role: decoded.role,
            token,
          });
        } else {
          localStorage.removeItem('hirehub_token');
        }
      } catch {
        localStorage.removeItem('hirehub_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('hirehub_token', token);
    try {
      const decoded = jwtDecode(token);
      setUser({ username: decoded.sub, role: decoded.role, token });
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('hirehub_token');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

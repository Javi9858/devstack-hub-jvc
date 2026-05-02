import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al iniciar sesión' };
    }
  };

  const register = async (email, password, role) => {
    try {
      await api.post('/auth/register', { email, password, role });
      return await login(email, password);
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al registrar' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateLocalUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateLocalUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

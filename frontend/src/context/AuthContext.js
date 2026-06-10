import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('taskflow_user')) || null,
  token: localStorage.getItem('taskflow_token') || null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('taskflow_token', action.payload.token);
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'LOGOUT':
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'UPDATE_USER':
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('taskflow_token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        dispatch({ type: 'UPDATE_USER', payload: data.user });
      } catch {
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    verifyToken();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed.';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authAPI.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

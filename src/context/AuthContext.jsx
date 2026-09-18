'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBase } from '@/utils/apiConfig';

const AuthContext = createContext(null);

const API_BASE = getApiBase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on initial mount
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Authentication check error (backend may be offline):', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const error = new Error(data.message || 'Login failed. Please try again.');
        error.status = res.status;
        error.data = data;
        throw error;
      }

      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const error = new Error(data.message || 'Registration failed. Please try again.');
        error.status = res.status;
        error.data = data;
        throw error;
      }

      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  // Direct user update helper
  const updateUser = (updatedUserData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUserData } : updatedUserData));
  };

  // Toggle favorite property helper
  const toggleFavorite = async (propertyId, propertyData = null) => {
    if (!user) {
      return { success: false, requireAuth: true, message: 'Veuillez vous connecter pour enregistrer vos favoris.' };
    }

    try {
      const res = await fetch(`${API_BASE}/api/dashboard/favorites/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ propertyData })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            favorites: data.favorites || []
          };
        });
        return { success: true, isFavorite: data.isFavorite, favorites: data.favorites, effectiveId: data.effectiveId };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('toggleFavorite error:', err);
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkUserLoggedIn,
        toggleFavorite,
        API_BASE
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

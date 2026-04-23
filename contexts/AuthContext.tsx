'use client';
import React, { createContext, useState, useContext } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (token: string, user: User) => {
    const expires = new Date(Date.now() + 60000 * 100000); // 30 days depends on the application and backend
    setCookie('token', token, { expires, path: '/' });
    setCookie('user', JSON.stringify(user), { expires, path: '/' });
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = async () => {
    deleteCookie('token');
    deleteCookie('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/auth/login'); // Can be modified to the project's auth path
  };

  const updateUser = (user: User) => {
    setUser(user);
    setCookie('user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

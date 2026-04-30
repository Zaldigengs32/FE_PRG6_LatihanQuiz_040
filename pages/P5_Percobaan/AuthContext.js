import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (data) => {
    setUserData({
      nim_mhs: data.mhsNim,
      nama: data.mhsName,
      prodi: data.prodi
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ userData, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

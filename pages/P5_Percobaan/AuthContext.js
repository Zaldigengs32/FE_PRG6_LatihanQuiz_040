import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData] = useState({
    nim_mhs: "0320240040",
    nama: "Muhamad Zaldi Aprialdi"
  });

  return (
    <AuthContext.Provider value={{ userData }}>
      {children}
    </AuthContext.Provider>
  );
};

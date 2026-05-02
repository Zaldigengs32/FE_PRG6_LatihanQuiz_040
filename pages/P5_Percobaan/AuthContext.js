import { createContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((data) => {
    setUserData({
      nim_mhs: data.mhsNim,
      nama: data.mhsName,
      prodi: data.prodi
    });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUserData(null);
    setIsAuthenticated(false);
  }, []);

  const contextValue = useMemo(
    () => ({ userData, isAuthenticated, login, logout }),
    [userData, isAuthenticated, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

import { createContext, useContext, useEffect, useState } from "react";
import { meAPI } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await meAPI();
      setUser(res.data.data);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.getItem("token")) {
        loadUser();
      } else {
        setLoading(false);
        setUser(null);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    };

    // Initial load
    handleStorageChange();

    // Listen for changes in localStorage (e.g. from DevTools or other tabs)
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

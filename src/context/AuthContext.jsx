import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // const data = await api.post("/auth/login", { username, password });
    const userData = {
      id: "1",
      username: "username",
    };
    setUser(userData);
    localStorage.setItem("admin_user", JSON.stringify(userData));
    console.log(localStorage.getItem("admin_user"));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get<any>("/api/me");
        setUser(res.data.user);
      } catch (error: any) {
        // Token geçersizse localStorage'dan sil
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          console.error("Auth check error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post<any>("/api/login", { username, password });
    localStorage.setItem("token", res.data.token);

    // Token sonrası kullanıcıyı tekrar al
    const meRes = await axios.get<any>("/api/me");
    setUser(meRes.data.user);
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      // Logout hatası olsa bile kullanıcıyı çıkış yap
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/admin/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

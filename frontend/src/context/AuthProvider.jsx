import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    await fetchProfile();
  };

  const logout = async () => {
    const token = localStorage.getItem("refreshToken");

    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    localStorage.clear();
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const data = await api("/user/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

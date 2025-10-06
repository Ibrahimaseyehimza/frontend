import { useState } from "react";
import api from "../api/axios";

export default function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const { data } = await api.post("/login", credentials);
    localStorage.setItem("authToken", data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/register", payload);
    localStorage.setItem("authToken", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("/logout");
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return { user, login, register, logout };
}

// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      navigate("/admin"); // Giriş başarılıysa admin anasayfaya yönlendir
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 mt-20 border rounded shadow">
      <h1 className="text-xl mb-4">Admin Login</h1>

      <input
        type="text"
        placeholder="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Giriş Yap
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}

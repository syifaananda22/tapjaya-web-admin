
"use client";

import { useState } from "react";
import { loginAdmin as requestLogin } from "@/services/authService";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function clearError() {
    setError("");
  }

  async function login(
    identifier: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> {
    setIsLoading(true);
    setError("");

    try {
      const data = await requestLogin(identifier, password);

      if (!data.token) {
        throw new Error("Token login tidak diterima.");
      }

      // Hapus sesi login lama
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      localStorage.removeItem("admin");

      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("admin");

      // Simpan sesi sesuai pilihan pengguna
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("isLoggedIn", "true");
      storage.setItem("authToken", data.token);
      storage.setItem("admin", JSON.stringify(data.admin));

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Tidak dapat menghubungi server."
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    login,
    isLoading,
    error,
    clearError,
  };
}

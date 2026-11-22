
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    login,
    isLoading,
    error,
    clearError,
  } = useLogin();

  function clearMessages() {
    setFormError("");
    clearError();
  }

  async function handleLogin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !password.trim()) {
      setFormError(
        "Email/username dan password wajib diisi."
      );
      return;
    }

    try {
      const success = await login(
        email.trim(),
        password,
        rememberMe
      );

      if (success) {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setFormError(
        "Tidak dapat terhubung ke server. Periksa koneksi backend."
      );
    }
  }

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-7">
          <h1 className="text-[27px] font-bold leading-tight text-[#151515]">
            Masuk ke Akun Admin
          </h1>

          <p className="mt-1 text-[13px] text-[#777777]">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[12px] font-medium text-[#222222]"
            >
              Email atau Username
            </label>

            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearMessages();
              }}
              placeholder="Masukkan email atau username"
              autoComplete="username"
              required
              disabled={isLoading}
              className="h-[40px] w-full rounded-[8px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 text-[13px] text-black outline-none transition focus:border-[#df292e] focus:bg-white disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[12px] font-medium text-[#222222]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearMessages();
                }}
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                className="h-[40px] w-full rounded-[8px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 pr-14 text-[13px] text-black outline-none transition focus:border-[#df292e] focus:bg-white disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#888888] hover:text-[#df292e]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <label className="flex cursor-pointer items-center gap-2 text-[#777777]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
                disabled={isLoading}
                className="h-4 w-4 accent-[#df292e]"
              />
              Ingat saya
            </label>
          </div>

          {(formError || error) && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-600"
            >
              {formError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-[42px] w-full rounded-[8px] bg-[#df292e] text-[13px] font-semibold text-white transition hover:bg-[#c92328] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email/username dan password wajib diisi.");
      return;
    }

    const savedAdmin = localStorage.getItem("adminAccount");

    if (!savedAdmin) {
      setError("Akun admin belum terdaftar.");
      return;
    }

    const admin = JSON.parse(savedAdmin);

    if (email !== admin.email || password !== admin.password) {
      setError("Email atau password salah.");
      return;
    }

    setError("");

    if (rememberMe) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
    }

    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-7">
          <h1 className="text-[27px] font-bold leading-tight text-[#151515]">
            Masuk ke Akun Admin
          </h1>

          <p className="mt-1 text-[13px] text-[#777777]">
            Silahkan masuk untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#222222]">
              Email atau Username
            </label>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[40px] w-full rounded-[8px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 text-[13px] text-black outline-none transition focus:border-[#df292e] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-[#222222]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[40px] w-full rounded-[8px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 pr-14 text-[13px] text-black outline-none transition focus:border-[#df292e] focus:bg-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#df292e]"
              />
              Ingat saya
            </label>

            <button
              type="button"
              className="font-medium text-[#df292e] hover:underline"
            >
              Lupa Password?
            </button>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="h-[42px] w-full rounded-[8px] bg-[#df292e] text-[13px] font-semibold text-white transition hover:bg-[#c92328]"
          >
            Masuk
          </button>

          <p className="pt-1 text-center text-[12px] text-[#a0a0a0]">
            Belum Punya Akun?{" "}
            <Link
              href="/register"
              className="font-medium text-[#df292e] hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
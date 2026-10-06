"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !nama.trim() ||
      !email.trim() ||
      !password.trim() ||
      !konfirmasiPassword.trim()
    ) {
      setError("Semua data wajib diisi.");
      return;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== konfirmasiPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    localStorage.setItem(
      "adminAccount",
      JSON.stringify({
        nama,
        email,
        password,
      })
    );

    setError("");
    alert("Registrasi berhasil.");

    router.push("/login");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px]">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-[25px] font-bold leading-tight text-[#151515]">
            Daftar Akun Admin
          </h1>

          <p className="mt-1 text-[12px] text-[#777777]">
            Lengkapi Data Diri Untuk Membuat Akun
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          {/* NAMA */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#222222]">
              Nama Lengkap
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="h-[36px] w-full rounded-[7px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 text-[12px] text-black outline-none transition focus:border-[#df292e] focus:bg-white"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#222222]">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[36px] w-full rounded-[7px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 text-[12px] text-black outline-none transition focus:border-[#df292e] focus:bg-white"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#222222]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[36px] w-full rounded-[7px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 text-[12px] text-black outline-none transition focus:border-[#df292e] focus:bg-white"
            />
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#222222]">
              Konfirmasi Password
            </label>

            <input
              type="password"
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
              className="h-[36px] w-full rounded-[7px] border border-[#d8d8d8] bg-[#f7f7f7] px-3 text-[12px] text-black outline-none transition focus:border-[#df292e] focus:bg-white"
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-1 h-[40px] w-full rounded-[8px] bg-[#df292e] text-[12px] font-semibold text-white transition hover:bg-[#c92328]"
          >
            Daftar
          </button>

          {/* LOGIN LINK */}
          <p className="pt-0.5 text-center text-[11px] text-[#a0a0a0]">
            Sudah Punya Akun?{" "}
            <Link
              href="/login"
              className="font-medium text-[#df292e] hover:underline"
            >
              Masuk Sekarang
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
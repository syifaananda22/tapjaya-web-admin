"use client";

import Link from "next/link";

import {
  Check,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export default function SettingsSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-5">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-100 bg-white px-8 py-10 text-center shadow-sm">
        {/* ICON */}

        <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-green-50">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-green-500 text-white">
            <Check
              size={27}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* TEXT */}

        <h1 className="mt-6 text-[22px] font-bold text-gray-900">
          Perubahan Berhasil Disimpan
        </h1>

        <p className="mx-auto mt-2 max-w-[350px] text-[11px] leading-5 text-gray-500">
          Informasi pengaturan TAP JAYA
          berhasil diperbarui dan perubahan
          telah disimpan.
        </p>

        {/* BUTTONS */}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/settings"
            className="flex h-[42px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-[11px] font-semibold text-gray-600 transition hover:border-red-300 hover:text-red-500"
          >
            <Settings size={15} />

            Kembali ke Pengaturan
          </Link>

          <Link
            href="/dashboard"
            className="flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#e63131] px-5 text-[11px] font-semibold text-white transition hover:bg-[#ca2929]"
          >
            <LayoutDashboard
              size={15}
            />

            Ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
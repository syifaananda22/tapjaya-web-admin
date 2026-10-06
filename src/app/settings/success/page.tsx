"use client";

import Link from "next/link";
import "./success.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m7.5 12.3 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SettingsSuccessPage() {
  return (
    <main className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <CheckIcon />
        </div>

        <h1>Perubahan Berhasil Disimpan</h1>

        <p>
          Informasi akun, toko, notifikasi, dan pengaturan
          telah berhasil diperbarui.
        </p>

        <div className="success-actions">
          <Link
            href="/settings"
            className="secondary-button"
          >
            Kembali ke Pengaturan
          </Link>

          <Link
            href="/dashboard"
            className="primary-button"
          >
            Ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
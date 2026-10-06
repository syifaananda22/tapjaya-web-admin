"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";

type AdminHeaderProps = {
  title: string;
  subtitle: string;
  backHref?: string;
};

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Pesanan baru masuk",
    description: "Pesanan #0022 dari Meja 07 baru diterima.",
    time: "2 menit lalu",
    read: false,
  },
  {
    id: 2,
    title: "Stok menipis",
    description: "Stok Kopi Arabica tersisa 5.",
    time: "15 menit lalu",
    read: false,
  },
  {
    id: 3,
    title: "Pesanan selesai",
    description: "Pesanan #0019 telah selesai diproses.",
    time: "30 menit lalu",
    read: false,
  },
];

export default function AdminHeader({
  title,
  subtitle,
  backHref,
}: AdminHeaderProps) {
  const router = useRouter();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showAdminMenu, setShowAdminMenu] =
    useState(false);

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const markOneAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");

    router.push("/login");
  };

  return (
    <header className="relative flex items-start justify-between gap-5">
      {/* LEFT */}
      <div className="flex min-w-0 items-start gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-gray-100 hover:text-red-500"
          >
            <ArrowLeft size={21} />
          </Link>
        )}

        <div>
          <h1 className="text-[30px] font-bold leading-tight text-black">
            {title}
          </h1>

          <p className="mt-1 text-[12px] text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-3">
        {/* NOTIFICATION */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(
                !showNotifications
              );
              setShowAdminMenu(false);
            }}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <Bell
              size={18}
              className="text-gray-700"
            />

            {unreadCount > 0 && (
              <span className="absolute -right-[1px] -top-[1px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#e63131] px-1 text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 z-[100] w-[340px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {/* NOTIFICATION HEADER */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-[13px] font-bold text-black">
                    Notifikasi
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {unreadCount} belum dibaca
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-[9px] font-semibold text-[#e63131] transition hover:bg-red-100"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>

              {/* NOTIFICATION LIST */}
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map(
                  (notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() =>
                        markOneAsRead(
                          notification.id
                        )
                      }
                      className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-none hover:bg-gray-50 ${
                        notification.read
                          ? "bg-white"
                          : "bg-red-50/40"
                      }`}
                    >
                      <div className="pt-1">
                        <span
                          className={`block h-2 w-2 rounded-full ${
                            notification.read
                              ? "bg-gray-300"
                              : "bg-[#e63131]"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-[11px] ${
                              notification.read
                                ? "font-medium text-gray-600"
                                : "font-bold text-black"
                            }`}
                          >
                            {
                              notification.title
                            }
                          </p>

                          {!notification.read && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-semibold text-red-500">
                              Baru
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                          {
                            notification.description
                          }
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* ADMIN */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowAdminMenu(
                !showAdminMenu
              );
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
              A
            </div>

            <div className="hidden text-left leading-tight sm:block">
              <p className="text-[11px] font-semibold text-black">
                Admin
              </p>

              <p className="mt-0.5 text-[8px] text-gray-500">
                Toko Kopi Jaya Begawan
              </p>
            </div>

            <ChevronDown
              size={13}
              className="text-gray-500"
            />
          </button>

          {showAdminMenu && (
            <div className="absolute right-0 top-11 z-[100] w-[175px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-[11px] text-gray-700 transition hover:bg-gray-50"
              >
                <Settings size={15} />
                Pengaturan
              </button>

              <div className="border-t border-gray-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-[11px] font-medium text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
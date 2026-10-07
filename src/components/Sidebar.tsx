"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  Package,
  FileText,
  Settings,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Pesanan",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Menu Produk",
    href: "/products",
    icon: Package,
  },
  {
    name: "Laporan",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Pengaturan",
    href: "settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-[170px] shrink-0 border-r border-gray-200 bg-white lg:block">
      {/* LOGO */}
      <div className="flex h-[130px] items-center justify-center border-b border-gray-100 px-4">
        <Image
          src="/images/tapjaya-logo.png"
          alt="TAP JAYA"
          width={140}
          height={105}
          priority
          className="h-auto w-[112px] object-contain"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2 px-3 py-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.href ||
            (menu.href === "/orders" &&
              pathname.startsWith("/orders/"));

          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-[11px] text-[12px] font-semibold transition ${active
                ? "bg-[#e63131] text-white"
                : "bg-[#f5f5f5] text-[#666666] hover:bg-red-50 hover:text-[#e63131]"
                }`}
            >
              <Icon size={15} strokeWidth={2} />

              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

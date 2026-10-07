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

const menuItems = [
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
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[220px] shrink-0 flex-col border-r border-gray-100 bg-white px-[18px] py-[20px]">
      {/* LOGO */}
      <div className="mb-[28px] flex justify-center">
        <div className="flex h-[145px] w-[145px] items-center justify-center">
          <Image
            src="/images/tapjaya-logo.png"
            alt="TAP JAYA"
            width={145}
            height={145}
            priority
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-[11px]">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex h-[60px] w-full items-center gap-[15px] rounded-[12px] px-[18px] text-[15px] font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#ef3333] text-white shadow-sm"
                  : "bg-[#f3f3f3] text-[#555555] hover:bg-[#e9e9e9]"
              }`}
            >
              <Icon
                size={21}
                strokeWidth={2}
                className={
                  isActive
                    ? "text-white"
                    : "text-[#666666] transition group-hover:text-[#444444]"
                }
              />

              <span className="whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
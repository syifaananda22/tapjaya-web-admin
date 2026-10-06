"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  CalendarDays,
  ChevronDown,
  Search,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

import {
  orders,
  type OrderStatus,
} from "@/data/orders";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("Semua");

  const [showDateFilter, setShowDateFilter] =
    useState(false);

  const [selectedQuickPeriod, setSelectedQuickPeriod] =
    useState("hariini");

  const [startDate, setStartDate] =
    useState("2026-10-02");

  const [endDate, setEndDate] =
    useState("2026-10-02");

  const filteredOrders = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return orders.filter((order) => {
      const keyword =
        search.toLowerCase();

      const orderDate = new Date(
        order.date
      );

      const matchSearch =
        order.id
          .toLowerCase()
          .includes(keyword) ||
        order.menu
          .toLowerCase()
          .includes(keyword) ||
        order.customerName
          .toLowerCase()
          .includes(keyword);

      const matchStatus =
        statusFilter === "Semua" ||
        order.status === statusFilter;

      const matchDate =
        orderDate >= start &&
        orderDate <= end;

      return (
        matchSearch &&
        matchStatus &&
        matchDate
      );
    });
  }, [
    search,
    statusFilter,
    startDate,
    endDate,
  ]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const statusClass = (
    status: OrderStatus
  ) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-600";
      case "Diproses":
        return "bg-blue-100 text-blue-600";
      case "Siap":
        return "bg-emerald-100 text-emerald-600";
      case "Selesai":
        return "bg-green-100 text-green-600";
    }
  };

  const handleQuickPeriod = (
    period: string
  ) => {
    setSelectedQuickPeriod(period);

    const today = new Date("2026-10-02");
    const start = new Date(today);

    if (period === "7hari") {
      start.setDate(today.getDate() - 6);
    }

    if (period === "30hari") {
      start.setDate(today.getDate() - 29);
    }

    if (period === "6bulan") {
      start.setMonth(today.getMonth() - 6);
    }

    if (period === "1tahun") {
      start.setFullYear(
        today.getFullYear() - 1
      );
    }

    const formatDate = (date: Date) =>
      date.toISOString().split("T")[0];

    setStartDate(formatDate(start));
    setEndDate(formatDate(today));
  };

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        <div className="mb-5">
          <AdminHeader
            title="Manajemen Pesanan"
            subtitle="Kelola dan pantau semua pesanan caffe Anda."
          />
        </div>

        {/* FILTER */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-[320px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Cari nomor pesanan, nama menu"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-[40px] w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[11px] outline-none transition focus:border-red-400"
            />
          </div>

          {/* DATE */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowDateFilter(
                  !showDateFilter
                )
              }
              className="flex h-[40px] min-w-[225px] items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600"
            >
              <CalendarDays size={15} />

              <span className="flex-1 text-left">
                {startDate} - {endDate}
              </span>

              <ChevronDown size={13} />
            </button>

            {showDateFilter && (
              <div className="absolute left-0 top-11 z-50 w-[295px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                <p className="mb-3 text-[12px] font-bold">
                  Pilih Periode
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["hariini", "Hari Ini"],
                    [
                      "7hari",
                      "7 Hari Terakhir",
                    ],
                    [
                      "30hari",
                      "30 Hari Terakhir",
                    ],
                    [
                      "6bulan",
                      "6 Bulan Terakhir",
                    ],
                    [
                      "1tahun",
                      "1 Tahun Terakhir",
                    ],
                  ].map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() =>
                        handleQuickPeriod(
                          value
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-[10px] ${
                        selectedQuickPeriod ===
                        value
                          ? "border-red-400 bg-red-50 font-semibold text-red-500"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="my-4 border-t" />

                <p className="mb-2 text-[10px] font-semibold text-gray-600">
                  Pilih Tanggal Manual
                </p>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(
                      e.target.value
                    );
                    setSelectedQuickPeriod(
                      "custom"
                    );
                  }}
                  className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px]"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(
                      e.target.value
                    );
                    setSelectedQuickPeriod(
                      "custom"
                    );
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowDateFilter(false)
                  }
                  className="mt-4 h-[34px] w-full rounded-lg bg-[#e63131] text-[10px] font-semibold text-white"
                >
                  Terapkan
                </button>
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="h-[40px] min-w-[180px] appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 text-[11px] outline-none"
            >
              <option value="Semua">
                Semua status
              </option>
              <option value="Menunggu">
                Menunggu
              </option>
              <option value="Diproses">
                Diproses
              </option>
              <option value="Siap">
                Siap
              </option>
              <option value="Selesai">
                Selesai
              </option>
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f7f7f7] text-left text-[11px] font-semibold text-gray-600">
                  <th className="w-[45px] px-4 py-3" />

                  <th className="px-4 py-3">
                    No. Pesanan
                  </th>

                  <th className="px-4 py-3">
                    Waktu
                  </th>

                  <th className="px-4 py-3">
                    Menu
                  </th>

                  <th className="px-4 py-3">
                    Total
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map(
                  (order) => (
                    <tr
                      key={order.id}
                      className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                    >
                      <td className="border-b border-gray-100 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-red-500"
                        />
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 font-medium">
                        #{order.id}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        {order.time}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              order.image
                            }
                            alt={
                              order.menu
                            }
                            width={36}
                            height={36}
                            className="h-[36px] w-[36px] rounded-lg object-cover"
                          />

                          <span className="font-medium text-gray-800">
                            {
                              order.menu
                            }
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        {formatCurrency(
                          order.total
                        )}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        <span
                          className={`inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-[9px] font-semibold ${statusClass(
                            order.status
                          )}`}
                        >
                          {
                            order.status
                          }
                        </span>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 text-center">
                        <Link
                          href={`/orders/${order.id}`}
                          className="inline-flex h-[30px] items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-[10px] font-medium text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  )
                )}

                {filteredOrders.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-[11px] text-gray-400"
                    >
                      Pesanan tidak
                      ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
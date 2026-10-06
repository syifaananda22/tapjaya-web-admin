"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Coins,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";
import StatCard from "@/components/StatCard";

import {
  bestMenus,
  categoryData,
  latestOrders,
  revenueData,
} from "@/data/dashboard";

import type { Period } from "@/data/dashboard";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const [revenuePeriod, setRevenuePeriod] =
    useState<Period>("7hari");

  const [categoryPeriod, setCategoryPeriod] =
    useState<Period>("7hari");

  const [showDateFilter, setShowDateFilter] =
    useState(false);

  const [selectedQuickPeriod, setSelectedQuickPeriod] =
    useState("7hari");

  const [startDate, setStartDate] =
    useState("2026-10-21");

  const [endDate, setEndDate] =
    useState("2026-10-26");

  const pieColors = [
    "#00b96b",
    "#168be5",
    "#ffbf19",
    "#ff7a1a",
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const statusStyle = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-600";
      case "Siap":
        return "bg-emerald-100 text-emerald-600";
      case "Diproses":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  const handleQuickPeriod = (
    period: string
  ) => {
    setSelectedQuickPeriod(period);

    const today = new Date("2026-10-26");
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

      <section className="min-w-0 flex-1 p-4 lg:p-5">
        {/* HEADER */}
        <div className="mb-3 rounded-xl bg-white px-5 py-4 shadow-sm">
          <AdminHeader
            title="Dashboard"
            subtitle="Selamat datang, Admin! Berikut ringkasan operasional caffe Anda."
          />
        </div>

        {/* GLOBAL DATE */}
        <div className="relative mb-3 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setShowDateFilter(
                !showDateFilter
              )
            }
            className="flex h-[36px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[10px] text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            {startDate} - {endDate}
            <ChevronDown size={13} />
          </button>

          {showDateFilter && (
            <div className="absolute right-0 top-10 z-50 w-[290px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
              <p className="mb-3 text-[12px] font-bold">
                Pilih Periode
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
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
                    className={`rounded-lg border px-3 py-2 text-[10px] transition ${
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

              <div className="space-y-2">
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
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] outline-none focus:border-red-400"
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
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] outline-none focus:border-red-400"
                />
              </div>

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

        {/* STATISTICS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Pesanan"
            value="124"
            description="↑ 12% dari kemarin"
            icon={
              <div className="rounded-lg bg-red-50 p-2">
                <ClipboardList
                  size={20}
                  className="text-red-400"
                />
              </div>
            }
          />

          <StatCard
            title="Total Pendapatan"
            value="Rp 4.540.000"
            description="↑ 10% dari kemarin"
            icon={
              <div className="rounded-lg bg-green-50 p-2">
                <Banknote
                  size={20}
                  className="text-green-500"
                />
              </div>
            }
          />

          <StatCard
            title="Pesanan Selesai"
            value="112"
            description="↑ 2% dari kemarin"
            icon={
              <div className="rounded-lg bg-blue-50 p-2">
                <CheckCircle2
                  size={20}
                  className="text-blue-500"
                />
              </div>
            }
          />

          <StatCard
            title="Stock Menipis"
            value="8"
            description="Lihat Detail"
            descriptionClassName="text-blue-500"
            icon={
              <div className="rounded-lg bg-yellow-50 p-2">
                <Coins
                  size={20}
                  className="text-yellow-500"
                />
              </div>
            }
          />
        </div>

        {/* CHART */}
        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.25fr_1fr]">
          {/* REVENUE */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold">
                Grafik Pendapatan
              </h2>

              <select
                value={revenuePeriod}
                onChange={(e) =>
                  setRevenuePeriod(
                    e.target
                      .value as Period
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[10px]"
              >
                <option value="7hari">
                  7 Hari Terakhir
                </option>
                <option value="1bulan">
                  1 Bulan
                </option>
                <option value="6bulan">
                  6 Bulan
                </option>
                <option value="1tahun">
                  1 Tahun
                </option>
              </select>
            </div>

            <div className="h-[195px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={
                    revenueData[
                      revenuePeriod
                    ]
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 8,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: "#ef4444",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold">
                Kategori Menu Terlaris
              </h2>

              <select
                value={categoryPeriod}
                onChange={(e) =>
                  setCategoryPeriod(
                    e.target
                      .value as Period
                  )
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[10px]"
              >
                <option value="7hari">
                  7 Hari Terakhir
                </option>
                <option value="1bulan">
                  1 Bulan
                </option>
                <option value="6bulan">
                  6 Bulan
                </option>
                <option value="1tahun">
                  1 Tahun
                </option>
              </select>
            </div>

            <div className="flex min-h-[195px] items-center justify-center">
              <div className="h-[150px] w-[150px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={
                        categoryData[
                          categoryPeriod
                        ]
                      }
                      innerRadius={40}
                      outerRadius={64}
                      dataKey="value"
                    >
                      {categoryData[
                        categoryPeriod
                      ].map(
                        (
                          item,
                          index
                        ) => (
                          <Cell
                            key={
                              item.name
                            }
                            fill={
                              pieColors[
                                index
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="ml-5 space-y-3">
                {categoryData[
                  categoryPeriod
                ].map(
                  (item, index) => (
                    <div
                      key={item.name}
                      className="flex min-w-[145px] justify-between gap-5 text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-[7px] w-[7px] rounded-full"
                          style={{
                            backgroundColor:
                              pieColors[
                                index
                              ],
                          }}
                        />

                        {item.name}
                      </div>

                      <strong>
                        {item.value}%
                      </strong>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABLES */}
        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
          {/* BEST MENU */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-[14px] font-bold text-black">
              Menu Terlaris Hari Ini
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f8f8] text-left text-[11px] font-semibold text-gray-500">
                    <th className="rounded-l-lg px-3 py-3">
                      #
                    </th>

                    <th className="px-3 py-3">
                      Nama Menu
                    </th>

                    <th className="px-3 py-3">
                      Terjual
                    </th>

                    <th className="rounded-r-lg px-3 py-3">
                      Pendapatan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bestMenus.map(
                    (menu, index) => (
                      <tr
                        key={menu.id}
                        className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {index + 1}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                menu.image
                              }
                              alt={
                                menu.name
                              }
                              width={
                                34
                              }
                              height={
                                34
                              }
                              className="h-[34px] w-[34px] rounded-lg object-cover"
                            />

                            <span className="font-medium text-gray-800">
                              {
                                menu.name
                              }
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {menu.sold}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5 font-medium">
                          {formatCurrency(
                            menu.revenue
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* LATEST */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-black">
                Pesanan Terbaru
              </h2>

              <Link
                href="/orders"
                className="rounded-md px-2 py-1 text-[10px] font-medium text-blue-500 transition hover:bg-blue-50"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f8f8] text-left text-[11px] font-semibold text-gray-500">
                    <th className="rounded-l-lg px-3 py-3">
                      #
                    </th>

                    <th className="px-3 py-3">
                      Waktu
                    </th>

                    <th className="px-3 py-3">
                      Menu
                    </th>

                    <th className="px-3 py-3">
                      Total
                    </th>

                    <th className="rounded-r-lg px-3 py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {latestOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {order.id}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {order.time}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                order.image
                              }
                              alt={
                                order.menu
                              }
                              width={
                                32
                              }
                              height={
                                32
                              }
                              className="h-[32px] w-[32px] rounded-lg object-cover"
                            />

                            <span className="font-medium text-gray-800">
                              {
                                order.menu
                              }
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {formatCurrency(
                            order.total
                          )}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[9px] font-semibold ${statusStyle(
                              order.status
                            )}`}
                          >
                            {
                              order.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
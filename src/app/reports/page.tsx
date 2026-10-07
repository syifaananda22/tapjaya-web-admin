
"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Banknote,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period =
  | "today"
  | "week"
  | "month"
  | "sixMonths"
  | "year";

type ReportData = {
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
  comparison: string;
  chart: {
    label: string;
    revenue: number;
    orders: number;
  }[];
};

const reportData: Record<Period, ReportData> = {
  today: {
    totalRevenue: 1850000,
    totalOrders: 57,
    averageOrder: 32456,
    comparison: "dari kemarin",
    chart: [
      { label: "08:00", revenue: 120000, orders: 4 },
      { label: "09:00", revenue: 180000, orders: 6 },
      { label: "10:00", revenue: 220000, orders: 7 },
      { label: "11:00", revenue: 310000, orders: 9 },
      { label: "12:00", revenue: 390000, orders: 11 },
      { label: "13:00", revenue: 280000, orders: 8 },
      { label: "14:00", revenue: 350000, orders: 10 },
    ],
  },

  week: {
    totalRevenue: 12540000,
    totalOrders: 384,
    averageOrder: 32656,
    comparison: "dari minggu lalu",
    chart: [
      { label: "Sen", revenue: 1450000, orders: 44 },
      { label: "Sel", revenue: 1720000, orders: 51 },
      { label: "Rab", revenue: 1580000, orders: 48 },
      { label: "Kam", revenue: 1940000, orders: 58 },
      { label: "Jum", revenue: 2100000, orders: 64 },
      { label: "Sab", revenue: 2280000, orders: 68 },
      { label: "Min", revenue: 1470000, orders: 51 },
    ],
  },

  month: {
    totalRevenue: 48540000,
    totalOrders: 1487,
    averageOrder: 32643,
    comparison: "dari bulan lalu",
    chart: [
      { label: "2 Sep", revenue: 520000, orders: 22 },
      { label: "5 Sep", revenue: 780000, orders: 31 },
      { label: "8 Sep", revenue: 1120000, orders: 42 },
      { label: "11 Sep", revenue: 960000, orders: 37 },
      { label: "14 Sep", revenue: 1280000, orders: 48 },
      { label: "17 Sep", revenue: 1680000, orders: 63 },
      { label: "20 Sep", revenue: 1140000, orders: 44 },
      { label: "23 Sep", revenue: 1390000, orders: 52 },
      { label: "26 Sep", revenue: 1720000, orders: 66 },
      { label: "29 Sep", revenue: 1160000, orders: 45 },
      { label: "2 Okt", revenue: 960000, orders: 39 },
    ],
  },

  sixMonths: {
    totalRevenue: 276300000,
    totalOrders: 8524,
    averageOrder: 32414,
    comparison: "dari 6 bulan sebelumnya",
    chart: [
      { label: "Mei", revenue: 38500000, orders: 1180 },
      { label: "Jun", revenue: 41900000, orders: 1290 },
      { label: "Jul", revenue: 43700000, orders: 1360 },
      { label: "Agu", revenue: 46900000, orders: 1448 },
      { label: "Sep", revenue: 48540000, orders: 1512 },
      { label: "Okt", revenue: 56760000, orders: 1734 },
    ],
  },

  year: {
    totalRevenue: 548900000,
    totalOrders: 16870,
    averageOrder: 32537,
    comparison: "dari tahun lalu",
    chart: [
      { label: "Jan", revenue: 38000000, orders: 1160 },
      { label: "Feb", revenue: 40500000, orders: 1240 },
      { label: "Mar", revenue: 42100000, orders: 1300 },
      { label: "Apr", revenue: 43900000, orders: 1340 },
      { label: "Mei", revenue: 45500000, orders: 1400 },
      { label: "Jun", revenue: 46200000, orders: 1425 },
      { label: "Jul", revenue: 47100000, orders: 1455 },
      { label: "Agu", revenue: 48300000, orders: 1482 },
      { label: "Sep", revenue: 49500000, orders: 1515 },
      { label: "Okt", revenue: 51000000, orders: 1570 },
      { label: "Nov", revenue: 53300000, orders: 1640 },
      { label: "Des", revenue: 63400000, orders: 2343 },
    ],
  },
};

const bestMenus = [
  {
    id: 1,
    name: "Bakmi Jaya",
    sold: 36,
    revenue: 1083000,
    image: "/images/menu/bakmi-jaya.jpg",
  },
  {
    id: 2,
    name: "Kopi Susu Berjaya",
    sold: 32,
    revenue: 795600,
    image: "/images/menu/kopi-susu.jpg",
  },
  {
    id: 3,
    name: "Nasi Goreng Jawa",
    sold: 28,
    revenue: 591600,
    image: "/images/menu/nasi-goreng.jpg",
  },
  {
    id: 4,
    name: "Mie Goreng Jawa",
    sold: 24,
    revenue: 581600,
    image: "/images/menu/mie-goreng.jpg",
  },
  {
    id: 5,
    name: "Milkshake Mango",
    sold: 20,
    revenue: 491600,
    image: "/images/menu/milkshake-mango.jpg",
  },
];

const categories = [
  {
    name: "Makanan",
    value: 42.2,
  },
  {
    name: "Minuman",
    value: 28.1,
  },
  {
    name: "Kopi",
    value: 18.8,
  },
  {
    name: "Snack",
    value: 10.9,
  },
];

const periodOptions: {
  value: Period;
  label: string;
}[] = [
  {
    value: "today",
    label: "Hari Ini",
  },
  {
    value: "week",
    label: "Minggu Ini",
  },
  {
    value: "month",
    label: "Bulan Ini",
  },
  {
    value: "sixMonths",
    label: "6 Bulan",
  },
  {
    value: "year",
    label: "1 Tahun",
  },
];

export default function ReportsPage() {
  const [period, setPeriod] =
    useState<Period>("month");

  const data = reportData[period];

  const pieColors = [
    "#00b96b",
    "#168be5",
    "#ffb020",
    "#ff7a1a",
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        {/* HEADER */}
        <div className="mb-5">
          <AdminHeader
            title="Laporan Keuangan"
            subtitle="Lihat ringkasan pendapatan dan transaksi caffe Anda."
          />
        </div>

        {/* PERIOD FILTER */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {periodOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setPeriod(item.value)
              }
              className={`h-[40px] rounded-lg border text-[11px] font-medium transition ${
                period === item.value
                  ? "border-[#e63131] bg-[#e63131] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* TOTAL PENDAPATAN */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-50 p-2">
                <Banknote
                  size={20}
                  className="text-green-500"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  Total Pendapatan
                </p>

                <p className="mt-1 text-[21px] font-bold text-black">
                  {formatCurrency(
                    data.totalRevenue
                  )}
                </p>

                <p className="mt-2 text-[9px] font-medium text-green-500">
                  ↑ 18% {data.comparison}
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL PESANAN */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <ClipboardList
                  size={20}
                  className="text-blue-500"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  Total Pesanan
                </p>

                <p className="mt-1 text-[21px] font-bold text-black">
                  {data.totalOrders.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p className="mt-2 text-[9px] font-medium text-green-500">
                  ↑ 14% {data.comparison}
                </p>
              </div>
            </div>
          </div>

          {/* RATA-RATA */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-yellow-50 p-2">
                <TrendingUp
                  size={20}
                  className="text-yellow-500"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  Rata-rata Pesanan
                </p>

                <p className="mt-1 text-[21px] font-bold text-black">
                  {formatCurrency(
                    data.averageOrder
                  )}
                </p>

                <p className="mt-2 text-[9px] font-medium text-green-500">
                  ↑ 7% {data.comparison}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CHART + MENU TERLARIS */}
        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_0.85fr]">
          {/* CHART */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[14px] font-bold">
                Grafik Pendapatan
              </h2>

              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Pendapatan
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-200" />
                  Jumlah Pesanan
                </div>
              </div>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={data.chart}>
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
                    yAxisId="left"
                    tick={{
                      fontSize: 8,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{
                      fontSize: 8,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />

                  <Tooltip />

                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#fecaca"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BEST MENU */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-[14px] font-bold">
              Menu Terlaris
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f7f7f7] text-left text-[10px] font-semibold text-gray-600">
                    <th className="rounded-l-lg px-2 py-2.5">
                      No.
                    </th>

                    <th className="px-2 py-2.5">
                      Menu
                    </th>

                    <th className="px-2 py-2.5">
                      Terjual
                    </th>

                    <th className="rounded-r-lg px-2 py-2.5">
                      Pendapatan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bestMenus.map(
                    (item, index) => (
                      <tr
                        key={item.id}
                        className="text-[10px] text-gray-700 transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-2 py-2.5">
                          {index + 1}
                        </td>

                        <td className="border-b border-gray-100 px-2 py-2.5">
                          <div className="flex items-center gap-2">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={30}
                              height={30}
                              className="h-[30px] w-[30px] rounded-lg object-cover"
                            />

                            <span className="font-medium text-gray-800">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-2 py-2.5">
                          {item.sold}
                        </td>

                        <td className="border-b border-gray-100 px-2 py-2.5">
                          {formatCurrency(
                            item.revenue
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-[14px] font-bold">
            Pendapatan per Kategori
          </h2>

          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="h-[190px] w-[220px] shrink-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={78}
                  >
                    {categories.map(
                      (
                        category,
                        index
                      ) => (
                        <Cell
                          key={
                            category.name
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

            <div className="w-full flex-1">
              {categories.map(
                (category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between border-b border-gray-100 py-3 last:border-none"
                  >
                    <div className="flex items-center gap-3 text-[11px] text-gray-700">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            pieColors[
                              index
                            ],
                        }}
                      />

                      {category.name}
                    </div>

                    <span className="text-[11px] font-bold text-gray-800">
                      {category.value}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

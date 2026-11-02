
"use client";

import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
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
  revenueChange: number | null;
  orderChange: number | null;
  averageChange: number | null;
  comparison: string;
  chart: {
    label: string;
    revenue: number;
    orders: number;
  }[];
  bestMenus: {
    id: number;
    name: string;
    sold: number;
    revenue: number;
    image: string | null;
  }[];
  categories: {
    name: string;
    value: number;
  }[];
};

const EMPTY: ReportData = {
  totalRevenue: 0,
  totalOrders: 0,
  averageOrder: 0,
  revenueChange: null,
  orderChange: null,
  averageChange: null,
  comparison: "dari periode sebelumnya",
  chart: [],
  bestMenus: [],
  categories: [
    "Makanan",
    "Minuman",
    "Kopi",
    "Snack",
  ].map((name) => ({
    name,
    value: 0,
  })),
};

function getImageUrl(value: string | null): string {
  if (!value) return "";

  if (value.startsWith("/uploads/")) {
    const backend = (
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000"
    ).replace(/\/$/, "");

    return `${backend}${value}`;
  }

  return value;
}

function changeText(
  change: number | null,
  comparison: string
): string {
  if (change === null) {
    return `— ${comparison} (belum ada pembanding)`;
  }

  const sign =
    change > 0 ? "↑" :
    change < 0 ? "↓" : "→";

  return `${sign} ${Math.abs(change).toLocaleString(
    "id-ID",
    { maximumFractionDigits: 1 }
  )}% ${comparison}`;
}

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

  const [data, setData] =
    useState<ReportData>(EMPTY);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    reportService
      .getOverview(period)
      .then((response) => {
        if (active) {
          setData(response.data);
        }
      })
      .catch((err) => {
        if (active) {
          setData(EMPTY);
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat laporan."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [period]);

  const bestMenus = data.bestMenus;
  const categories = data.categories;

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

  // KHUSUS HARI INI:
  // Tampilkan hanya kelompok jam 08 sampai 22.
  // Batas grafik diberi label 08:30 dan 22:30.
  // Filter periode lain menggunakan data API tanpa perubahan.
  const chartData =
    period === "today"
      ? data.chart
          .filter((item) => {
            const hour = Number(
              String(item.label).split(":")[0]
            );

            return (
              Number.isFinite(hour) &&
              hour >= 8 &&
              hour <= 22
            );
          })
          .map((item) => {
            const hour = Number(
              String(item.label).split(":")[0]
            );

            return {
              ...item,
              label:
                hour === 8
                  ? "08:30"
                  : hour === 22
                    ? "22:30"
                    : item.label,
            };
          })
      : data.chart;

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

        {error && (
          <p
            role="alert"
            className="mb-3 text-[11px] text-red-600"
          >
            {error}
          </p>
        )}

        {loading && (
          <p
            role="status"
            className="mb-3 text-[11px] text-gray-500"
          >
            Memuat laporan...
          </p>
        )}

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
                  {changeText(
                    data.revenueChange,
                    data.comparison
                  )}
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
                  {changeText(
                    data.orderChange,
                    data.comparison
                  )}
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
                  {changeText(
                    data.averageChange,
                    data.comparison
                  )}
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
                  Tren Pesanan
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
                <BarChart data={chartData}>
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
                    interval={0}
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

                  <Tooltip
                    formatter={(value, name) =>
                      name === "revenue"
                        ? formatCurrency(
                            Number(value ?? 0)
                          )
                        : Number(
                            value ?? 0
                          ).toLocaleString(
                            "id-ID"
                          )
                    }
                  />

                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    fill="#fecaca"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
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
                  {bestMenus.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-[11px] text-gray-400"
                      >
                        Belum ada penjualan pada periode ini.
                      </td>
                    </tr>
                  )}

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
                            {item.image ? (
                              <Image
                                unoptimized
                                src={getImageUrl(
                                  item.image
                                )}
                                alt={item.name}
                                width={30}
                                height={30}
                                className="h-[30px] w-[30px] rounded-lg object-cover"
                              />
                            ) : (
                              <span className="h-[30px] w-[30px] rounded-lg bg-gray-100" />
                            )}

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
                      (category, index) => (
                        <Cell
                          key={category.name}
                          fill={pieColors[index]}
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
                            pieColors[index],
                        }}
                      />

                      {category.name}
                    </div>

                    <span className="text-[11px] font-bold text-gray-800">
                      {category.value.toLocaleString(
                        "id-ID",
                        {
                          maximumFractionDigits: 1,
                        }
                      )}%
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

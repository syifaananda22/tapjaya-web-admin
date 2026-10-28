"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Coins,
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import StatCard from "@/components/StatCard";
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

type DashboardPeriod = "7hari" | "1bulan" | "6bulan" | "1tahun";

type RevenueItem = {
  label: string;
  income: number;
};

type CategoryItem = {
  name: string;
  value: number;
};

type BestMenu = {
  id: number;
  name: string;
  image: string;
  sold: number;
  revenue: number;
};

type LatestOrder = {
  id: string;
  time: string;
  menu: string;
  image: string;
  total: number;
  status: string;
};

type DashboardApiData = {
  period?: DashboardPeriod;
  dateRange?: { startDate: string; endDate: string } | null;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    lowStockProducts: number;
  };
  revenueData: RevenueItem[];
  categoryData: CategoryItem[];
  bestMenus: BestMenu[];
  latestOrders: LatestOrder[];
};

type DashboardViewData = {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  lowStock: number;
  chart: RevenueItem[];
  categories: CategoryItem[];
  bestMenus: BestMenu[];
  latestOrders: LatestOrder[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const periodOptions: {
  value: DashboardPeriod;
  label: string;
}[] = [
    { value: "7hari", label: "7 Hari" },
    { value: "1bulan", label: "1 Bulan" },
    { value: "6bulan", label: "6 Bulan" },
    { value: "1tahun", label: "1 Tahun" },
  ];

const EMPTY_DATA: DashboardViewData = {
  totalOrders: 0,
  totalRevenue: 0,
  completedOrders: 0,
  lowStock: 0,
  chart: [],
  categories: [],
  bestMenus: [],
  latestOrders: [],
};

const pieColors = ["#00b96b", "#168be5", "#ffbf19", "#ff7a1a"];

function isJwt(value: string): boolean {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(
    value
  );
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  const tokenKeys = [
    "authToken",
    "token",
    "accessToken",
    "access_token",
    "jwtToken",
    "tapjaya_token",
  ];

  const storages: Storage[] = [];

  try {
    storages.push(window.localStorage);
  } catch {
    // Local storage tidak tersedia.
  }

  try {
    storages.push(window.sessionStorage);
  } catch {
    // Session storage tidak tersedia.
  }

  for (const storage of storages) {
    try {
      for (const key of tokenKeys) {
        const rawValue = storage.getItem(key);
        if (!rawValue) continue;

        let token = rawValue.trim().replace(/^Bearer\s+/, "");

        if (token.startsWith("{")) {
          try {
            const parsed: unknown = JSON.parse(token);

            if (typeof parsed === "object" && parsed !== null) {
              const record = parsed as Record<string, unknown>;
              const nestedToken =
                record.authToken ??
                record.accessToken ??
                record.token;

              if (typeof nestedToken === "string") {
                token = nestedToken
                  .trim()
                  .replace(/^Bearer\s+/, "");
              }
            }
          } catch {
            continue;
          }
        }

        if (isJwt(token)) return token;
      }

      for (let index = 0; index < storage.length; index++) {
        const key = storage.key(index);

        if (!key || tokenKeys.includes(key)) continue;

        const rawValue = storage.getItem(key);
        if (!rawValue) continue;

        const token = rawValue.trim().replace(/^Bearer\s+/, "");

        if (isJwt(token)) return token;
      }
    } catch (error) {
      console.error("Gagal membaca penyimpanan token:", error);
    }
  }

  return null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateLabel(value: string): string {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusStyle(status: string): string {
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
}

export default function DashboardPage() {
  const [period, setPeriod] =
    useState<DashboardPeriod>("1bulan");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const [showPeriodFilter, setShowPeriodFilter] = useState(false);

  const [data, setData] =
    useState<DashboardViewData>(EMPTY_DATA);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const periodLabel =
    periodOptions.find((item) => item.value === period)?.label ??
    "1 Bulan";

  const filterLabel =
    appliedStartDate && appliedEndDate
      ? `${formatDateLabel(appliedStartDate)} – ${formatDateLabel(
        appliedEndDate
      )}`
      : periodLabel;

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const token = getStoredToken();

        if (!token) {
          throw new Error(
            "Token login tidak ditemukan. Silakan login kembali melalui halaman login."
          );
        }

        const params = new URLSearchParams();

        if (appliedStartDate && appliedEndDate) {
          params.set("startDate", appliedStartDate);
          params.set("endDate", appliedEndDate);
        } else {
          params.set("period", period);
        }

        const response = await fetch(
          `${API_URL}/api/dashboard?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        const result: unknown = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          const message =
            typeof result === "object" &&
              result !== null &&
              "message" in result &&
              typeof result.message === "string"
              ? result.message
              : `Gagal mengambil data dashboard (${response.status}).`;

          throw new Error(message);
        }

        if (
          typeof result !== "object" ||
          result === null ||
          !("data" in result)
        ) {
          throw new Error(
            "Format respons dashboard dari backend tidak sesuai."
          );
        }

        const apiData = result.data as DashboardApiData;

        if (!apiData || !apiData.stats) {
          throw new Error(
            "Data statistik dashboard tidak ditemukan dalam respons backend."
          );
        }

        if (cancelled) return;

        setData({
          totalOrders: Number(apiData.stats.totalOrders ?? 0),
          totalRevenue: Number(apiData.stats.totalRevenue ?? 0),
          completedOrders: Number(
            apiData.stats.completedOrders ?? 0
          ),
          lowStock: Number(
            apiData.stats.lowStockProducts ?? 0
          ),
          chart: Array.isArray(apiData.revenueData)
            ? apiData.revenueData
            : [],
          categories: Array.isArray(apiData.categoryData)
            ? apiData.categoryData
            : [],
          bestMenus: Array.isArray(apiData.bestMenus)
            ? apiData.bestMenus
            : [],
          latestOrders: Array.isArray(apiData.latestOrders)
            ? apiData.latestOrders
            : [],
        });
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data dashboard."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [
    period,
    appliedStartDate,
    appliedEndDate,
    retryCount,
  ]);

  function applyDateRange() {
    setDateError("");

    if (!startDate || !endDate) {
      setDateError(
        "Pilih tanggal mulai dan tanggal akhir terlebih dahulu."
      );
      return;
    }

    if (startDate > endDate) {
      setDateError(
        "Tanggal mulai tidak boleh melewati tanggal akhir."
      );
      return;
    }

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setShowPeriodFilter(false);
  }

  function choosePeriod(value: DashboardPeriod) {
    setPeriod(value);
    setStartDate("");
    setEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setDateError("");
    setShowPeriodFilter(false);
  }

  function resetDateRange() {
    setStartDate("");
    setEndDate("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setDateError("");
    setPeriod("1bulan");
    setShowPeriodFilter(false);
  }

  return (
    <section className="min-w-0 flex-1 p-4 lg:p-5">
      <div className="mb-4 rounded-xl bg-white px-5 py-4 shadow-sm">
        <AdminHeader
          title="Dashboard"
          subtitle="Selamat datang, Admin! Berikut ringkasan operasional kafe Anda."
        />
      </div>

      <div className="relative mb-4 flex justify-end">
        <button
          type="button"
          onClick={() =>
            setShowPeriodFilter((previous) => !previous)
          }
          aria-expanded={showPeriodFilter}
          className="flex min-h-[42px] min-w-[220px] items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
        >
          <span className="max-w-[260px] truncate">
            {filterLabel}
          </span>

          <ChevronDown
            size={15}
            className={`shrink-0 transition-transform ${showPeriodFilter ? "rotate-180" : ""
              }`}
          />
        </button>

        {showPeriodFilter && (
          <div className="absolute right-0 top-[49px] z-50 w-[min(92vw,360px)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
            <p className="mb-3 text-sm font-bold text-gray-800">
              Pilih Rentang Tanggal
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-xs font-medium text-gray-600">
                Tanggal mulai

                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setDateError("");
                  }}
                  className="mt-1 block h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="block text-xs font-medium text-gray-600">
                Tanggal akhir

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setDateError("");
                  }}
                  className="mt-1 block h-10 w-full rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />
              </label>
            </div>

            {dateError && (
              <p
                role="alert"
                className="mt-2 text-xs text-red-600"
              >
                {dateError}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={applyDateRange}
                disabled={loading}
                className="h-10 flex-1 rounded-lg bg-[#e63131] px-3 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Terapkan
              </button>

              <button
                type="button"
                onClick={resetDateRange}
                className="h-10 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            <div className="my-4 border-t border-gray-100" />

            <p className="mb-3 text-sm font-bold text-gray-800">
              Atau pilih periode cepat
            </p>

            <div className="grid grid-cols-2 gap-2">
              {periodOptions.map((item) => {
                const active =
                  !appliedStartDate &&
                  !appliedEndDate &&
                  period === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => choosePeriod(item.value)}
                    className={`h-10 rounded-lg border text-xs font-medium transition ${active
                        ? "border-[#e63131] bg-red-50 font-semibold text-[#e63131]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-red-50"
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          Memuat data dashboard dari database...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
        >
          <p className="font-semibold">
            Data dashboard belum berhasil dimuat.
          </p>

          <p className="mt-1">{error}</p>

          <button
            type="button"
            onClick={() =>
              setRetryCount((current) => current + 1)
            }
            className="mt-2 font-semibold underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Pesanan"
          value={data.totalOrders.toLocaleString("id-ID")}
          description={`Periode ${filterLabel}`}
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
          value={formatCurrency(data.totalRevenue)}
          description="Dari pesanan selesai"
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
          value={data.completedOrders.toLocaleString("id-ID")}
          description={`Periode ${filterLabel}`}
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
          title="Stok Menipis"
          value={String(data.lowStock)}
          description="Stok maksimal 5 unit"
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

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold">
                Grafik Pendapatan
              </h2>

              <p className="mt-1 text-[9px] text-gray-400">
                Data: {filterLabel}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[9px] text-gray-500">
                Pendapatan
              </span>
            </div>
          </div>

          <div className="h-[240px]">
            {data.chart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.chart}
                  margin={{
                    top: 10,
                    right: 15,
                    left: 5,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 8 }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                    tickFormatter={(value: number) =>
                      value >= 1_000_000
                        ? `${(value / 1_000_000).toFixed(1)}jt`
                        : `${Math.round(value / 1_000)}rb`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Pendapatan",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #eeeeee",
                      fontSize: "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }}
                    dot={{
                      r: 4,
                      fill: "#ffffff",
                      stroke: "#ef4444",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-xs text-gray-400">
                {loading
                  ? "Memuat grafik pendapatan..."
                  : "Belum ada pendapatan dari pesanan selesai pada rentang ini."}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-[13px] font-bold">
              Kategori Menu Terlaris
            </h2>

            <p className="mt-1 text-[9px] text-gray-400">
              Data: {filterLabel}
            </p>
          </div>

          {data.categories.length > 0 ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="h-[165px] w-[165px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categories}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.categories.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={
                            pieColors[index % pieColors.length]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => [
                        `${Number(value)}%`,
                        "Persentase",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="ml-5 space-y-3">
                {data.categories.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex min-w-[110px] justify-between gap-3 text-[10px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-[7px] w-[7px] rounded-full"
                        style={{
                          backgroundColor:
                            pieColors[index % pieColors.length],
                        }}
                      />
                      {item.name}
                    </div>

                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[240px] items-center justify-center text-center text-xs text-gray-400">
              {loading
                ? "Memuat kategori menu..."
                : "Belum ada penjualan selesai untuk rentang ini."}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[14px] font-bold text-black">
            Menu Terlaris — {filterLabel}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f8f8f8] text-left text-[11px] font-semibold text-gray-500">
                  <th className="rounded-l-lg px-3 py-3">#</th>
                  <th className="px-3 py-3">Nama Menu</th>
                  <th className="px-3 py-3">Terjual</th>
                  <th className="rounded-r-lg px-3 py-3">
                    Pendapatan
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.bestMenus.length > 0 ? (
                  data.bestMenus.map((menu, index) => (
                    <tr
                      key={`${menu.id}-${menu.name}`}
                      className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                    >
                      <td className="border-b border-gray-100 px-3 py-2.5">
                        {index + 1}
                      </td>

                      <td className="border-b border-gray-100 px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              menu.image ||
                              "/images/menu/bakmi-jaya.jpg"
                            }
                            alt={menu.name}
                            width={34}
                            height={34}
                            className="h-[34px] w-[34px] rounded-lg object-cover"
                          />

                          <span className="font-medium text-gray-800">
                            {menu.name}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-3 py-2.5">
                        {menu.sold}
                      </td>

                      <td className="border-b border-gray-100 px-3 py-2.5 font-medium">
                        {formatCurrency(menu.revenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-8 text-center text-xs text-gray-400"
                    >
                      {loading
                        ? "Memuat menu terlaris..."
                        : "Belum ada menu terjual pada rentang ini."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
                  <th className="rounded-l-lg px-3 py-3">#</th>
                  <th className="px-3 py-3">Waktu</th>
                  <th className="px-3 py-3">Menu</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="rounded-r-lg px-3 py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.latestOrders.length > 0 ? (
                  data.latestOrders.map((order) => (
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
                              order.image ||
                              "/images/menu/bakmi-jaya.jpg"
                            }
                            alt={order.menu}
                            width={32}
                            height={32}
                            className="h-[32px] w-[32px] rounded-lg object-cover"
                          />

                          <span className="font-medium text-gray-800">
                            {order.menu}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-3 py-2.5">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="border-b border-gray-100 px-3 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[9px] font-semibold ${statusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-xs text-gray-400"
                    >
                      {loading
                        ? "Memuat pesanan terbaru..."
                        : "Belum ada pesanan pada rentang ini."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
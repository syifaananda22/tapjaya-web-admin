
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Search,
  RefreshCw,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

type OrderStatus = "Menunggu" | "Diproses" | "Siap" | "Selesai";

type Order = {
  id: number;
  orderNumber: string;
  date: string;
  time: string;
  customerName: string;
  tableNumber: string | number | null;
  orderType: "Dine-in" | "Takeaway";
  status: OrderStatus;
  customerNote: string | null;
  adminNote: string | null;
  total: number;
  menu: string | null;
  image: string | null;
};

type OrdersResponse = {
  data?: Order[];
  message?: string;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const QUICK_PERIODS = [
  { value: "semua", label: "Semua Tanggal" },
  { value: "hariini", label: "Hari Ini" },
  { value: "7hari", label: "7 Hari Terakhir" },
  { value: "30hari", label: "30 Hari Terakhir" },
  { value: "6bulan", label: "6 Bulan Terakhir" },
  { value: "1tahun", label: "1 Tahun Terakhir" },
];

const STATUS_OPTIONS = [
  "Menunggu",
  "Diproses",
  "Siap",
  "Selesai",
] as const;

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const tokenKeys = [
    "token",
    "accessToken",
    "access_token",
    "authToken",
    "auth_token",
    "adminToken",
    "admin_token",
    "tapjaya_token",
    "jwt",
  ];

  const nestedKeys = ["admin", "user", "auth", "authData"];

  const tokenFields = [
    "token",
    "accessToken",
    "access_token",
    "authToken",
    "auth_token",
  ];

  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    for (const key of tokenKeys) {
      const raw = storage.getItem(key);

      if (!raw) continue;

      try {
        const parsed: unknown = JSON.parse(raw);

        if (typeof parsed === "string" && parsed.trim()) {
          return parsed.trim();
        }

        if (parsed && typeof parsed === "object") {
          const data = parsed as Record<string, unknown>;

          for (const field of tokenFields) {
            if (
              typeof data[field] === "string" &&
              data[field].trim()
            ) {
              return data[field].trim();
            }
          }
        }
      } catch {
        return raw.trim() || null;
      }
    }

    for (const key of nestedKeys) {
      const raw = storage.getItem(key);

      if (!raw) continue;

      try {
        const parsed: unknown = JSON.parse(raw);

        if (parsed && typeof parsed === "object") {
          const data = parsed as Record<string, unknown>;

          for (const field of tokenFields) {
            if (
              typeof data[field] === "string" &&
              data[field].trim()
            ) {
              return data[field].trim();
            }
          }
        }
      } catch {
        // Abaikan data penyimpanan yang bukan JSON.
      }
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

function getOrderLabel(order: Order): string {
  const number = order.orderNumber?.trim() || String(order.id);

  return number.startsWith("#") ? number : `#${number}`;
}

function getStatusClass(status: OrderStatus): string {
  switch (status) {
    case "Menunggu":
      return "bg-yellow-100 text-yellow-700";

    case "Diproses":
      return "bg-blue-100 text-blue-700";

    case "Siap":
      return "bg-emerald-100 text-emerald-700";

    case "Selesai":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedQuickPeriod, setSelectedQuickPeriod] =
    useState("semua");

  // Tanggal yang sedang diedit pada popup.
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Tanggal yang sudah diterapkan ke permintaan backend.
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>(
    []
  );

  // Mengambil daftar pesanan langsung dari backend.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      setLoading(true);
      setError("");

      const token = getStoredToken();

      if (!token) {
        setOrders([]);
        setError(
          "Token login tidak ditemukan. Silakan login kembali."
        );
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (statusFilter !== "Semua") {
          params.set("status", statusFilter);
        }

        if (appliedStartDate) {
          params.set("startDate", appliedStartDate);
        }

        if (appliedEndDate) {
          params.set("endDate", appliedEndDate);
        }

        const query = params.toString();

        const response = await fetch(
          `${API_BASE_URL}/api/orders${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result: OrdersResponse = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Token tidak valid atau sudah kedaluwarsa. Silakan login kembali."
            );
          }

          throw new Error(
            result.message || "Gagal mengambil data pesanan."
          );
        }

        setOrders(Array.isArray(result.data) ? result.data : []);
        setSelectedOrderIds([]);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setOrders([]);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data pesanan."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => controller.abort();
  }, [
    search,
    statusFilter,
    appliedStartDate,
    appliedEndDate,
    reloadCount,
  ]);

  // Memilih periode tanggal cepat.
  const handleQuickPeriod = useCallback((period: string) => {
    setSelectedQuickPeriod(period);
    setDateError("");

    if (period === "semua") {
      setStartDate("");
      setEndDate("");
      setAppliedStartDate("");
      setAppliedEndDate("");
      setShowDateFilter(false);
      return;
    }

    const today = new Date();
    const start = new Date(today);

    switch (period) {
      case "hariini":
        break;

      case "7hari":
        start.setDate(start.getDate() - 6);
        break;

      case "30hari":
        start.setDate(start.getDate() - 29);
        break;

      case "6bulan":
        start.setMonth(start.getMonth() - 6);
        break;

      case "1tahun":
        start.setFullYear(start.getFullYear() - 1);
        break;

      default:
        return;
    }

    const formattedStart = formatLocalDate(start);
    const formattedEnd = formatLocalDate(today);

    setStartDate(formattedStart);
    setEndDate(formattedEnd);

    // Langsung menerapkan periode dan meminta data baru.
    setAppliedStartDate(formattedStart);
    setAppliedEndDate(formattedEnd);

    setShowDateFilter(false);
  }, []);

  // Menerapkan tanggal manual.
  function applyDateFilter() {
    if (
      startDate &&
      endDate &&
      startDate > endDate
    ) {
      setDateError(
        "Tanggal mulai tidak boleh melebihi tanggal akhir."
      );
      return;
    }

    setDateError("");
    setSelectedQuickPeriod("custom");

    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);

    setShowDateFilter(false);
  }

  function toggleOrderSelection(id: number) {
    setSelectedOrderIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedOrderIds(
      checked ? orders.map((order) => order.id) : []
    );
  }

  const allSelected =
    orders.length > 0 &&
    orders.every((order) => selectedOrderIds.includes(order.id));

  const dateFilterLabel =
    appliedStartDate && appliedEndDate
      ? `${appliedStartDate} - ${appliedEndDate}`
      : appliedStartDate
        ? `Mulai ${appliedStartDate}`
        : appliedEndDate
          ? `Sampai ${appliedEndDate}`
          : "Semua tanggal";

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        <div className="mb-5">
          <AdminHeader
            title="Manajemen Pesanan"
            subtitle="Kelola dan pantau semua pesanan cafe Anda."
          />
        </div>

        {/* FILTER PENCARIAN, TANGGAL, DAN STATUS */}
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
              onChange={(event) => setSearch(event.target.value)}
              className="h-[40px] w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[11px] outline-none transition focus:border-red-400"
            />
          </div>

          {/* FILTER TANGGAL */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDateFilter((value) => !value)}
              aria-expanded={showDateFilter}
              className="flex h-[40px] min-w-[225px] items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600"
            >
              <CalendarDays size={15} />

              <span className="flex-1 text-left">
                {dateFilterLabel}
              </span>

              <ChevronDown size={13} />
            </button>

            {showDateFilter && (
              <div className="absolute left-0 top-11 z-50 w-[295px] max-w-[90vw] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                <p className="mb-3 text-[12px] font-bold text-gray-800">
                  Pilih Periode
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PERIODS.map((period) => (
                    <button
                      type="button"
                      key={period.value}
                      onClick={() => handleQuickPeriod(period.value)}
                      className={`rounded-lg border px-3 py-2 text-[10px] transition ${
                        selectedQuickPeriod === period.value
                          ? "border-red-400 bg-red-50 font-semibold text-red-500"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>

                <div className="my-4 border-t border-gray-100" />

                <p className="mb-2 text-[10px] font-semibold text-gray-600">
                  Pilih Tanggal Manual
                </p>

                <label className="mb-1 block text-[10px] text-gray-500">
                  Tanggal mulai
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setSelectedQuickPeriod("custom");
                    setDateError("");
                  }}
                  className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px] outline-none focus:border-red-400"
                />

                <label className="mb-1 block text-[10px] text-gray-500">
                  Tanggal akhir
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setSelectedQuickPeriod("custom");
                    setDateError("");
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px] outline-none focus:border-red-400"
                />

                {dateError && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {dateError}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPeriod("semua")}
                    className="h-[34px] flex-1 rounded-lg border border-gray-200 text-[10px] text-gray-600 hover:bg-gray-50"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={applyDateFilter}
                    className="h-[34px] flex-1 rounded-lg bg-[#e63131] text-[10px] font-semibold text-white hover:bg-red-600"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FILTER STATUS */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-[40px] min-w-[180px] appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 text-[11px] outline-none focus:border-red-400"
            >
              <option value="Semua">Semua status</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            disabled={loading}
            title="Muat ulang pesanan"
            className="flex h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Muat ulang
          </button>
        </div>

        {/* PESAN KESALAHAN BACKEND */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-[12px] font-semibold text-red-600">
              Data pesanan belum berhasil dimuat.
            </p>

            <p className="mt-1 text-[11px] text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setReloadCount((count) => count + 1)}
              className="mt-3 text-[11px] font-semibold text-red-600 underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* TABEL PESANAN DARI DATABASE */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f7f7f7] text-left text-[11px] font-semibold text-gray-600">
                  <th className="w-[45px] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(event) =>
                        toggleSelectAll(event.target.checked)
                      }
                      aria-label="Pilih semua pesanan"
                      className="h-4 w-4 accent-red-500"
                    />
                  </th>

                  <th className="px-4 py-3">No. Pesanan</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Menu</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-[11px] text-gray-400"
                    >
                      Memuat data pesanan dari server...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-[11px] text-gray-400"
                    >
                      {error
                        ? "Data pesanan belum dapat ditampilkan."
                        : "Pesanan tidak ditemukan pada filter ini."}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                    >
                      <td className="border-b border-gray-100 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          aria-label={`Pilih pesanan ${getOrderLabel(order)}`}
                          className="h-4 w-4 accent-red-500"
                        />
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 font-medium">
                        {getOrderLabel(order)}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        <div>{order.time || "-"}</div>
                        <div className="mt-1 text-[9px] text-gray-400">
                          {order.date || "-"}
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-3">
                          {order.image ? (
                            <img
                              src={order.image}
                              alt={order.menu || "Foto menu"}
                              className="h-[36px] w-[36px] rounded-lg border border-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-lg bg-gray-100 text-[8px] text-gray-400">
                              Menu
                            </div>
                          )}

                          <div>
                            <div className="font-medium text-gray-800">
                              {order.menu || "Tidak ada menu"}
                            </div>

                            <div className="mt-1 text-[9px] text-gray-400">
                              {order.customerName || "Pelanggan"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        {formatCurrency(Number(order.total) || 0)}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3">
                        <span
                          className={`inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-[9px] font-semibold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && !error && orders.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 text-[10px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Menampilkan {orders.length} pesanan
              </span>

              {selectedOrderIds.length > 0 && (
                <span>
                  {selectedOrderIds.length} pesanan dipilih
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

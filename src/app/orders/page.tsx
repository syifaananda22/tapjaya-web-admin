
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  Clock3,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

type OrderStatus =
  | "Menunggu"
  | "Diproses"
  | "Siap"
  | "Selesai";

type ViewMode = "table" | "cards";

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

const configuredApiUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE_URL = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl.slice(0, -4)
  : configuredApiUrl;

const QUICK_PERIODS = [
  { value: "semua", label: "Semua Tanggal" },
  { value: "hariini", label: "Hari Ini" },
  { value: "7hari", label: "7 Hari Terakhir" },
  { value: "30hari", label: "30 Hari Terakhir" },
  { value: "6bulan", label: "6 Bulan Terakhir" },
  { value: "1tahun", label: "1 Tahun Terakhir" },
];

const STATUS_OPTIONS: OrderStatus[] = [
  "Menunggu",
  "Diproses",
  "Siap",
  "Selesai",
];

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

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

  const nestedKeys = [
    "admin",
    "user",
    "auth",
    "authData",
  ];

  const tokenFields = [
    "token",
    "accessToken",
    "access_token",
    "authToken",
    "auth_token",
  ];

  const storages = [
    window.localStorage,
    window.sessionStorage,
  ];

  for (const storage of storages) {
    for (const key of tokenKeys) {
      const raw = storage.getItem(key);

      if (!raw) continue;

      try {
        const parsed: unknown = JSON.parse(raw);

        if (
          typeof parsed === "string" &&
          parsed.trim()
        ) {
          return parsed.trim();
        }

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          const data =
            parsed as Record<string, unknown>;

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

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          const data =
            parsed as Record<string, unknown>;

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
        // Abaikan nilai yang bukan JSON.
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
  }).format(Number(value) || 0);
}

function getOrderLabel(order: Order): string {
  const number =
    order.orderNumber?.trim() || String(order.id);

  return number.startsWith("#")
    ? number
    : `#${number}`;
}

function getStatusClass(
  status: OrderStatus
): string {
  switch (status) {
    case "Menunggu":
      return "bg-yellow-100 text-yellow-700";
    case "Diproses":
      return "bg-blue-100 text-blue-700";
    case "Siap":
      return "bg-purple-100 text-purple-700";
    case "Selesai":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] =
    useState<ViewMode>("table");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("Semua");

  const [showDateFilter, setShowDateFilter] =
    useState(false);

  const [
    selectedQuickPeriod,
    setSelectedQuickPeriod,
  ] = useState("semua");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [
    appliedStartDate,
    setAppliedStartDate,
  ] = useState("");

  const [
    appliedEndDate,
    setAppliedEndDate,
  ] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  const [
    selectedOrderIds,
    setSelectedOrderIds,
  ] = useState<number[]>([]);

  // Ambil ulang data secara otomatis.
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (
        document.visibilityState === "visible"
      ) {
        setReloadCount((count) => count + 1);
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  // Ambil data asli dan dummy dari database.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
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
        // Jangan tampilkan loading penuh saat polling.
        if (orders.length === 0) {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (statusFilter !== "Semua") {
          params.set("status", statusFilter);
        }

        if (appliedStartDate) {
          params.set(
            "startDate",
            appliedStartDate
          );
        }

        if (appliedEndDate) {
          params.set("endDate", appliedEndDate);
        }

        const query = params.toString();

        const response = await fetch(
          `${API_BASE_URL}/api/orders${
            query ? `?${query}` : ""
          }`,
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

        const result: OrdersResponse =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            response.status === 401 ||
              response.status === 403
              ? "Sesi admin berakhir. Silakan login kembali."
              : result.message ||
                  "Gagal mengambil data pesanan."
          );
        }

        if (controller.signal.aborted) return;

        setOrders(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil pesanan."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => controller.abort();

    // Polling memakai data terbaru dari server.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    statusFilter,
    appliedStartDate,
    appliedEndDate,
    reloadCount,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedOrderIds([]);
  }, [
    search,
    statusFilter,
    appliedStartDate,
    appliedEndDate,
  ]);

  const handleQuickPeriod = useCallback(
    (period: string) => {
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
          start.setFullYear(
            start.getFullYear() - 1
          );
          break;
        default:
          return;
      }

      const from = formatLocalDate(start);
      const to = formatLocalDate(today);

      setStartDate(from);
      setEndDate(to);
      setAppliedStartDate(from);
      setAppliedEndDate(to);
      setShowDateFilter(false);
    },
    []
  );

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

  const totalPages = Math.max(
    1,
    Math.ceil(orders.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedOrders = useMemo(
    () =>
      orders.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
      ),
    [orders, safeCurrentPage]
  );

  const startItem =
    orders.length === 0
      ? 0
      : (safeCurrentPage - 1) *
          itemsPerPage +
        1;

  const endItem = Math.min(
    safeCurrentPage * itemsPerPage,
    orders.length
  );

  function toggleOrderSelection(id: number) {
    setSelectedOrderIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function toggleSelectAll(checked: boolean) {
    const currentPageIds =
      paginatedOrders.map((order) => order.id);

    setSelectedOrderIds((previous) =>
      checked
        ? Array.from(
            new Set([
              ...previous,
              ...currentPageIds,
            ])
          )
        : previous.filter(
            (id) => !currentPageIds.includes(id)
          )
    );
  }

  const allSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((order) =>
      selectedOrderIds.includes(order.id)
    );

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

        {/* PENCARIAN DAN FILTER */}
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-[40px] w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[11px] outline-none focus:border-red-400"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowDateFilter((value) => !value)
              }
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
                      onClick={() =>
                        handleQuickPeriod(period.value)
                      }
                      className={`rounded-lg border px-3 py-2 text-[10px] ${
                        selectedQuickPeriod ===
                        period.value
                          ? "border-red-400 bg-red-50 font-semibold text-red-500"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>

                <div className="my-4 border-t" />

                <p className="mb-2 text-[10px] font-semibold">
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
                  className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px]"
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
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px]"
                />

                {dateError && (
                  <p className="mt-2 text-[10px] text-red-500">
                    {dateError}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickPeriod("semua")
                    }
                    className="h-[34px] flex-1 rounded-lg border text-[10px]"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={applyDateFilter}
                    className="h-[34px] flex-1 rounded-lg bg-[#e63131] text-[10px] font-semibold text-white"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-[40px] min-w-[180px] appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 text-[11px]"
            >
              <option value="Semua">
                Semua status
              </option>
              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
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
            onClick={() =>
              setReloadCount((count) => count + 1)
            }
            title="Muat ulang pesanan"
            className="flex h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-600"
          >
            <RefreshCw size={14} />
            Muat ulang
          </button>
        </div>

        {/* PILIH TAMPILAN */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500">
            {loading
              ? "Memuat pesanan..."
              : `${orders.length} pesanan ditemukan`}
          </p>

          <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() =>
                setViewMode("table")
              }
              className={`flex h-8 items-center gap-2 rounded-md px-3 text-[11px] font-semibold ${
                viewMode === "table"
                  ? "bg-[#e63131] text-white"
                  : "text-gray-500"
              }`}
            >
              <List size={15} />
              Tabel
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode("cards")
              }
              className={`flex h-8 items-center gap-2 rounded-md px-3 text-[11px] font-semibold ${
                viewMode === "cards"
                  ? "bg-[#e63131] text-white"
                  : "text-gray-500"
              }`}
            >
              <LayoutGrid size={15} />
              Kartu
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-[12px] font-semibold text-red-600">
              Gagal memperbarui pesanan
            </p>
            <p className="mt-1 text-[11px] text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* TAMPILAN TABEL */}
        {viewMode === "table" && (
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
                          toggleSelectAll(
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 accent-red-500"
                      />
                    </th>
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
                  {loading && orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-[11px] text-gray-400"
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-[11px] text-gray-400"
                      >
                        Pesanan tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="text-[11px] text-gray-700 hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedOrderIds.includes(
                              order.id
                            )}
                            onChange={() =>
                              toggleOrderSelection(
                                order.id
                              )
                            }
                            className="h-4 w-4 accent-red-500"
                          />
                        </td>

                        <td className="border-b border-gray-100 px-4 py-3 font-medium">
                          {getOrderLabel(order)}
                        </td>

                        <td className="border-b border-gray-100 px-4 py-3">
                          <div>
                            {order.time || "-"}
                          </div>
                          <div className="mt-1 text-[9px] text-gray-400">
                            {order.date || "-"}
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {order.menu ||
                              "Tidak ada menu"}
                          </div>
                          <div className="mt-1 text-[9px] text-gray-400">
                            {order.customerName ||
                              "Pelanggan"}
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-4 py-3">
                          {formatCurrency(order.total)}
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
                            className="inline-flex h-[30px] items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-[10px] font-medium text-gray-700 hover:text-red-500"
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

            {selectedOrderIds.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400">
                {selectedOrderIds.length} pesanan dipilih
              </div>
            )}
          </div>
        )}

        {/* TAMPILAN KARTU */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4">
                  <div>
                    <p className="text-[10px] text-gray-400">
                      Nomor Pesanan
                    </p>
                    <h3 className="mt-1 break-all text-[13px] font-bold text-gray-800">
                      {getOrderLabel(order)}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[9px] font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={15}
                      className="mt-0.5 text-gray-400"
                    />
                    <div>
                      <p className="text-[10px] text-gray-400">
                        Waktu Pesanan
                      </p>
                      <p className="mt-1 text-[11px] font-medium">
                        {order.date}, {order.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <UserRound
                      size={15}
                      className="mt-0.5 text-gray-400"
                    />
                    <div>
                      <p className="text-[10px] text-gray-400">
                        Pelanggan
                      </p>
                      <p className="mt-1 text-[11px] font-semibold">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-500">
                        {order.orderType === "Dine-in"
                          ? `Makan di Tempat · Meja ${
                              order.tableNumber ?? "-"
                            }`
                          : "Bawa Pulang"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <UtensilsCrossed
                      size={15}
                      className="mt-0.5 text-gray-400"
                    />
                    <div>
                      <p className="text-[10px] text-gray-400">
                        Menu Pesanan
                      </p>
                      <p className="mt-1 text-[11px] font-semibold">
                        {order.menu ||
                          "Tidak ada menu"}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        Lihat rincian lengkap pada Detail
                      </p>
                    </div>
                  </div>

                  {order.customerNote && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold text-gray-500">
                        Catatan Pelanggan
                      </p>
                      <p className="mt-1 text-[10px] text-gray-600">
                        {order.customerNote}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">
                        Total Pesanan
                      </span>
                      <span className="text-[14px] font-bold text-gray-800">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex h-9 w-full items-center justify-center rounded-lg bg-[#e63131] text-[11px] font-semibold text-white hover:bg-red-600"
                  >
                    Lihat Detail Pesanan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && orders.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-gray-500">
              Menampilkan {startItem}-{endItem} dari{" "}
              {orders.length} pesanan
            </p>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() =>
                  setCurrentPage(
                    safeCurrentPage - 1
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-[11px] disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(
                      page - safeCurrentPage
                    ) <= 1
                )
                .map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`h-8 min-w-8 rounded-lg px-2 text-[11px] ${
                      safeCurrentPage === page
                        ? "bg-[#e63131] text-white"
                        : "border border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                disabled={
                  safeCurrentPage >= totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    safeCurrentPage + 1
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-[11px] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

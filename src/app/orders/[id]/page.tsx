"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Save,
  X,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

type OrderStatus = "Menunggu" | "Diproses" | "Siap" | "Selesai";

type OrderItem = {
  id: number;
  productId: number | null;
  name: string;
  image: string | null;
  quantity: number;
  price: number;
  subtotal: number;
};

type OrderDetail = {
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
  items: OrderItem[];
};

type ApiResponse<T> = {
  message?: string;
  data?: T;
};

const configuredApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const API_BASE_URL = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

const STATUS_STEPS: OrderStatus[] = [
  "Menunggu",
  "Diproses",
  "Siap",
  "Selesai",
];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatOrderDate(value: string): string {
  if (!value) return "-";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function readResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        result?.message ||
        "Sesi login tidak valid. Silakan login kembali."
      );
    }

    throw new Error(
      result?.message || `Permintaan gagal (${response.status}).`
    );
  }

  return result as ApiResponse<T>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = params.id;
  const orderIdentifier = Array.isArray(rawId) ? rawId[0] : rawId;

  const [order, setOrder] = useState<OrderDetail | null>(null);

  const [status, setStatus] =
    useState<OrderStatus>("Menunggu");

  const [savedStatus, setSavedStatus] =
    useState<OrderStatus>("Menunggu");

  const [adminNote, setAdminNote] = useState("");
  const [savedNote, setSavedNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrder = useCallback(async () => {
    if (!orderIdentifier) {
      setError("Nomor pesanan tidak valid.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Token login tidak ditemukan. Silakan login kembali."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/orders/${encodeURIComponent(orderIdentifier)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await readResponse<OrderDetail>(response);
      const data = result.data;

      if (!data) {
        throw new Error("Data detail pesanan tidak ditemukan.");
      }

      setOrder(data);
      setStatus(data.status);
      setSavedStatus(data.status);
      setAdminNote(data.adminNote ?? "");
      setSavedNote(data.adminNote ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil detail pesanan."
      );
    } finally {
      setLoading(false);
    }
  }, [orderIdentifier]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const hasChanges =
    status !== savedStatus || adminNote !== savedNote;

  async function handleUpdateStatus() {
    if (!order || !hasChanges || saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(
          "Token login tidak ditemukan. Silakan login kembali."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/orders/${encodeURIComponent(order.orderNumber)}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            adminNote,
          }),
        }
      );

      const result = await readResponse<OrderDetail>(response);
      const updatedOrder = result.data;

      if (!updatedOrder) {
        throw new Error(
          "Data pesanan yang diperbarui tidak ditemukan."
        );
      }

      setOrder(updatedOrder);
      setStatus(updatedOrder.status);
      setSavedStatus(updatedOrder.status);
      setAdminNote(updatedOrder.adminNote ?? "");
      setSavedNote(updatedOrder.adminNote ?? "");

      setSuccess(
        result.message || "Status pesanan berhasil diperbarui."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui status pesanan."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setStatus(savedStatus);
    setAdminNote(savedNote);
    setError("");
    setSuccess("");
  }

  const currentIndex = STATUS_STEPS.indexOf(status);
  const savedIndex = STATUS_STEPS.indexOf(savedStatus);

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        <div className="mb-5">
          <AdminHeader
            title="Detail Pesanan"
            subtitle="Lihat detail pesanan dan kelola status pesanan."
            backHref="/orders"
          />
        </div>

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <LoaderCircle
                className="animate-spin"
                size={20}
              />
              Memuat detail pesanan...
            </div>
          </div>
        )}

        {!loading && error && !order && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3 text-red-600">
              <AlertCircle
                className="mt-0.5 shrink-0"
                size={22}
              />

              <div>
                <h2 className="font-semibold">
                  Detail pesanan gagal dimuat
                </h2>

                <p className="mt-2 text-sm">{error}</p>

                <button
                  type="button"
                  onClick={() => void loadOrder()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  <RefreshCw size={15} />
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && order && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div>
                <p className="text-xs text-gray-500">
                  Nomor Pesanan
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  #{order.orderNumber}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {formatOrderDate(order.date)} · {order.time}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusClass(savedStatus)}`}
              >
                {savedStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h2 className="mb-5 text-sm font-bold">
                    Informasi Pesanan
                  </h2>

                  <div className="grid grid-cols-[140px_1fr] gap-y-4 text-xs">
                    <span className="text-gray-500">
                      No. Pesanan
                    </span>
                    <span className="font-semibold">
                      #{order.orderNumber}
                    </span>

                    <span className="text-gray-500">
                      Waktu Pesanan
                    </span>
                    <span>
                      {formatOrderDate(order.date)}, {order.time}
                    </span>

                    <span className="text-gray-500">
                      Pelanggan
                    </span>
                    <span className="font-semibold">
                      {order.customerName}
                    </span>

                    <span className="text-gray-500">
                      Tipe Pesanan
                    </span>
                    <span>{order.orderType}</span>

                    <span className="text-gray-500">
                      No. Meja
                    </span>
                    <span>{order.tableNumber ?? "-"}</span>

                    <span className="text-gray-500">
                      Status Tersimpan
                    </span>
                    <span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${getStatusClass(savedStatus)}`}
                      >
                        {savedStatus}
                      </span>
                    </span>

                    <span className="text-gray-500">
                      Catatan Pelanggan
                    </span>
                    <span className="break-words">
                      {order.customerNote || "-"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h2 className="mb-5 text-sm font-bold">
                    Daftar Menu
                  </h2>

                  {order.items?.length > 0 ? (
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                                Menu
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="break-words text-xs font-semibold">
                                {item.name}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-500">
                                {formatCurrency(item.price)}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-500">
                                Jumlah: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 text-xs font-semibold">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Belum ada detail menu pada pesanan ini.
                    </p>
                  )}

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total Pesanan</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold">
                      Update Status Pesanan
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Pilih status, lalu simpan perubahan.
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold ${getStatusClass(savedStatus)}`}
                  >
                    {savedStatus}
                  </span>
                </div>

                <div className="mt-6">
                  {STATUS_STEPS.map((item, index) => {
                    const isCurrent = index === currentIndex;
                    const isDone = index < currentIndex;
                    const isSaved = item === savedStatus;

                    return (
                      <button
                        type="button"
                        key={item}
                        disabled={saving}
                        onClick={() => {
                          setStatus(item);
                          setError("");
                          setSuccess("");
                        }}
                        className="group relative flex w-full items-start gap-4 pb-6 text-left last:pb-0 disabled:cursor-not-allowed"
                      >
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 transition ${isCurrent
                                ? "scale-105 border-red-500 bg-white"
                                : isDone
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-300 bg-white group-hover:border-red-300"
                              }`}
                          >
                            {isDone && (
                              <Check
                                size={16}
                                strokeWidth={3}
                                className="text-white"
                              />
                            )}

                            {isCurrent && (
                              <div className="h-3 w-3 rounded-full bg-red-500" />
                            )}
                          </div>

                          {index < STATUS_STEPS.length - 1 && (
                            <div
                              className={`absolute top-9 h-[42px] w-[3px] ${index < currentIndex
                                  ? "bg-red-400"
                                  : "bg-gray-300"
                                }`}
                            />
                          )}
                        </div>

                        <div className="pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={`text-xs font-semibold ${isCurrent
                                  ? "text-red-500"
                                  : "text-gray-800"
                                }`}
                            >
                              {item}
                            </p>

                            {isSaved && (
                              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-600">
                                Status tersimpan
                              </span>
                            )}

                            {isCurrent && !isSaved && (
                              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-semibold text-orange-600">
                                Belum disimpan
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-[10px] text-gray-400">
                            {item === "Menunggu" &&
                              "Pesanan masuk dan menunggu diproses."}
                            {item === "Diproses" &&
                              "Pesanan sedang disiapkan."}
                            {item === "Siap" &&
                              "Pesanan siap disajikan atau diambil."}
                            {item === "Selesai" &&
                              "Pesanan telah selesai."}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Clock3 size={15} className="text-gray-500" />
                    <p className="text-xs text-gray-500">
                      Status yang dipilih
                    </p>
                  </div>

                  <p className="mt-1 text-sm font-bold text-gray-800">
                    {status}
                  </p>

                  {status !== savedStatus && (
                    <p className="mt-1 text-[10px] text-orange-600">
                      Perubahan belum tersimpan ke database.
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="adminNote"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Catatan Admin{" "}
                    <span className="font-normal text-gray-400">
                      (Opsional)
                    </span>
                  </label>

                  <textarea
                    id="adminNote"
                    value={adminNote}
                    maxLength={1000}
                    disabled={saving}
                    onChange={(event) => {
                      setAdminNote(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="Masukkan catatan admin..."
                    className="h-28 w-full resize-y rounded-lg border border-gray-200 p-3 text-xs outline-none transition placeholder:text-gray-400 focus:border-red-400 disabled:bg-gray-50"
                  />

                  <div className="mt-1 flex justify-end">
                    <span className="text-[10px] text-gray-400">
                      {adminNote.length}/1000 karakter
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-red-600">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    <p className="text-xs">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-3 text-green-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-semibold">
                        Perubahan berhasil disimpan.
                      </p>
                      <p className="mt-1 text-[11px]">
                        Status pesanan sekarang: {savedStatus}.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void handleUpdateStatus()}
                  disabled={!hasChanges || saving}
                  className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold text-white transition ${hasChanges && !saving
                      ? "bg-[#e63131] hover:bg-[#ca2929]"
                      : "cursor-not-allowed bg-red-300"
                    }`}
                >
                  {saving ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!hasChanges || saving}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <X size={15} />
                  Batalkan
                </button>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      Progress Pesanan
                    </span>

                    <span className="text-[10px] font-semibold text-red-500">
                      {Math.round(
                        ((savedIndex + 1) / STATUS_STEPS.length) * 100
                      )}
                      %
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-300"
                      style={{
                        width: `${((savedIndex + 1) / STATUS_STEPS.length) * 100
                          }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import {
  Check,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

import {
  orders,
  type OrderStatus,
} from "@/data/orders";

export default function OrderDetailPage() {
  const params = useParams();

  const orderId =
    params.id as string;

  const order = orders.find(
    (item) =>
      item.id === orderId
  );

  /*
   * status = status yang sedang
   * dipilih admin
   */
  const [status, setStatus] =
    useState<OrderStatus>(
      order?.status ??
        "Menunggu"
    );

  /*
   * savedStatus = status yang
   * benar-benar sudah disimpan
   */
  const [
    savedStatus,
    setSavedStatus,
  ] = useState<OrderStatus>(
    order?.status ??
      "Menunggu"
  );

  const [
    adminNote,
    setAdminNote,
  ] = useState("");

  const [
    savedNote,
    setSavedNote,
  ] = useState("");

  const [
    showSuccess,
    setShowSuccess,
  ] = useState(false);

  /*
   * LOAD STATUS YANG PERNAH
   * DISIMPAN DARI BROWSER
   */
  useEffect(() => {
    if (!orderId) return;

    const storedStatus =
      localStorage.getItem(
        `tapjaya-order-${orderId}-status`
      );

    const storedNote =
      localStorage.getItem(
        `tapjaya-order-${orderId}-note`
      );

    if (storedStatus) {
      const validStatus =
        storedStatus as OrderStatus;

      setStatus(validStatus);
      setSavedStatus(
        validStatus
      );
    }

    if (storedNote) {
      setAdminNote(
        storedNote
      );

      setSavedNote(
        storedNote
      );
    }
  }, [orderId]);

  /*
   * FORMAT RUPIAH
   */
  const formatCurrency = (
    value: number
  ) =>
    new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits:
          0,
      }
    ).format(value);

  /*
   * URUTAN STATUS
   */
  const statusSteps: OrderStatus[] =
    [
      "Menunggu",
      "Diproses",
      "Siap",
      "Selesai",
    ];

  const currentIndex =
    statusSteps.indexOf(
      status
    );

  const savedIndex =
    statusSteps.indexOf(
      savedStatus
    );

  /*
   * CEK APAKAH ADA
   * PERUBAHAN
   */
  const hasChanges =
    status !==
      savedStatus ||
    adminNote !==
      savedNote;

  /*
   * SAVE STATUS
   */
  const handleUpdateStatus =
    () => {
      setSavedStatus(
        status
      );

      setSavedNote(
        adminNote
      );

      localStorage.setItem(
        `tapjaya-order-${orderId}-status`,
        status
      );

      localStorage.setItem(
        `tapjaya-order-${orderId}-note`,
        adminNote
      );

      setShowSuccess(
        true
      );

      setTimeout(() => {
        setShowSuccess(
          false
        );
      }, 3000);
    };

  /*
   * CANCEL
   */
  const handleCancel =
    () => {
      setStatus(
        savedStatus
      );

      setAdminNote(
        savedNote
      );

      setShowSuccess(
        false
      );
    };

  /*
   * STATUS BADGE
   */
  const statusBadge = (
    value: OrderStatus
  ) => {
    switch (value) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-600";

      case "Diproses":
        return "bg-blue-100 text-blue-600";

      case "Siap":
        return "bg-emerald-100 text-emerald-600";

      case "Selesai":
        return "bg-green-100 text-green-600";

      default:
        return "";
    }
  };

  /*
   * ORDER TIDAK ADA
   */
  if (!order) {
    return (
      <main className="flex min-h-screen bg-[#f5f5f5]">
        <Sidebar />

        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm">
            Pesanan tidak
            ditemukan.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        {/* =====================
            HEADER
        ====================== */}

        <div className="mb-5">
          <AdminHeader
            title="Detail Pesanan"
            subtitle="Lihat detail pesanan dan ubah jika diperlukan."
            backHref="/orders"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.9fr]">
          {/* =====================
              LEFT
          ====================== */}

          <div className="space-y-4">
            {/* INFORMASI PESANAN */}

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[14px] font-bold">
                Informasi
                Pesanan
              </h2>

              <div className="grid grid-cols-[145px_1fr] gap-y-3 text-[11px]">
                <span className="text-gray-500">
                  No. Pesanan
                </span>

                <span className="font-semibold">
                  #{order.id}
                </span>

                <span className="text-gray-500">
                  Waktu Pesanan
                </span>

                <span>
                  2 Oktober 2026,{" "}
                  {order.time}
                </span>

                <span className="text-gray-500">
                  Pelanggan
                </span>

                <span className="font-semibold">
                  {
                    order.customerName
                  }
                </span>

                <span className="text-gray-500">
                  Tipe Pesanan
                </span>

                <span>
                  {
                    order.orderType
                  }
                </span>

                <span className="text-gray-500">
                  No. Meja
                </span>

                <span>
                  {
                    order.tableNumber
                  }
                </span>

                <span className="text-gray-500">
                  Status
                </span>

                <span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[9px] font-semibold ${statusBadge(
                      savedStatus
                    )}`}
                  >
                    {
                      savedStatus
                    }
                  </span>
                </span>

                <span className="text-gray-500">
                  Catatan
                  Pelanggan
                </span>

                <span>
                  {order.note ??
                    "-"}
                </span>
              </div>
            </div>

            {/* =====================
                DAFTAR MENU
            ====================== */}

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[14px] font-bold">
                Daftar Menu
              </h2>

              <div className="space-y-4">
                {order.items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          width={
                            52
                          }
                          height={
                            52
                          }
                          className="h-[52px] w-[52px] rounded-lg object-cover"
                        />

                        <div>
                          <p className="text-[12px] font-semibold">
                            {
                              item.name
                            }
                          </p>

                          <p className="mt-1 text-[10px] text-gray-500">
                            {formatCurrency(
                              item.price
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-10 text-[11px]">
                        <span>
                          {
                            item.quantity
                          }
                          x
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(
                            item.price *
                              item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-[11px]">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(
                      order.total
                    )}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-[12px] font-bold">
                  <span>
                    Total
                  </span>

                  <span>
                    {formatCurrency(
                      order.total
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================
              RIGHT
          ====================== */}

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[14px] font-bold">
                  Update Status
                  Pesanan
                </h2>

                <p className="mt-1 text-[9px] text-gray-400">
                  Pilih status
                  pesanan terbaru.
                </p>
              </div>

              {/* CURRENT STATUS */}

              <span
                className={`rounded-full px-3 py-1 text-[9px] font-semibold ${statusBadge(
                  savedStatus
                )}`}
              >
                Status:{" "}
                {savedStatus}
              </span>
            </div>

            {/* =====================
                STATUS STEPPER
            ====================== */}

            <div className="mt-6">
              {statusSteps.map(
                (
                  item,
                  index
                ) => {
                  const isCurrent =
                    index ===
                    currentIndex;

                  const isDone =
                    index <
                    currentIndex;

                  const isFuture =
                    index >
                    currentIndex;

                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        setStatus(
                          item
                        );

                        setShowSuccess(
                          false
                        );
                      }}
                      className="group relative flex w-full items-start gap-4 pb-6 text-left last:pb-2"
                    >
                      {/* STEP */}

                      <div className="relative flex flex-col items-center">
                        {/* CIRCLE */}

                        <div
                          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-[4px] transition-all ${
                            isCurrent
                              ? "scale-105 border-red-500 bg-white shadow-sm"
                              : isDone
                                ? "border-red-500 bg-red-500"
                                : "border-gray-300 bg-white group-hover:border-red-300"
                          }`}
                        >
                          {/* SELESAI STEP */}

                          {isDone && (
                            <Check
                              size={
                                16
                              }
                              strokeWidth={
                                3
                              }
                              className="text-white"
                            />
                          )}

                          {/* CURRENT */}

                          {isCurrent && (
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                          )}
                        </div>

                        {/* LINE */}

                        {index !==
                          statusSteps.length -
                            1 && (
                          <div
                            className={`absolute top-9 h-[42px] w-[3px] transition-colors ${
                              index <
                              currentIndex
                                ? "bg-red-400"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>

                      {/* TEXT */}

                      <div className="pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-[12px] font-semibold transition ${
                              isCurrent
                                ? "text-red-500"
                                : isFuture
                                  ? "text-gray-700"
                                  : "text-gray-900"
                            }`}
                          >
                            {item}
                          </p>

                          {/* DIPILIH TAPI BELUM DISIMPAN */}

                          {isCurrent &&
                            status !==
                              savedStatus && (
                              <span className="rounded-full bg-orange-50 px-2 py-[2px] text-[8px] font-semibold text-orange-500">
                                Belum
                                disimpan
                              </span>
                            )}

                          {/* STATUS YANG TERSIMPAN */}

                          {item ===
                            savedStatus && (
                            <span className="rounded-full bg-green-50 px-2 py-[2px] text-[8px] font-semibold text-green-600">
                              Status
                              saat ini
                            </span>
                          )}
                        </div>

                        {item ===
                          "Menunggu" && (
                          <p className="mt-1 text-[9px] text-gray-400">
                            Pesanan
                            masuk dan
                            menunggu
                            diproses.
                          </p>
                        )}

                        {item ===
                          "Diproses" && (
                          <p className="mt-1 text-[9px] text-gray-400">
                            Pesanan
                            sedang
                            disiapkan.
                          </p>
                        )}

                        {item ===
                          "Siap" && (
                          <p className="mt-1 text-[9px] text-gray-400">
                            Pesanan
                            sudah siap
                            disajikan
                            atau
                            diambil.
                          </p>
                        )}

                        {item ===
                          "Selesai" && (
                          <p className="mt-1 text-[9px] text-gray-400">
                            Pesanan
                            telah
                            selesai.
                          </p>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* =====================
                STATUS SUMMARY
            ====================== */}

            <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock3
                  size={14}
                  className="text-gray-500"
                />

                <p className="text-[9px] text-gray-500">
                  Status yang
                  dipilih
                </p>
              </div>

              <p className="mt-1 text-[12px] font-bold text-gray-800">
                {status}
              </p>

              {status !==
                savedStatus && (
                <p className="mt-1 text-[8px] font-medium text-orange-500">
                  Klik Simpan
                  Perubahan untuk
                  menerapkan status
                  ini.
                </p>
              )}
            </div>

            {/* =====================
                CATATAN ADMIN
            ====================== */}

            <div className="mt-5">
              <label className="mb-1.5 block text-[11px] font-semibold">
                Catatan Admin{" "}
                <span className="font-normal text-gray-400">
                  (Opsional)
                </span>
              </label>

              <textarea
                value={
                  adminNote
                }
                onChange={(e) => {
                  setAdminNote(
                    e.target.value
                  );

                  setShowSuccess(
                    false
                  );
                }}
                placeholder="Contoh: Pesanan sedang dibuat dan akan segera siap."
                className="h-[95px] w-full resize-none rounded-lg border border-gray-200 p-3 text-[11px] outline-none transition placeholder:text-gray-400 focus:border-red-400"
              />

              <div className="mt-1 flex justify-end">
                <span className="text-[8px] text-gray-400">
                  {
                    adminNote.length
                  }{" "}
                  karakter
                </span>
              </div>
            </div>

            {/* =====================
                SUCCESS
            ====================== */}

            {showSuccess && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-3 text-green-600">
                <CheckCircle2
                  size={16}
                  className="mt-[1px] shrink-0"
                />

                <div>
                  <p className="text-[10px] font-semibold">
                    Status berhasil
                    diperbarui.
                  </p>

                  <p className="mt-1 text-[9px]">
                    Pesanan sekarang
                    berstatus{" "}
                    <strong>
                      {
                        savedStatus
                      }
                    </strong>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* =====================
                SAVE
            ====================== */}

            <button
              type="button"
              onClick={
                handleUpdateStatus
              }
              disabled={!hasChanges}
              className={`mt-5 h-[44px] w-full rounded-lg text-[11px] font-semibold text-white transition ${
                hasChanges
                  ? "bg-[#e63131] hover:bg-[#ca2929]"
                  : "cursor-not-allowed bg-red-300"
              }`}
            >
              Simpan Perubahan
            </button>

            {/* =====================
                CANCEL
            ====================== */}

            <button
              type="button"
              onClick={
                handleCancel
              }
              disabled={!hasChanges}
              className={`mt-2 h-[42px] w-full rounded-lg border text-[11px] font-semibold transition ${
                hasChanges
                  ? "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
              }`}
            >
              Batalkan
            </button>

            {/* PROGRESS */}

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] text-gray-400">
                  Progress Pesanan
                </span>

                <span className="text-[9px] font-semibold text-red-500">
                  {Math.round(
                    ((savedIndex +
                      1) /
                      statusSteps.length) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="h-[5px] overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      ((savedIndex +
                        1) /
                        statusSteps.length) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
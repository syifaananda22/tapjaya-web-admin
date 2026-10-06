"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

import {
  orders,
  type OrderStatus,
} from "@/data/orders";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const order = orders.find(
    (item) => item.id === orderId
  );

  const [status, setStatus] =
    useState<OrderStatus>(
      order?.status ?? "Menunggu"
    );

  const [savedStatus, setSavedStatus] =
    useState<OrderStatus>(
      order?.status ?? "Menunggu"
    );

  const [adminNote, setAdminNote] =
    useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const statusSteps: OrderStatus[] = [
    "Menunggu",
    "Diproses",
    "Siap",
    "Selesai",
  ];

  const currentIndex =
    statusSteps.indexOf(status);

  const handleUpdateStatus = () => {
    setSavedStatus(status);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleCancel = () => {
    setStatus(savedStatus);
    setAdminNote("");
    setShowSuccess(false);
  };

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
    }
  };

  if (!order) {
    return (
      <main className="flex min-h-screen bg-[#f5f5f5]">
        <Sidebar />

        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm">
            Pesanan tidak ditemukan.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        {/* HEADER */}
        <div className="mb-5">
          <AdminHeader
            title="Detail Pesanan"
            subtitle="Lihat detail pesanan dan ubah jika diperlukan."
            backHref="/orders"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_0.9fr]">
          {/* LEFT */}
          <div className="space-y-4">
            {/* INFORMASI PESANAN */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[14px] font-bold">
                Informasi Pesanan
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
                  {order.customerName}
                </span>

                <span className="text-gray-500">
                  Tipe Pesanan
                </span>

                <span>
                  {order.orderType}
                </span>

                <span className="text-gray-500">
                  No. Meja
                </span>

                <span>
                  {order.tableNumber}
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
                    {savedStatus}
                  </span>
                </span>

                <span className="text-gray-500">
                  Catatan Pelanggan
                </span>

                <span>
                  {order.note ?? "-"}
                </span>
              </div>
            </div>

            {/* DAFTAR MENU */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[14px] font-bold">
                Daftar Menu
              </h2>

              <div className="space-y-4">
                {order.items.map(
                  (item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={52}
                          height={52}
                          className="h-[52px] w-[52px] rounded-lg object-cover"
                        />

                        <div>
                          <p className="text-[12px] font-semibold">
                            {item.name}
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
                          {item.quantity}x
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
                  <span>Subtotal</span>

                  <span>
                    {formatCurrency(
                      order.total
                    )}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-[12px] font-bold">
                  <span>Total</span>

                  <span>
                    {formatCurrency(
                      order.total
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">
              Update Status Pesanan
            </h2>

            {/* STATUS STEPPER */}
            <div className="mt-5">
              {statusSteps.map(
                (item, index) => {
                  const active =
                    index <= currentIndex;

                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() =>
                        setStatus(item)
                      }
                      className="relative flex w-full items-start gap-3 pb-5 text-left last:pb-3"
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-[4px] ${
                            active
                              ? "border-red-500 bg-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {index ===
                            currentIndex && (
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                          )}
                        </div>

                        {index !==
                          statusSteps.length -
                            1 && (
                          <div
                            className={`absolute top-8 h-[30px] w-[3px] ${
                              index <
                              currentIndex
                                ? "bg-red-400"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold">
                          {item}
                        </p>

                        {index === 0 && (
                          <p className="mt-0.5 text-[9px] text-gray-400">
                            2 Oktober 2026
                          </p>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* CATATAN ADMIN */}
            <div className="mt-2">
              <label className="mb-1.5 block text-[11px] font-semibold">
                Catatan Admin{" "}
                <span className="font-normal text-gray-400">
                  (Opsional)
                </span>
              </label>

              <textarea
                value={adminNote}
                onChange={(e) =>
                  setAdminNote(
                    e.target.value
                  )
                }
                placeholder="Tambahkan catatan untuk pesanan ini"
                className="h-[82px] w-full resize-none rounded-lg border border-gray-200 p-3 text-[11px] outline-none transition focus:border-red-400"
              />
            </div>

            {/* SIMPAN PERUBAHAN */}
            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={
                status === savedStatus &&
                adminNote.trim() === ""
              }
              className={`mt-4 h-[42px] w-full rounded-lg text-[11px] font-semibold text-white transition ${
                status === savedStatus &&
                adminNote.trim() === ""
                  ? "cursor-not-allowed bg-red-300"
                  : "bg-[#e63131] hover:bg-[#ca2929]"
              }`}
            >
              Simpan Perubahan
            </button>

            {/* BATALKAN */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={
                status === savedStatus &&
                adminNote.trim() === ""
              }
              className={`mt-2 h-[42px] w-full rounded-lg border text-[11px] font-semibold transition ${
                status === savedStatus &&
                adminNote.trim() === ""
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Batalkan
            </button>

            {/* SUCCESS MESSAGE */}
            {showSuccess && (
              <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-[10px] font-medium text-green-600">
                Status berhasil diperbarui
                menjadi {savedStatus}.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
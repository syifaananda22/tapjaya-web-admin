"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import {
  CalendarDays,
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

type ProductCategory =
  | "Makanan"
  | "Minuman"
  | "Kopi"
  | "Snack";

type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Bakmi Jaya",
    category: "Makanan",
    price: 26182,
    stock: 50,
    image: "/images/menu/bakmi-jaya.jpg",
  },
  {
    id: 2,
    name: "Kopi Susu Berjaya",
    category: "Kopi",
    price: 24545,
    stock: 42,
    image: "/images/menu/kopi-susu.jpg",
  },
  {
    id: 3,
    name: "Nasi Goreng Jawa",
    category: "Makanan",
    price: 42211,
    stock: 38,
    image: "/images/menu/nasi-goreng.jpg",
  },
  {
    id: 4,
    name: "Mie Goreng Jawa",
    category: "Makanan",
    price: 42211,
    stock: 35,
    image: "/images/menu/mie-goreng.jpg",
  },
  {
    id: 5,
    name: "Milkshake Mango",
    category: "Minuman",
    price: 34545,
    stock: 25,
    image: "/images/menu/milkshake-mango.jpg",
  },
  {
    id: 6,
    name: "Bakmi Jaya Special",
    category: "Makanan",
    price: 32000,
    stock: 30,
    image: "/images/menu/bakmi-jaya.jpg",
  },
  {
    id: 7,
    name: "Kopi Susu Large",
    category: "Kopi",
    price: 30000,
    stock: 20,
    image: "/images/menu/kopi-susu.jpg",
  },
  {
    id: 8,
    name: "Nasi Goreng Special",
    category: "Makanan",
    price: 48000,
    stock: 27,
    image: "/images/menu/nasi-goreng.jpg",
  },
  {
    id: 9,
    name: "Mie Goreng Special",
    category: "Makanan",
    price: 47000,
    stock: 23,
    image: "/images/menu/mie-goreng.jpg",
  },
  {
    id: 10,
    name: "Milkshake Mango Large",
    category: "Minuman",
    price: 39000,
    stock: 18,
    image: "/images/menu/milkshake-mango.jpg",
  },
];

const emptyForm = {
  name: "",
  category: "Makanan" as ProductCategory,
  price: "",
  stock: "",
  image: "/images/menu/bakmi-jaya.jpg",
};

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  const [showDateFilter, setShowDateFilter] =
    useState(false);

  const [startDate, setStartDate] =
    useState("2026-10-02");

  const [endDate, setEndDate] =
    useState("2026-10-02");

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState(emptyForm);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();

    return products.filter((product) => {
      const matchSearch =
        product.name
          .toLowerCase()
          .includes(keyword);

      const matchCategory =
        category === "Semua" ||
        product.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const categoryClass = (
    value: ProductCategory
  ) => {
    switch (value) {
      case "Makanan":
        return "bg-gray-100 text-gray-600";
      case "Kopi":
        return "bg-orange-50 text-orange-600";
      case "Minuman":
        return "bg-blue-50 text-blue-600";
      case "Snack":
        return "bg-red-50 text-red-500";
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (
    product: Product
  ) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
    });

    setShowModal(true);
  };

  const handleSave = () => {
    if (
      !form.name.trim() ||
      !form.price ||
      !form.stock
    ) {
      return;
    }

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: form.name,
                category:
                  form.category,
                price: Number(
                  form.price
                ),
                stock: Number(
                  form.stock
                ),
                image: form.image,
              }
            : product
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        {
          id:
            Math.max(
              ...prev.map(
                (item) => item.id
              ),
              0
            ) + 1,
          name: form.name,
          category: form.category,
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image,
        },
      ]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Hapus menu ini?"
    );

    if (!confirmed) return;

    setProducts((prev) =>
      prev.filter(
        (product) => product.id !== id
      )
    );
  };

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        {/* HEADER */}
        <div className="mb-5">
          <AdminHeader
            title="Manajemen Menu Produk"
            subtitle="Kelola menu yang tersedia di caffe Anda."
          />
        </div>

        {/* FILTER */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* SEARCH */}
          <div className="relative w-full lg:max-w-[320px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari nama menu"
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
              <div className="absolute left-0 top-11 z-50 w-[290px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                <p className="mb-3 text-[12px] font-bold">
                  Pilih Tanggal
                </p>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px]"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
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

          {/* CATEGORY */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="h-[40px] min-w-[180px] appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 text-[11px] outline-none"
            >
              <option value="Semua">
                Semua kategori
              </option>
              <option value="Makanan">
                Makanan
              </option>
              <option value="Minuman">
                Minuman
              </option>
              <option value="Kopi">
                Kopi
              </option>
              <option value="Snack">
                Snack
              </option>
            </select>

            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* ADD */}
          <button
            type="button"
            onClick={openAddModal}
            className="flex h-[40px] items-center justify-center gap-2 rounded-lg bg-[#e63131] px-4 text-[11px] font-semibold text-white transition hover:bg-[#ca2929] lg:ml-auto"
          >
            <Plus size={15} />
            Tambah Menu
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#f7f7f7] text-left text-[11px] font-semibold text-gray-600">
                  <th className="px-4 py-3">
                    Nama Menu
                  </th>

                  <th className="px-4 py-3">
                    Kategori
                  </th>

                  <th className="px-4 py-3">
                    Harga
                  </th>

                  <th className="px-4 py-3">
                    Stok
                  </th>

                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                    >
                      <td className="border-b border-gray-100 px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            width={36}
                            height={36}
                            className="h-[36px] w-[36px] rounded-lg object-cover"
                          />

                          <span className="font-medium text-gray-800">
                            {
                              product.name
                            }
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-2.5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[9px] font-medium ${categoryClass(
                            product.category
                          )}`}
                        >
                          {
                            product.category
                          }
                        </span>
                      </td>

                      <td className="border-b border-gray-100 px-4 py-2.5">
                        {formatCurrency(
                          product.price
                        )}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-2.5">
                        {product.stock}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                product
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil
                              size={14}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2
                              size={14}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {filteredProducts.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-[11px] text-gray-400"
                    >
                      Menu tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-[430px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold">
                  {editingId !== null
                    ? "Edit Menu"
                    : "Tambah Menu"}
                </h2>

                <p className="mt-1 text-[10px] text-gray-500">
                  Lengkapi informasi menu.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Nama Menu
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Kategori
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target
                          .value as ProductCategory,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none"
                >
                  <option value="Makanan">
                    Makanan
                  </option>
                  <option value="Minuman">
                    Minuman
                  </option>
                  <option value="Kopi">
                    Kopi
                  </option>
                  <option value="Snack">
                    Snack
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                    Harga
                  </label>

                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price:
                          e.target.value,
                      })
                    }
                    className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                    Stok
                  </label>

                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock:
                          e.target.value,
                      })
                    }
                    className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Gambar
                </label>

                <select
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px]"
                >
                  <option value="/images/menu/bakmi-jaya.jpg">
                    Bakmi
                  </option>
                  <option value="/images/menu/kopi-susu.jpg">
                    Kopi Susu
                  </option>
                  <option value="/images/menu/nasi-goreng.jpg">
                    Nasi Goreng
                  </option>
                  <option value="/images/menu/mie-goreng.jpg">
                    Mie Goreng
                  </option>
                  <option value="/images/menu/milkshake-mango.jpg">
                    Milkshake
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="h-[38px] rounded-lg border border-gray-200 px-4 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
              >
                Batalkan
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-[38px] rounded-lg bg-[#e63131] px-4 text-[11px] font-semibold text-white hover:bg-[#ca2929]"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
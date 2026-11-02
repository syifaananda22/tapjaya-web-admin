
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Product, ProductInput } from "@/types/product";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductInput) => Promise<void>;
}

export default function ProductFormModal({
  open,
  product,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<ProductInput>({
    name: "",
    category: "Makanan",
    price: 0,
    stock: 0,
    image: null,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");

    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        is_active: product.is_active,
      });
    } else {
      setForm({
        name: "",
        category: "Makanan",
        price: 0,
        stock: 0,
        image: null,
        is_active: true,
      });
    }
  }, [product, open]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan produk."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 text-gray-900"
      >
        <h2 className="text-xl font-semibold">
          {product ? "Edit Produk" : "Tambah Produk"}
        </h2>

        <input
          required
          className="w-full rounded-lg border p-3"
          placeholder="Nama produk"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <select
          className="w-full rounded-lg border p-3"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option>Makanan</option>
          <option>Minuman</option>
          <option>Kopi</option>
          <option>Snack</option>
        </select>

        <input
          required
          min="0"
          type="number"
          className="w-full rounded-lg border p-3"
          placeholder="Harga"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: Number(e.target.value),
            })
          }
        />

        <input
          required
          min="0"
          type="number"
          className="w-full rounded-lg border p-3"
          placeholder="Stok"
          value={form.stock}
          onChange={(e) =>
            setForm({
              ...form,
              stock: Number(e.target.value),
            })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(form.is_active)}
            onChange={(e) =>
              setForm({
                ...form,
                is_active: e.target.checked,
              })
            }
          />
          Produk aktif
        </label>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

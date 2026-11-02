
"use client";

import type { Product } from "@/types/product";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onStatus: (product: Product) => void;
}

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onStatus,
}: Props) {
  if (!products.length) {
    return <p>Belum ada produk.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Produk</th>
            <th className="p-3 text-left">Kategori</th>
            <th className="p-3 text-right">Harga</th>
            <th className="p-3 text-center">Stok</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-3 font-medium">
                {product.name}
              </td>

              <td className="p-3">
                {product.category}
              </td>

              <td className="p-3 text-right">
                {rupiah(product.price)}
              </td>

              <td className="p-3 text-center">
                {product.stock}
              </td>

              <td className="p-3 text-center">
                {product.is_active ? "Aktif" : "Nonaktif"}
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onStatus(product)}
                  >
                    Status
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

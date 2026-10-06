"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "./products.css";

type MenuItem = {
  id: number;
  name: string;
  category: "Makanan" | "Kopi" | "Snack" | "Minuman";
  price: number;
  stock: number;
  image: string;
};

const initialMenus: MenuItem[] = [
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
    name: "Cireng",
    category: "Snack",
    price: 15455,
    stock: 60,
    image: "/images/menu/cireng.jpg",
  },
  {
    id: 6,
    name: "Milkshake Manggo",
    category: "Minuman",
    price: 34545,
    stock: 25,
    image: "/images/menu/milkshake-mango.jpg",
  },
  {
    id: 7,
    name: "Salted Caramel Macchiato",
    category: "Kopi",
    price: 45000,
    stock: 20,
    image: "/images/menu/salted caramel.jpg",
  },
  {
    id: 8,
    name: "Greentea Jasmine",
    category: "Minuman",
    price: 22545,
    stock: 30,
    image: "/images/menu/greentea.jpg",
  },
];

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H14v-6h-4v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h2V2h6v2h2v2h3v16H4V6h3V4Zm4 0v2h2V4h-2Zm-2 7 2.2 2.2L16 8.5l1.4 1.4-6.2 6.2L7.6 12.5 9 11Z" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h14v16H5v-5H2V9h3V4Zm2 3v10h10V7H7Zm-3 4v2h3v-2H4Zm5-2h6v2H9V9Zm0 4h6v2H9v-2Z" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h9l5 5v15H6V2Zm8 2.5V8h3.5L14 4.5ZM9 12h8v1.8H9V12Zm0 4h8v1.8H9V16Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m19.2 13.2.1-1.2-.1-1.2 2-1.5-2-3.4-2.5 1a8 8 0 0 0-2-1.1L14.4 3H9.6l-.4 2.8a8 8 0 0 0-2 1.1l-2.5-1-2 3.4 2 1.5-.1 1.2.1 1.2-2 1.5 2 3.4 2.5-1a8 8 0 0 0 2 1.1l.4 2.8h4.8l.4-2.8a8 8 0 0 0 2-1.1l2.5 1 2-3.4-2.1-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m15.5 15.5 4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 2.5v5M17 2.5v5M3.5 9.5h17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="white" />
      <path
        d="M12 7.5v9M7.5 12h9"
        stroke="#d92f2f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 15.8 9.8-9.8 4.2 4.2-9.8 9.8L3 21l1-5.2Zm11.2-11.2 1.6-1.6a1.6 1.6 0 0 1 2.2 0l2 2a1.6 1.6 0 0 1 0 2.2l-1.6 1.6-4.2-4.2Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3h8l1 2h4v2H3V5h4l1-2Zm-2 6h12l-1 12H7L6 9Zm4 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18 8a6 6 0 0 0-12 0c0 6.5-2.7 7-2.7 7h17.4S18 14.5 18 8ZM10 19h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0H4Z" />
    </svg>
  );
}

export default function ProductsPage() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua status");

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchSearch = menu.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "Semua status" || menu.category === category;

      return matchSearch && matchCategory;
    });
  }, [menus, search, category]);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus menu ini?"
    );

    if (!confirmed) return;

    setMenus((prev) => prev.filter((menu) => menu.id !== id));
  };

  return (
    <main className="product-page">
      <div className="admin-shell">
        <aside className="sidebar">
          <div className="logo-wrapper">
            <img
              src="/images/tapjaya-logo.png"
              alt="TAP JAYA"
              className="brand-logo"
            />
          </div>

          <nav className="sidebar-nav">
            <Link href="/dashboard" className="nav-item">
              <span className="nav-icon">
                <DashboardIcon />
              </span>
              <span>Dashboard</span>
            </Link>

            <Link href="/orders" className="nav-item">
              <span className="nav-icon">
                <OrderIcon />
              </span>
              <span>Pesanan</span>
            </Link>

            <Link href="/products" className="nav-item active">
              <span className="nav-icon">
                <ProductIcon />
              </span>
              <span>Menu Produk</span>
            </Link>

            <Link href="/reports" className="nav-item">
              <span className="nav-icon">
                <ReportIcon />
              </span>
              <span>Laporan</span>
            </Link>

            <Link href="/settings" className="nav-item">
              <span className="nav-icon">
                <SettingsIcon />
              </span>
              <span>Pengaturan</span>
            </Link>
          </nav>
        </aside>

        <section className="content-area">
          <header className="top-header">
            <div className="heading-area">
              <h1>Manajemen Menu Produk</h1>
              <p>Kelola menu anda yang tersedia di caffe Anda.</p>
            </div>

            <div className="profile-area">
              <button
                type="button"
                className="notification-button"
                aria-label="Notifikasi"
              >
                <BellIcon />
                <span className="notification-dot" />
              </button>

              <div className="user-avatar">
                <UserIcon />
              </div>

              <div className="user-info">
                <div className="user-name-row">
                  <strong>Admin</strong>
                  <span className="small-chevron">▼</span>
                </div>

                <span>Toko Kopi Jaya Berawan</span>
              </div>
            </div>
          </header>

          <section className="toolbar">
            <div className="search-box">
              <span className="search-icon">
                <SearchIcon />
              </span>

              <input
                type="text"
                placeholder="Cari nomer pesanan, nama menu"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button type="button" className="date-button">
              <span className="calendar-icon">
                <CalendarIcon />
              </span>

              <span className="date-text">
                2 Okt 2026 - 2 Okt 2026
              </span>

              <span className="chevron">▼</span>
            </button>

            <div className="status-select-wrapper">
              <select
                className="status-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Semua status">Semua status</option>
                <option value="Makanan">Makanan</option>
                <option value="Kopi">Kopi</option>
                <option value="Snack">Snack</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>

            <button
              type="button"
              className="add-menu-button"
              onClick={() => alert("Form tambah menu")}
            >
              <span className="plus-icon">
                <PlusIcon />
              </span>

              <span>Tambah Menu</span>
            </button>
          </section>

          <section className="table-card">
            <table className="menu-table">
              <thead>
                <tr>
                  <th className="image-column"></th>
                  <th>Nama Menu</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th className="action-heading">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredMenus.map((menu) => (
                  <tr key={menu.id}>
                    <td className="image-cell">
                      <img
                        src={menu.image}
                        alt={menu.name}
                      />
                    </td>

                    <td className="menu-name">
                      {menu.name}
                    </td>

                    <td>
                      <span
                        className={`category-badge ${menu.category.toLowerCase()}`}
                      >
                        {menu.category}
                      </span>
                    </td>

                    <td className="price-cell">
                      {rupiah
                        .format(menu.price)
                        .replace("Rp", "Rp ")}
                    </td>

                    <td className="stock-cell">
                      {menu.stock}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="icon-action edit"
                          aria-label={`Edit ${menu.name}`}
                          onClick={() =>
                            alert(`Edit menu: ${menu.name}`)
                          }
                        >
                          <EditIcon />
                        </button>

                        <button
                          type="button"
                          className="icon-action delete"
                          aria-label={`Hapus ${menu.name}`}
                          onClick={() => handleDelete(menu.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMenus.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="empty-state"
                    >
                      Menu tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </section>
      </div>
    </main>
  );
}
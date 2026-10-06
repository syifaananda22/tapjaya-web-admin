"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import "./reports.css";

type Period = "today" | "week" | "month" | "sixMonths" | "year";

type ChartPoint = {
  label: string;
  revenue: number;
  orders: number;
};

type CategoryData = {
  name: string;
  percentage: number;
  className: "food" | "drink" | "snack";
};

type PeriodData = {
  totalRevenue: number;
  totalOrders: number;
  growthRevenue: number;
  growthOrders: number;
  growthAverage: number;
  comparisonText: string;
  chart: ChartPoint[];
  categories: CategoryData[];
};

type MenuItem = {
  no: number;
  name: string;
  sold: number;
  revenue: number;
  image: string;
};

const reportData: Record<Period, PeriodData> = {
  today: {
    totalRevenue: 1850000,
    totalOrders: 57,
    growthRevenue: 8,
    growthOrders: 5,
    growthAverage: 3,
    comparisonText: "dari kemarin",

    chart: [
      { label: "08:00", revenue: 120000, orders: 4 },
      { label: "09:00", revenue: 180000, orders: 6 },
      { label: "10:00", revenue: 220000, orders: 7 },
      { label: "11:00", revenue: 310000, orders: 9 },
      { label: "12:00", revenue: 390000, orders: 11 },
      { label: "13:00", revenue: 280000, orders: 8 },
      { label: "14:00", revenue: 350000, orders: 10 },
    ],

    categories: [
      { name: "Makanan", percentage: 46.2, className: "food" },
      { name: "Minuman", percentage: 34.1, className: "drink" },
      { name: "Snack", percentage: 19.7, className: "snack" },
    ],
  },

  week: {
    totalRevenue: 12540000,
    totalOrders: 384,
    growthRevenue: 15,
    growthOrders: 12,
    growthAverage: 5,
    comparisonText: "dari minggu lalu",

    chart: [
      { label: "Sen", revenue: 1450000, orders: 44 },
      { label: "Sel", revenue: 1720000, orders: 51 },
      { label: "Rab", revenue: 1580000, orders: 48 },
      { label: "Kam", revenue: 1940000, orders: 58 },
      { label: "Jum", revenue: 2100000, orders: 64 },
      { label: "Sab", revenue: 2280000, orders: 68 },
      { label: "Min", revenue: 1470000, orders: 51 },
    ],

    categories: [
      { name: "Makanan", percentage: 42.2, className: "food" },
      { name: "Minuman", percentage: 28.1, className: "drink" },
      { name: "Snack", percentage: 18.8, className: "snack" },
    ],
  },

  month: {
    totalRevenue: 48540000,
    totalOrders: 1487,
    growthRevenue: 18,
    growthOrders: 14,
    growthAverage: 7,
    comparisonText: "dari bulan lalu",

    chart: [
      { label: "2 Sep", revenue: 520000, orders: 22 },
      { label: "5 Sep", revenue: 780000, orders: 31 },
      { label: "8 Sep", revenue: 1120000, orders: 42 },
      { label: "11 Sep", revenue: 960000, orders: 37 },
      { label: "14 Sep", revenue: 1280000, orders: 48 },
      { label: "17 Sep", revenue: 1680000, orders: 63 },
      { label: "20 Sep", revenue: 1140000, orders: 44 },
      { label: "23 Sep", revenue: 1390000, orders: 52 },
      { label: "26 Sep", revenue: 1720000, orders: 66 },
      { label: "29 Sep", revenue: 1160000, orders: 45 },
      { label: "2 Okt", revenue: 960000, orders: 39 },
    ],

    categories: [
      { name: "Makanan", percentage: 42.2, className: "food" },
      { name: "Minuman", percentage: 28.1, className: "drink" },
      { name: "Snack", percentage: 18.8, className: "snack" },
    ],
  },

  sixMonths: {
    totalRevenue: 276300000,
    totalOrders: 8524,
    growthRevenue: 24,
    growthOrders: 19,
    growthAverage: 9,
    comparisonText: "dari 6 bulan sebelumnya",

    chart: [
      { label: "Mei", revenue: 38500000, orders: 1180 },
      { label: "Jun", revenue: 41900000, orders: 1290 },
      { label: "Jul", revenue: 43700000, orders: 1360 },
      { label: "Agu", revenue: 46900000, orders: 1448 },
      { label: "Sep", revenue: 48540000, orders: 1512 },
      { label: "Okt", revenue: 56760000, orders: 1734 },
    ],

    categories: [
      { name: "Makanan", percentage: 44.5, className: "food" },
      { name: "Minuman", percentage: 32.4, className: "drink" },
      { name: "Snack", percentage: 23.1, className: "snack" },
    ],
  },

  year: {
    totalRevenue: 548900000,
    totalOrders: 16870,
    growthRevenue: 31,
    growthOrders: 22,
    growthAverage: 11,
    comparisonText: "dari tahun lalu",

    chart: [
      { label: "Jan", revenue: 38000000, orders: 1160 },
      { label: "Feb", revenue: 40500000, orders: 1240 },
      { label: "Mar", revenue: 42100000, orders: 1300 },
      { label: "Apr", revenue: 43900000, orders: 1340 },
      { label: "Mei", revenue: 45500000, orders: 1400 },
      { label: "Jun", revenue: 46200000, orders: 1425 },
      { label: "Jul", revenue: 47100000, orders: 1455 },
      { label: "Agu", revenue: 48300000, orders: 1482 },
      { label: "Sep", revenue: 49500000, orders: 1515 },
      { label: "Okt", revenue: 51000000, orders: 1570 },
      { label: "Nov", revenue: 53300000, orders: 1640 },
      { label: "Des", revenue: 63400000, orders: 2343 },
    ],

    categories: [
      { name: "Makanan", percentage: 45.1, className: "food" },
      { name: "Minuman", percentage: 31.7, className: "drink" },
      { name: "Snack", percentage: 23.2, className: "snack" },
    ],
  },
};

const bestMenus: MenuItem[] = [
  {
    no: 1,
    name: "Bakmi Jaya",
    sold: 36,
    revenue: 1083000,
    image: "/images/menu/bakmi-jaya.jpg",
  },
  {
    no: 2,
    name: "Kopi Susu Berjaya",
    sold: 32,
    revenue: 795600,
    image: "/images/menu/kopi-susu.jpg",
  },
  {
    no: 3,
    name: "Nasi Goreng Jawa",
    sold: 28,
    revenue: 591600,
    image: "/images/menu/nasi-goreng.jpg",
  },
  {
    no: 4,
    name: "Mie Goreng Jawa",
    sold: 24,
    revenue: 581600,
    image: "/images/menu/mie-goreng.jpg",
  },
  {
    no: 5,
    name: "Milkshake Mango",
    sold: 20,
    revenue: 491600,
    image: "/images/menu/milkshake-mango.jpg",
  },
  {
    no: 6,
    name: "Cireng",
    sold: 18,
    revenue: 277200,
    image: "/images/menu/cireng.jpg",
  },
  {
    no: 7,
    name: "Kopi Hitam",
    sold: 16,
    revenue: 361600,
    image: "/images/menu/kopi-susu.jpg",
  },
  {
    no: 8,
    name: "Salted Caramel Macchiato",
    sold: 14,
    revenue: 630000,
    image: "/images/menu/salted caramel.jpg",
  },
  {
    no: 9,
    name: "Greentea Jasmine",
    sold: 12,
    revenue: 270540,
    image: "/images/menu/greentea.jpg",
  },
  {
    no: 10,
    name: "Triple Egg Fried Rice",
    sold: 10,
    revenue: 422110,
    image: "/images/menu/nasi-goreng.jpg",
  },
];

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/* ===============================
   ICON
================================ */

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H14v-6h-4v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7 4h2V2h6v2h2v2h3v16H4V6h3V4Zm4 0v2h2V4h-2Zm-2 7 2.2 2.2L16 8.5l1.4 1.4-6.2 6.2L7.6 12.5 9 11Z" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 4h14v16H5v-5H2V9h3V4Zm2 3v10h10V7H7Zm-3 4v2h3v-2H4Zm5-2h6v2H9V9Zm0 4h6v2H9v-2Z" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 2h9l5 5v15H6V2Zm8 2.5V8h3.5L14 4.5ZM9 12h8v1.8H9V12Zm0 4h8v1.8H9V16Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m19.2 13.2.1-1.2-.1-1.2 2-1.5-2-3.4-2.5 1a8 8 0 0 0-2-1.1L14.4 3H9.6l-.4 2.8a8 8 0 0 0-2 1.1l-2.5-1-2 3.4 2 1.5-.1 1.2.1 1.2-2 1.5 2 3.4 2.5-1a8 8 0 0 0 2 1.1l.4 2.8h4.8l.4-2.8a8 8 0 0 0 2-1.1l2.5 1 2-3.4-2.1-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M8 4h8v3H8V4Zm-2 2H4v16h16V6h-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m8 14 2.5 2.5L16 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <ellipse
        cx="12"
        cy="6"
        rx="6"
        ry="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M6 6v10c0 1.7 2.7 3 6 3s6-1.3 6-3V6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m12 4 6 7h-4v9h-4v-9H6l6-7Z" />
    </svg>
  );
}

/* ===============================
   CHART
================================ */

function RevenueChart({
  points,
}: {
  points: ChartPoint[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxRevenue = Math.max(
    ...points.map((point) => point.revenue),
    1
  );

  const chartWidth = 760;
  const chartHeight = 230;
  const bottom = 205;
  const top = 18;
  const usableHeight = bottom - top;

  const step =
    points.length > 1
      ? chartWidth / (points.length - 1)
      : chartWidth;

  const coordinates = points.map((point, index) => {
    const x =
      points.length === 1
        ? chartWidth / 2
        : index * step;

    const y =
      bottom -
      (point.revenue / maxRevenue) * usableHeight * 0.86;

    return {
      ...point,
      x,
      y,
    };
  });

  const polyline = coordinates
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <section className="revenue-card">
      <div className="chart-heading">
        <h3>Grafik Pendapatan</h3>

        <div className="chart-legends">
          <span>
            <i className="legend-red" />
            Pendapatan
          </span>

          <span>
            <i className="legend-pink" />
            Jumlah Pesanan
          </span>
        </div>
      </div>

      <div className="chart-body">
        <div className="left-axis">
          <span>{formatRupiah(maxRevenue)}</span>
          <span>{formatRupiah(maxRevenue * 0.75)}</span>
          <span>{formatRupiah(maxRevenue * 0.5)}</span>
          <span>{formatRupiah(maxRevenue * 0.25)}</span>
          <span>Rp 0</span>
        </div>

        <div className="svg-area">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="chart-svg"
          >
            {[35, 77, 119, 161, 203].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                className="chart-grid-line"
              />
            ))}

            {coordinates.map((point, index) => {
              const barWidth = Math.max(
                20,
                Math.min(40, step * 0.45)
              );

              return (
                <rect
                  key={`bar-${index}`}
                  x={point.x - barWidth / 2}
                  y={point.y}
                  width={barWidth}
                  height={bottom - point.y}
                  rx="2"
                  className="chart-bar"
                />
              );
            })}

            <polyline
              points={polyline}
              fill="none"
              className="chart-red-line"
            />

            {coordinates.map((point, index) => (
              <g key={`point-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  fill="transparent"
                  className="point-hit-area"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                />

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4.5"
                  className="chart-red-point"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                />
              </g>
            ))}
          </svg>

          {hovered !== null && (
            <div
              className="chart-tooltip"
              style={{
                left: `${(coordinates[hovered].x / chartWidth) * 100}%`,
                top: `${(coordinates[hovered].y / chartHeight) * 100}%`,
              }}
            >
              <strong>
                {coordinates[hovered].label}
              </strong>

              <span>
                {formatRupiah(
                  coordinates[hovered].revenue
                )}
              </span>

              <small>
                {coordinates[hovered].orders} pesanan
              </small>
            </div>
          )}

          <div className="chart-x-labels">
            {points.map((point) => (
              <span key={point.label}>
                {point.label}
              </span>
            ))}
          </div>
        </div>

        <div className="right-axis">
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
      </div>
    </section>
  );
}

/* ===============================
   DONUT
================================ */

function CategoryChart({
  categories,
}: {
  categories: CategoryData[];
}) {
  const first = categories[0]?.percentage ?? 0;
  const second = categories[1]?.percentage ?? 0;

  const firstDeg = first * 3.6;
  const secondDeg = (first + second) * 3.6;

  return (
    <section className="category-card">
      <h3>Pendapatan per Kategori</h3>

      <div className="category-content">
        <div className="donut-area">
          <div
            className="donut-chart"
            style={{
              background: `conic-gradient(
                #08b96e 0deg ${firstDeg}deg,
                #1599e8 ${firstDeg}deg ${secondDeg}deg,
                #ffad18 ${secondDeg}deg 360deg
              )`,
            }}
          >
            <div className="donut-hole" />

            <span className="donut-label label-food">
              {categories[0]?.percentage}%
            </span>

            <span className="donut-label label-drink">
              {categories[1]?.percentage}%
            </span>

            <span className="donut-label label-snack">
              {categories[2]?.percentage}%
            </span>
          </div>
        </div>

        <div className="category-list">
          {categories.map((item) => (
            <div
              className="category-list-row"
              key={item.name}
            >
              <div>
                <i
                  className={`category-dot ${item.className}`}
                />
                <span>{item.name}</span>
              </div>

              <strong>
                {item.percentage}%
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===============================
   PAGE
================================ */

export default function ReportsPage() {
  const [period, setPeriod] =
    useState<Period>("month");

  const data = reportData[period];

  const averageOrder = useMemo(() => {
    if (data.totalOrders === 0) return 0;

    return Math.round(
      data.totalRevenue / data.totalOrders
    );
  }, [data]);

  return (
    <main className="reports-page">
      <div className="reports-layout">

        {/* SIDEBAR */}

        <aside className="reports-sidebar">
          <div className="reports-logo">
            <img
              src="/images/tapjaya-logo.png"
              alt="TAP JAYA"
            />
          </div>

          <nav className="reports-navigation">

            <Link
              href="/dashboard"
              className="report-nav-item"
            >
              <span>
                <DashboardIcon />
              </span>
              Dashboard
            </Link>

            <Link
              href="/orders"
              className="report-nav-item"
            >
              <span>
                <OrderIcon />
              </span>
              Pesanan
            </Link>

            <Link
              href="/products"
              className="report-nav-item"
            >
              <span>
                <ProductIcon />
              </span>
              Menu Produk
            </Link>

            <Link
              href="/reports"
              className="report-nav-item active"
            >
              <span>
                <ReportIcon />
              </span>
              Laporan
            </Link>

            <Link
              href="/settings"
              className="report-nav-item"
            >
              <span>
                <SettingsIcon />
              </span>
              Pengaturan
            </Link>

          </nav>
        </aside>

        {/* CONTENT */}

        <section className="reports-content">

          <header className="reports-header">
            <div>
              <h1>Laporan Keuangan</h1>

              <p>
                Lihat ringkasan pendapatan dan transaksi caffe anda
              </p>
            </div>
          </header>

          {/* PERIOD */}

          <section className="period-selector">
            <button
              className={
                period === "today"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPeriod("today")
              }
            >
              Hari Ini
            </button>

            <button
              className={
                period === "week"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPeriod("week")
              }
            >
              Minggu Ini
            </button>

            <button
              className={
                period === "month"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPeriod("month")
              }
            >
              Bulan Ini
            </button>

            <button
              className={
                period === "sixMonths"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPeriod("sixMonths")
              }
            >
              6 Bulan
            </button>

            <button
              className={
                period === "year"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPeriod("year")
              }
            >
              1 Tahun
            </button>
          </section>

          {/* SUMMARY */}

          <section className="report-summary">

            <article className="summary-card">
              <div className="summary-icon green">
                <MoneyIcon />
              </div>

              <div>
                <h4>Total Pendapatan</h4>

                <strong>
                  {formatRupiah(
                    data.totalRevenue
                  )}
                </strong>

                <p>
                  <ArrowUpIcon />

                  {data.growthRevenue}%{" "}
                  {data.comparisonText}
                </p>
              </div>
            </article>

            <article className="summary-card">
              <div className="summary-icon blue">
                <ClipboardIcon />
              </div>

              <div>
                <h4>Total Pesanan</h4>

                <strong>
                  {data.totalOrders.toLocaleString(
                    "id-ID"
                  )}
                </strong>

                <p>
                  <ArrowUpIcon />

                  {data.growthOrders}%{" "}
                  {data.comparisonText}
                </p>
              </div>
            </article>

            <article className="summary-card">
              <div className="summary-icon orange">
                <CoinIcon />
              </div>

              <div>
                <h4>Rata-rata pesanan</h4>

                <strong>
                  {averageOrder.toLocaleString(
                    "id-ID"
                  )}
                </strong>

                <p>
                  <ArrowUpIcon />

                  {data.growthAverage}%{" "}
                  {data.comparisonText}
                </p>
              </div>
            </article>

          </section>

          {/* REPORT */}

          <section className="reports-grid">

            <div className="reports-left">

              <RevenueChart
                points={data.chart}
              />

              <CategoryChart
                categories={data.categories}
              />

            </div>

            {/* BEST MENU */}

            <aside className="best-menu-card">

              <h3>
                Menu Terlaris
              </h3>

              <div className="best-menu-head">
                <span>#</span>
                <span>Nama Menu</span>
                <span>Terjual</span>
                <span>Pendapatan</span>
              </div>

              <div className="best-menu-body">

                {bestMenus.map((menu) => (

                  <div
                    className="best-menu-row"
                    key={menu.no}
                  >
                    <span>
                      {menu.no}
                    </span>

                    <div className="best-menu-name">
                      <img
                        src={menu.image}
                        alt={menu.name}
                      />

                      <span>
                        {menu.name}
                      </span>
                    </div>

                    <span className="best-sold">
                      {menu.sold}
                    </span>

                    <span className="best-revenue">
                      {formatRupiah(
                        menu.revenue
                      )}
                    </span>
                  </div>

                ))}

              </div>

            </aside>

          </section>

        </section>

      </div>
    </main>
  );
}
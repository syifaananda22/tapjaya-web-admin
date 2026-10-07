"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Coins,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";
import StatCard from "@/components/StatCard";

import {
  bestMenus,
  latestOrders,
} from "@/data/dashboard";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* =========================
   TYPE
========================= */

type DashboardPeriod =
  | "day"
  | "week"
  | "month"
  | "sixMonths"
  | "year";

/* =========================
   DASHBOARD DATA
========================= */

const dashboardData = {
  day: {
    label: "1 Hari",

    totalRevenue: 1850000,
    totalOrders: 57,
    completedOrders: 51,
    lowStock: 8,

    revenueGrowth: 18,
    orderGrowth: 14,
    completedGrowth: 7,

    comparison: "dari kemarin",

    chart: [
      {
        label: "08:00",
        income: 120000,
      },
      {
        label: "09:00",
        income: 180000,
      },
      {
        label: "10:00",
        income: 220000,
      },
      {
        label: "11:00",
        income: 310000,
      },
      {
        label: "12:00",
        income: 390000,
      },
      {
        label: "13:00",
        income: 280000,
      },
      {
        label: "14:00",
        income: 350000,
      },
    ],

    categories: [
      {
        name: "Makanan",
        value: 42.2,
      },
      {
        name: "Minuman",
        value: 28.1,
      },
      {
        name: "Kopi",
        value: 18.8,
      },
      {
        name: "Snack",
        value: 10.9,
      },
    ],
  },

  week: {
    label: "1 Minggu",

    totalRevenue: 12540000,
    totalOrders: 384,
    completedOrders: 351,
    lowStock: 8,

    revenueGrowth: 18,
    orderGrowth: 14,
    completedGrowth: 7,

    comparison: "dari minggu lalu",

    chart: [
      {
        label: "Sen",
        income: 1450000,
      },
      {
        label: "Sel",
        income: 1720000,
      },
      {
        label: "Rab",
        income: 1580000,
      },
      {
        label: "Kam",
        income: 1940000,
      },
      {
        label: "Jum",
        income: 2100000,
      },
      {
        label: "Sab",
        income: 2280000,
      },
      {
        label: "Min",
        income: 1470000,
      },
    ],

    categories: [
      {
        name: "Makanan",
        value: 43.5,
      },
      {
        name: "Minuman",
        value: 26.5,
      },
      {
        name: "Kopi",
        value: 19,
      },
      {
        name: "Snack",
        value: 11,
      },
    ],
  },

  month: {
    label: "1 Bulan",

    totalRevenue: 48540000,
    totalOrders: 1487,
    completedOrders: 1362,
    lowStock: 8,

    revenueGrowth: 18,
    orderGrowth: 14,
    completedGrowth: 7,

    comparison: "dari bulan lalu",

    chart: [
      {
        label: "2 Sep",
        income: 520000,
      },
      {
        label: "5 Sep",
        income: 780000,
      },
      {
        label: "8 Sep",
        income: 1120000,
      },
      {
        label: "11 Sep",
        income: 960000,
      },
      {
        label: "14 Sep",
        income: 1280000,
      },
      {
        label: "17 Sep",
        income: 1680000,
      },
      {
        label: "20 Sep",
        income: 1140000,
      },
      {
        label: "23 Sep",
        income: 1390000,
      },
      {
        label: "26 Sep",
        income: 1720000,
      },
      {
        label: "29 Sep",
        income: 1160000,
      },
      {
        label: "2 Okt",
        income: 960000,
      },
    ],

    categories: [
      {
        name: "Makanan",
        value: 42.2,
      },
      {
        name: "Minuman",
        value: 28.1,
      },
      {
        name: "Kopi",
        value: 18.8,
      },
      {
        name: "Snack",
        value: 10.9,
      },
    ],
  },

  sixMonths: {
    label: "6 Bulan",

    totalRevenue: 276300000,
    totalOrders: 8524,
    completedOrders: 7837,
    lowStock: 8,

    revenueGrowth: 18,
    orderGrowth: 14,
    completedGrowth: 7,

    comparison:
      "dari 6 bulan sebelumnya",

    chart: [
      {
        label: "Mei",
        income: 38500000,
      },
      {
        label: "Jun",
        income: 41900000,
      },
      {
        label: "Jul",
        income: 43700000,
      },
      {
        label: "Agu",
        income: 46900000,
      },
      {
        label: "Sep",
        income: 48540000,
      },
      {
        label: "Okt",
        income: 56760000,
      },
    ],

    categories: [
      {
        name: "Makanan",
        value: 44,
      },
      {
        name: "Minuman",
        value: 27,
      },
      {
        name: "Kopi",
        value: 18,
      },
      {
        name: "Snack",
        value: 11,
      },
    ],
  },

  year: {
    label: "1 Tahun",

    totalRevenue: 548900000,
    totalOrders: 16870,
    completedOrders: 15491,
    lowStock: 8,

    revenueGrowth: 18,
    orderGrowth: 14,
    completedGrowth: 7,

    comparison: "dari tahun lalu",

    chart: [
      {
        label: "Jan",
        income: 38000000,
      },
      {
        label: "Feb",
        income: 40500000,
      },
      {
        label: "Mar",
        income: 42100000,
      },
      {
        label: "Apr",
        income: 43900000,
      },
      {
        label: "Mei",
        income: 45500000,
      },
      {
        label: "Jun",
        income: 46200000,
      },
      {
        label: "Jul",
        income: 47100000,
      },
      {
        label: "Agu",
        income: 48300000,
      },
      {
        label: "Sep",
        income: 49500000,
      },
      {
        label: "Okt",
        income: 51000000,
      },
      {
        label: "Nov",
        income: 53300000,
      },
      {
        label: "Des",
        income: 63400000,
      },
    ],

    categories: [
      {
        name: "Makanan",
        value: 43,
      },
      {
        name: "Minuman",
        value: 27.5,
      },
      {
        name: "Kopi",
        value: 18.5,
      },
      {
        name: "Snack",
        value: 11,
      },
    ],
  },
};

/* =========================
   PERIOD OPTIONS
========================= */

const periodOptions: {
  value: DashboardPeriod;
  label: string;
}[] = [
  {
    value: "day",
    label: "1 Hari",
  },
  {
    value: "week",
    label: "1 Minggu",
  },
  {
    value: "month",
    label: "1 Bulan",
  },
  {
    value: "sixMonths",
    label: "6 Bulan",
  },
  {
    value: "year",
    label: "1 Tahun",
  },
];

/* =========================
   PAGE
========================= */

export default function DashboardPage() {
  /*
   * Default = 1 Bulan.
   *
   * Kalau mau default 1 Hari:
   * useState<DashboardPeriod>("day")
   */

  const [period, setPeriod] =
    useState<DashboardPeriod>("month");

  const [
    showPeriodFilter,
    setShowPeriodFilter,
  ] = useState(false);

  const data =
    dashboardData[period];

  /* =========================
     PIE COLORS
  ========================= */

  const pieColors = [
    "#00b96b",
    "#168be5",
    "#ffbf19",
    "#ff7a1a",
  ];

  /* =========================
     CURRENCY
  ========================= */

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

  /* =========================
     STATUS
  ========================= */

  const statusStyle = (
    status: string
  ) => {
    switch (status) {
      case "Selesai":
        return "bg-green-100 text-green-600";

      case "Siap":
        return "bg-emerald-100 text-emerald-600";

      case "Diproses":
        return "bg-blue-100 text-blue-600";

      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      {/* =========================
          SIDEBAR
      ========================== */}

      <Sidebar />

      {/* =========================
          CONTENT
      ========================== */}

      <section className="min-w-0 flex-1 p-4 lg:p-5">
        {/* ======================
            HEADER
        ======================= */}

        <div className="mb-4 rounded-xl bg-white px-5 py-4 shadow-sm">
          <AdminHeader
            title="Dashboard"
            subtitle="Selamat datang, Admin! Berikut ringkasan operasional caffe Anda."
          />
        </div>

        {/* ======================
            PERIOD FILTER
        ======================= */}

        <div className="relative mb-4 flex justify-end">
          {/* BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowPeriodFilter(
                (prev) => !prev
              )
            }
            className="flex h-[40px] min-w-[210px] items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 text-[10px] font-medium text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <span>
              {data.label}
            </span>

            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                showPeriodFilter
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}

          {showPeriodFilter && (
            <div className="absolute right-0 top-[47px] z-50 w-[310px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
              <p className="mb-1 text-[12px] font-bold text-gray-800">
                Pilih Periode
              </p>

              <p className="mb-4 text-[9px] text-gray-400">
                Pilih rentang waktu
                untuk menampilkan
                data dashboard.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {periodOptions.map(
                  (item) => {
                    const active =
                      period ===
                      item.value;

                    return (
                      <button
                        key={
                          item.value
                        }
                        type="button"
                        onClick={() => {
                          setPeriod(
                            item.value
                          );

                          setShowPeriodFilter(
                            false
                          );
                        }}
                        className={`h-[38px] rounded-lg border text-[10px] font-medium transition-all ${
                          active
                            ? "border-[#e63131] bg-red-50 font-semibold text-[#e63131]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        }`}
                      >
                        {
                          item.label
                        }
                      </button>
                    );
                  }
                )}
              </div>

              {/* 1 TAHUN FULL WIDTH */}

              {/*
                Karena jumlah periodenya 5,
                tombol 1 Tahun otomatis ada
                di kiri baris terakhir.
              */}
            </div>
          )}
        </div>

        {/* ======================
            STATISTICS
        ======================= */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL PESANAN */}

          <StatCard
            title="Total Pesanan"
            value={data.totalOrders.toLocaleString(
              "id-ID"
            )}
            description={`↑ ${data.orderGrowth}% ${data.comparison}`}
            icon={
              <div className="rounded-lg bg-red-50 p-2">
                <ClipboardList
                  size={20}
                  className="text-red-400"
                />
              </div>
            }
          />

          {/* TOTAL PENDAPATAN */}

          <StatCard
            title="Total Pendapatan"
            value={formatCurrency(
              data.totalRevenue
            )}
            description={`↑ ${data.revenueGrowth}% ${data.comparison}`}
            icon={
              <div className="rounded-lg bg-green-50 p-2">
                <Banknote
                  size={20}
                  className="text-green-500"
                />
              </div>
            }
          />

          {/* PESANAN SELESAI */}

          <StatCard
            title="Pesanan Selesai"
            value={data.completedOrders.toLocaleString(
              "id-ID"
            )}
            description={`↑ ${data.completedGrowth}% ${data.comparison}`}
            icon={
              <div className="rounded-lg bg-blue-50 p-2">
                <CheckCircle2
                  size={20}
                  className="text-blue-500"
                />
              </div>
            }
          />

          {/* STOCK */}

          <StatCard
            title="Stock Menipis"
            value={String(
              data.lowStock
            )}
            description="Lihat Detail"
            descriptionClassName="text-blue-500"
            icon={
              <div className="rounded-lg bg-yellow-50 p-2">
                <Coins
                  size={20}
                  className="text-yellow-500"
                />
              </div>
            }
          />
        </div>

        {/* ======================
            CHART + CATEGORY
        ======================= */}

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.35fr_0.85fr]">
          {/* =================
              REVENUE CHART
          ================== */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[13px] font-bold">
                  Grafik
                  Pendapatan
                </h2>

                <p className="mt-1 text-[9px] text-gray-400">
                  Data periode{" "}
                  {data.label}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />

                <span className="text-[9px] text-gray-500">
                  Pendapatan
                </span>
              </div>
            </div>

            <div className="h-[240px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={
                    data.chart
                  }
                  margin={{
                    top: 10,
                    right: 15,
                    left: 5,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={
                      false
                    }
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 9,
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
                  />

                  <YAxis
                    tick={{
                      fontSize: 8,
                    }}
                    axisLine={
                      false
                    }
                    tickLine={
                      false
                    }
                    width={65}
                    tickFormatter={(
                      value
                    ) => {
                      if (
                        value >=
                        1000000
                      ) {
                        return `${(
                          value /
                          1000000
                        ).toFixed(
                          0
                        )}jt`;
                      }

                      return `${Math.round(
                        value /
                          1000
                      )}rb`;
                    }}
                  />

                  <Tooltip
                    formatter={(
                      value
                    ) => [
                      formatCurrency(
                        Number(
                          value
                        )
                      ),
                      "Pendapatan",
                    ]}
                    labelStyle={{
                      fontSize:
                        "10px",
                      fontWeight:
                        600,
                    }}
                    contentStyle={{
                      borderRadius:
                        "8px",
                      border:
                        "1px solid #eeeeee",
                      fontSize:
                        "10px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#ef4444"
                    strokeWidth={
                      2.5
                    }
                    activeDot={{
                      r: 6,
                    }}
                    dot={{
                      r: 4,
                      fill:
                        "#ffffff",
                      stroke:
                        "#ef4444",
                      strokeWidth:
                        2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* =================
              CATEGORY
          ================== */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <h2 className="text-[13px] font-bold">
                Kategori Menu
                Terlaris
              </h2>

              <p className="mt-1 text-[9px] text-gray-400">
                Data periode{" "}
                {data.label}
              </p>
            </div>

            <div className="flex min-h-[240px] items-center justify-center">
              {/* PIE */}

              <div className="h-[165px] w-[165px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={
                        data.categories
                      }
                      innerRadius={
                        45
                      }
                      outerRadius={
                        70
                      }
                      paddingAngle={
                        2
                      }
                      dataKey="value"
                    >
                      {data.categories.map(
                        (
                          item,
                          index
                        ) => (
                          <Cell
                            key={
                              item.name
                            }
                            fill={
                              pieColors[
                                index
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${value}%`,
                        "Persentase",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* LEGEND */}

              <div className="ml-5 space-y-3">
                {data.categories.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.name
                      }
                      className="flex min-w-[145px] justify-between gap-5 text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-[7px] w-[7px] rounded-full"
                          style={{
                            backgroundColor:
                              pieColors[
                                index
                              ],
                          }}
                        />

                        {
                          item.name
                        }
                      </div>

                      <strong>
                        {
                          item.value
                        }
                        %
                      </strong>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================
            TABLE
        ======================= */}

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
          {/* =================
              BEST MENU
          ================== */}

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-[14px] font-bold text-black">
              Menu Terlaris{" "}
              {data.label}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f8f8] text-left text-[11px] font-semibold text-gray-500">
                    <th className="rounded-l-lg px-3 py-3">
                      #
                    </th>

                    <th className="px-3 py-3">
                      Nama Menu
                    </th>

                    <th className="px-3 py-3">
                      Terjual
                    </th>

                    <th className="rounded-r-lg px-3 py-3">
                      Pendapatan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bestMenus.map(
                    (
                      menu,
                      index
                    ) => (
                      <tr
                        key={
                          menu.id
                        }
                        className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {index +
                            1}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                menu.image
                              }
                              alt={
                                menu.name
                              }
                              width={
                                34
                              }
                              height={
                                34
                              }
                              className="h-[34px] w-[34px] rounded-lg object-cover"
                            />

                            <span className="font-medium text-gray-800">
                              {
                                menu.name
                              }
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {
                            menu.sold
                          }
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5 font-medium">
                          {formatCurrency(
                            menu.revenue
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =================
              LATEST ORDERS
          ================== */}

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-black">
                Pesanan Terbaru
              </h2>

              <Link
                href="/orders"
                className="rounded-md px-2 py-1 text-[10px] font-medium text-blue-500 transition hover:bg-blue-50"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f8f8] text-left text-[11px] font-semibold text-gray-500">
                    <th className="rounded-l-lg px-3 py-3">
                      #
                    </th>

                    <th className="px-3 py-3">
                      Waktu
                    </th>

                    <th className="px-3 py-3">
                      Menu
                    </th>

                    <th className="px-3 py-3">
                      Total
                    </th>

                    <th className="rounded-r-lg px-3 py-3">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {latestOrders.map(
                    (order) => (
                      <tr
                        key={
                          order.id
                        }
                        className="text-[11px] text-gray-700 transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {
                            order.id
                          }
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {
                            order.time
                          }
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Image
                              src={
                                order.image
                              }
                              alt={
                                order.menu
                              }
                              width={
                                32
                              }
                              height={
                                32
                              }
                              className="h-[32px] w-[32px] rounded-lg object-cover"
                            />

                            <span className="font-medium text-gray-800">
                              {
                                order.menu
                              }
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          {formatCurrency(
                            order.total
                          )}
                        </td>

                        <td className="border-b border-gray-100 px-3 py-2.5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[9px] font-semibold ${statusStyle(
                              order.status
                            )}`}
                          >
                            {
                              order.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
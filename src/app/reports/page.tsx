
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { reportService } from "@/services/reportService";

import {
  Banknote,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period =
  | "today"
  | "week"
  | "month"
  | "sixMonths"
  | "year";

type ReportData = {
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
  revenueChange: number | null;
  orderChange: number | null;
  averageChange: number | null;
  comparison: string;
  chart: {
    label: string;
    revenue: number;
    orders: number;
  }[];
  bestMenus: {
    id: number;
    name: string;
    sold: number;
    revenue: number;
    image: string | null;
  }[];
  categories: {
    name: string;
    value: number;
  }[];
};

const EMPTY: ReportData = {
  totalRevenue: 0,
  totalOrders: 0,
  averageOrder: 0,
  revenueChange: null,
  orderChange: null,
  averageChange: null,
  comparison: "dari periode sebelumnya",
  chart: [],
  bestMenus: [],
  categories: [
    "Makanan",
    "Minuman",
    "Kopi",
    "Snack",
  ].map((name) => ({
    name,
    value: 0,
  })),
};

const periodOptions: {
  value: Period;
  label: string;
}[] = [
  { value: "today", label: "Hari Ini" },
  { value: "week", label: "Minggu Ini" },
  { value: "month", label: "Bulan Ini" },
  { value: "sixMonths", label: "6 Bulan" },
  { value: "year", label: "1 Tahun" },
];

function getImageUrl(value: string | null): string {
  if (!value) return "";

  if (value.startsWith("/uploads/")) {
    const backend = (
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000"
    ).replace(/\/$/, "");

    return `${backend}${value}`;
  }

  return value;
}

function changeText(
  change: number | null,
  comparison: string
): string {
  if (change === null) {
    return `— ${comparison} (belum ada pembanding)`;
  }

  const sign =
    change > 0 ? "↑" :
    change < 0 ? "↓" : "→";

  return `${sign} ${Math.abs(change).toLocaleString(
    "id-ID",
    { maximumFractionDigits: 1 }
  )}% ${comparison}`;
}

function getPeriodLabel(period: Period): string {
  return (
    periodOptions.find(
      (item) => item.value === period
    )?.label ?? "Laporan"
  );
}

function formatFileDate(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPeriodDescription(
  period: Period,
  now: Date
): string {
  const dateText = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const end = new Date(start);

  if (period === "today") {
    return dateText(start);
  }

  if (period === "week") {
    const day = (start.getDay() + 6) % 7;

    start.setDate(start.getDate() - day);
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 6);

    return `${dateText(start)} - ${dateText(end)}`;
  }

  if (period === "month") {
    start.setDate(1);

    end.setFullYear(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    return `${dateText(start)} - ${dateText(end)}`;
  }

  if (period === "sixMonths") {
    start.setDate(1);
    start.setMonth(start.getMonth() - 5);

    end.setFullYear(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    return `${dateText(start)} - ${dateText(end)}`;
  }

  start.setMonth(0, 1);
  end.setMonth(11, 31);

  return `${dateText(start)} - ${dateText(end)}`;
}

export default function ReportsPage() {
  const [period, setPeriod] =
    useState<Period>("month");

  const [loadedPeriod, setLoadedPeriod] =
    useState<Period | null>(null);

  const [data, setData] =
    useState<ReportData>(EMPTY);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [downloading, setDownloading] =
    useState<"pdf" | "excel" | null>(null);

  /* =========================
     LOAD DATA FROM BACKEND
  ========================= */

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");
    setLoadedPeriod(null);

    reportService
      .getOverview(period)
      .then((response) => {
        if (active) {
          setData(response.data);
          setLoadedPeriod(period);
        }
      })
      .catch((err) => {
        if (active) {
          setData(EMPTY);
          setLoadedPeriod(null);

          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat laporan."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [period]);

  const bestMenus = data.bestMenus;
  const categories = data.categories;

  const pieColors = [
    "#00b96b",
    "#168be5",
    "#ffb020",
    "#ff7a1a",
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  /* =========================
     CHART DATA
  ========================= */

  // Khusus hari ini:
  // Kelompok jam 08:30 sampai 22:30.
  // Periode lainnya tetap mengikuti API.
  const chartData =
    period === "today"
      ? data.chart
          .filter((item) => {
            const hour = Number(
              String(item.label).split(":")[0]
            );

            return (
              Number.isFinite(hour) &&
              hour >= 8 &&
              hour <= 22
            );
          })
          .map((item) => {
            const hour = Number(
              String(item.label).split(":")[0]
            );

            return {
              ...item,
              label:
                hour === 8
                  ? "08:30"
                  : hour === 22
                    ? "22:30"
                    : item.label,
            };
          })
      : data.chart;

  /* =========================
     DOWNLOAD PDF
  ========================= */

  const downloadPDF = async (
    report: ReportData,
    selectedPeriod: Period
  ) => {
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const now = new Date();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    const periodLabel =
      getPeriodLabel(selectedPeriod);

    const periodDescription =
      getPeriodDescription(selectedPeriod, now);

    const money = (value: number) =>
      `Rp ${Math.round(value).toLocaleString("id-ID")}`;

    const number = (value: number) =>
      value.toLocaleString("id-ID");

    let y = 20;

    const ensureSpace = (height = 9) => {
      if (y + height > pageHeight - 18) {
        pdf.addPage();
        y = 20;
      }
    };

    const line = () => {
      ensureSpace(5);

      pdf.setDrawColor(225, 225, 225);
      pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 6;
    };

    const sectionTitle = (text: string) => {
      ensureSpace(15);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(30, 30, 30);

      pdf.text(text, margin, y);
      y += 6;

      line();
    };

    const row = (
      left: string,
      right: string,
      bold = false
    ) => {
      ensureSpace(7);

      pdf.setFont(
        "helvetica",
        bold ? "bold" : "normal"
      );

      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);

      const rightWidth = pdf.getTextWidth(right);
      const maxLeftWidth =
        contentWidth - rightWidth - 8;

      const leftLines =
        pdf.splitTextToSize(
          left,
          Math.max(40, maxLeftWidth)
        ) as string[];

      pdf.text(leftLines, margin, y);

      pdf.text(
        right,
        pageWidth - margin,
        y,
        { align: "right" }
      );

      y += Math.max(
        7,
        leftLines.length * 4.5 + 2
      );
    };

    const tableHeader = (
      columns: [string, string, string]
    ) => {
      ensureSpace(10);

      pdf.setFillColor(245, 245, 245);

      pdf.rect(
        margin,
        y - 5,
        contentWidth,
        9,
        "F"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(40, 40, 40);

      pdf.text(columns[0], margin + 2, y);

      pdf.text(
        columns[1],
        margin + contentWidth * 0.58,
        y,
        { align: "right" }
      );

      pdf.text(
        columns[2],
        pageWidth - margin - 2,
        y,
        { align: "right" }
      );

      y += 8;
    };

    const tableRow = (
      left: string,
      middle: string,
      right: string
    ) => {
      ensureSpace(9);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(50, 50, 50);

      const leftLines =
        pdf.splitTextToSize(
          left,
          contentWidth * 0.44
        ) as string[];

      pdf.text(leftLines, margin + 2, y);

      pdf.text(
        middle,
        margin + contentWidth * 0.58,
        y,
        { align: "right" }
      );

      pdf.text(
        right,
        pageWidth - margin - 2,
        y,
        { align: "right" }
      );

      y += Math.max(
        8,
        leftLines.length * 4.5 + 2
      );
    };

    // HEADER LAPORAN
    pdf.setFillColor(230, 49, 49);
    pdf.rect(0, 0, pageWidth, 8, "F");

    pdf.setTextColor(230, 49, 49);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text("TAP JAYA", margin, y);

    y += 9;

    pdf.setTextColor(25, 25, 25);
    pdf.setFontSize(15);

    pdf.text(
      "LAPORAN KEUANGAN",
      margin,
      y
    );

    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);

    pdf.text(
      `Periode: ${periodLabel}`,
      margin,
      y
    );

    y += 5;

    pdf.text(
      periodDescription,
      margin,
      y
    );

    y += 5;

    pdf.text(
      `Dicetak: ${now.toLocaleString("id-ID")}`,
      margin,
      y
    );

    y += 10;
    line();

    // RINGKASAN
    sectionTitle("RINGKASAN KEUANGAN");

    row(
      "Total Pendapatan",
      money(report.totalRevenue),
      true
    );

    row(
      "Total Pesanan",
      number(report.totalOrders),
      true
    );

    row(
      "Rata-rata Pesanan",
      money(report.averageOrder),
      true
    );

    y += 6;

    // RINCIAN PERIODE
    sectionTitle("RINCIAN PENDAPATAN DAN PESANAN");

    tableHeader([
      selectedPeriod === "today"
        ? "Jam"
        : "Periode",
      "Pesanan",
      "Pendapatan",
    ]);

    if (report.chart.length === 0) {
      row(
        "Belum ada transaksi pada periode ini.",
        ""
      );
    } else {
      for (const item of report.chart) {
        tableRow(
          item.label,
          number(item.orders),
          money(item.revenue)
        );
      }
    }

    y += 7;

    // MENU TERLARIS
    sectionTitle("MENU TERLARIS");

    tableHeader([
      "Nama Menu",
      "Terjual",
      "Pendapatan",
    ]);

    if (report.bestMenus.length === 0) {
      row(
        "Belum ada penjualan.",
        ""
      );
    } else {
      for (const item of report.bestMenus) {
        tableRow(
          item.name,
          number(item.sold),
          money(item.revenue)
        );
      }
    }

    y += 7;

    // KATEGORI
    sectionTitle("PENDAPATAN PER KATEGORI");

    for (const item of report.categories) {
      row(
        item.name,
        `${item.value.toLocaleString(
          "id-ID",
          { maximumFractionDigits: 1 }
        )}%`
      );
    }

    y += 7;
    line();

    ensureSpace(12);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);

    pdf.text(
      "TOTAL PENDAPATAN",
      margin,
      y
    );

    pdf.text(
      money(report.totalRevenue),
      pageWidth - margin,
      y,
      { align: "right" }
    );

    // NOMOR HALAMAN
    const totalPages =
      pdf.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      pdf.setPage(page);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(130, 130, 130);

      pdf.text(
        `TAP JAYA | Halaman ${page} dari ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    const filename =
      `Laporan_Keuangan_TAP_JAYA_` +
      `${selectedPeriod}_` +
      `${formatFileDate(now)}.pdf`;

    pdf.save(filename);
  };

  /* =========================
     DOWNLOAD EXCEL
  ========================= */

  
const downloadExcel = async (
  report: ReportData,
  selectedPeriod: Period
) => {
  const { Workbook } = await import("exceljs");

  const workbook = new Workbook();
  const now = new Date();

  workbook.creator = "TAP JAYA";
  workbook.subject = "Laporan Keuangan TAP JAYA";
  workbook.title = "Laporan Keuangan TAP JAYA";
  workbook.created = now;

  const RED = "E63131";
  const DARK_RED = "B91C1C";
  const WHITE = "FFFFFF";
  const DARK = "1F2937";
  const GRAY = "6B7280";
  const LIGHT = "F9FAFB";
  const BORDER = "E5E7EB";
  const GREEN = "15803D";

  const rupiahFormat = '"Rp" #,##0';
  const numberFormat = '#,##0';
  const percentFormat = '0.00"%"';

  const periodLabel = getPeriodLabel(selectedPeriod);
  const periodDescription =
    getPeriodDescription(selectedPeriod, now);

  // Membuat worksheet dengan judul dan header TAP JAYA.
  const createSheet = (
    name: string,
    headers: string[],
    widths: number[]
  ) => {
    const sheet = workbook.addWorksheet(name, {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      },
    });

    sheet.columns = widths.map((width) => ({
      width,
    }));

    const lastColumn = String.fromCharCode(
      64 + headers.length
    );

    // JUDUL UTAMA
    sheet.mergeCells(`A1:${lastColumn}2`);

    const titleCell = sheet.getCell("A1");

    titleCell.value = "LAPORAN KEUANGAN TAP JAYA";
    titleCell.font = {
      name: "Calibri",
      size: 17,
      bold: true,
      color: { argb: WHITE },
    };

    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: RED },
    };

    titleCell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    sheet.getRow(1).height = 24;
    sheet.getRow(2).height = 24;

    // PERIODE
    sheet.mergeCells(`A3:${lastColumn}3`);

    const periodCell = sheet.getCell("A3");

    periodCell.value =
      `${periodLabel} | ${periodDescription}`;

    periodCell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: DARK },
    };

    periodCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    sheet.getRow(3).height = 24;

    // HEADER TABEL
    const headerRow = sheet.getRow(5);

    headerRow.values = headers;
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
      cell.font = {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: WHITE },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: DARK_RED },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: {
          style: "thin",
          color: { argb: BORDER },
        },
        bottom: {
          style: "thin",
          color: { argb: BORDER },
        },
        left: {
          style: "thin",
          color: { argb: BORDER },
        },
        right: {
          style: "thin",
          color: { argb: BORDER },
        },
      };
    });

    // Header tetap terlihat saat Excel di-scroll.
    sheet.views = [
      {
        state: "frozen",
        ySplit: 5,
      },
    ];

    sheet.headerFooter.oddFooter =
      "TAP JAYA | Halaman &P dari &N";

    return sheet;
  };

  // Memberi format pada isi tabel.
  const styleDataRows = (
    sheet: ReturnType<typeof createSheet>,
    startRow = 6
  ) => {
    for (
      let rowIndex = startRow;
      rowIndex <= sheet.rowCount;
      rowIndex++
    ) {
      const row = sheet.getRow(rowIndex);

      row.height = 24;

      row.eachCell(
        { includeEmpty: true },
        (cell) => {
          cell.font = {
            name: "Calibri",
            size: 11,
            color: { argb: DARK },
          };

          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          if (rowIndex % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: LIGHT },
            };
          }

          cell.border = {
            bottom: {
              style: "thin",
              color: { argb: BORDER },
            },
          };
        }
      );
    }
  };

  // =========================
  // SHEET 1: RINGKASAN
  // =========================

  const summary = createSheet(
    "Ringkasan",
    ["Keterangan", "Nilai"],
    [38, 28]
  );

  const summaryRows: Array<
    [string, string | number]
  > = [
    ["Nama Usaha", "TAP JAYA"],
    ["Periode", periodLabel],
    ["Rentang Tanggal", periodDescription],
    [
      "Tanggal Download",
      now.toLocaleString("id-ID"),
    ],
    ["Total Pendapatan", report.totalRevenue],
    ["Total Pesanan", report.totalOrders],
    ["Rata-rata Pesanan", report.averageOrder],
    [
      "Perubahan Pendapatan",
      report.revenueChange ?? "-",
    ],
    [
      "Perubahan Pesanan",
      report.orderChange ?? "-",
    ],
    [
      "Perubahan Rata-rata",
      report.averageChange ?? "-",
    ],
  ];

  for (const item of summaryRows) {
    summary.addRow(item);
  }

  styleDataRows(summary);

  // Row 10: Total Pendapatan
  summary.getCell("B10").numFmt = rupiahFormat;

  // Row 11: Total Pesanan
  summary.getCell("B11").numFmt = numberFormat;

  // Row 12: Rata-rata Pesanan
  summary.getCell("B12").numFmt = rupiahFormat;

  // Row 13-15: Persentase
  for (const rowNumber of [13, 14, 15]) {
    summary.getCell(`B${rowNumber}`).numFmt =
      percentFormat;
  }

  // Tonjolkan nilai pendapatan.
  for (const cellAddress of ["A10", "B10"]) {
    const cell = summary.getCell(cellAddress);

    cell.font = {
      name: "Calibri",
      size: 12,
      bold: true,
      color: { argb: GREEN },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "F0FDF4" },
    };
  }

  // =========================
  // SHEET 2: RINCIAN PENDAPATAN
  // =========================

  const details = createSheet(
    "Rincian Pendapatan",
    [
      "No.",
      selectedPeriod === "today"
        ? "Jam"
        : "Periode",
      "Jumlah Pesanan",
      "Pendapatan (Rp)",
    ],
    [10, 28, 22, 28]
  );

  report.chart.forEach((item, index) => {
    details.addRow([
      index + 1,
      item.label,
      item.orders,
      item.revenue,
    ]);
  });

  styleDataRows(details);

  for (
    let i = 6;
    i <= details.rowCount;
    i++
  ) {
    details.getCell(`C${i}`).numFmt =
      numberFormat;

    details.getCell(`D${i}`).numFmt =
      rupiahFormat;
  }

  // TOTAL dari ringkasan API.
  const detailTotalRow = details.addRow([
    "",
    "TOTAL LAPORAN",
    report.totalOrders,
    report.totalRevenue,
  ]);

  detailTotalRow.eachCell((cell) => {
    cell.font = {
      name: "Calibri",
      bold: true,
      size: 11,
      color: { argb: WHITE },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: RED },
    };

    cell.alignment = {
      vertical: "middle",
    };
  });

  detailTotalRow.height = 28;
  detailTotalRow.getCell(3).numFmt =
    numberFormat;

  detailTotalRow.getCell(4).numFmt =
    rupiahFormat;

  // =========================
  // SHEET 3: MENU TERLARIS
  // =========================

  const menus = createSheet(
    "Menu Terlaris",
    [
      "No.",
      "Nama Menu",
      "Jumlah Terjual",
      "Pendapatan (Rp)",
    ],
    [10, 38, 22, 28]
  );

  report.bestMenus.forEach(
    (item, index) => {
      menus.addRow([
        index + 1,
        item.name,
        item.sold,
        item.revenue,
      ]);
    }
  );

  styleDataRows(menus);

  for (
    let i = 6;
    i <= menus.rowCount;
    i++
  ) {
    menus.getCell(`C${i}`).numFmt =
      numberFormat;

    menus.getCell(`D${i}`).numFmt =
      rupiahFormat;
  }

  // =========================
  // SHEET 4: KATEGORI
  // =========================

  const categoriesSheet = createSheet(
    "Kategori",
    [
      "No.",
      "Kategori Produk",
      "Kontribusi Pendapatan (%)",
    ],
    [10, 32, 35]
  );

  report.categories.forEach(
    (item, index) => {
      categoriesSheet.addRow([
        index + 1,
        item.name,
        item.value,
      ]);
    }
  );

  styleDataRows(categoriesSheet);

  for (
    let i = 6;
    i <= categoriesSheet.rowCount;
    i++
  ) {
    categoriesSheet.getCell(`C${i}`).numFmt =
      percentFormat;
  }

  // =========================
  // DOWNLOAD FILE
  // =========================

  const buffer =
    await workbook.xlsx.writeBuffer();

  // Buat ArrayBuffer baru agar kompatibel
  // dengan Blob di browser dan TypeScript.
  const bytes = new Uint8Array(
    buffer.byteLength
  );

  bytes.set(new Uint8Array(buffer));

  const blob = new Blob(
    [bytes.buffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  const url = URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  const filename =
    `Laporan_Keuangan_TAP_JAYA_` +
    `${selectedPeriod}_` +
    `${formatFileDate(now)}.xlsx`;

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

  /* =========================
     HANDLE DOWNLOAD
  ========================= */

  const handleDownload = async (
    format: "pdf" | "excel"
  ) => {
    if (
      loading ||
      error ||
      loadedPeriod !== period ||
      downloading
    ) {
      return;
    }

    setDownloading(format);

    try {
      if (format === "pdf") {
        await downloadPDF(data, period);
      } else {
        await downloadExcel(data, period);
      }
    } catch (err) {
      console.error(
        "Gagal membuat laporan:",
        err
      );

      window.alert(
        err instanceof Error
          ? `Gagal mengunduh laporan: ${err.message}`
          : "Gagal mengunduh laporan."
      );
    } finally {
      setDownloading(null);
    }
  };

  const canDownload =
    !loading &&
    !error &&
    loadedPeriod === period &&
    downloading === null;

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />

      <section className="min-w-0 flex-1 p-5">
        {/* HEADER */}

        <div className="mb-5">
          <AdminHeader
            title="Laporan Keuangan"
            subtitle="Lihat ringkasan pendapatan dan transaksi caffe Anda."
          />
        </div>

        {/* PERIOD FILTER */}

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {periodOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setPeriod(item.value)
              }
              className={`h-[40px] rounded-lg border text-[11px] font-medium transition ${
                period === item.value
                  ? "border-[#e63131] bg-[#e63131] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* DOWNLOAD BUTTONS */}

        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            disabled={!canDownload}
            onClick={() =>
              void handleDownload("pdf")
            }
            className="flex h-[40px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-[11px] font-semibold text-gray-700 transition hover:border-red-300 hover:text-[#e63131] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={15} />

            {downloading === "pdf"
              ? "Membuat PDF..."
              : "Download PDF"}

            <Download size={13} />
          </button>

          <button
            type="button"
            disabled={!canDownload}
            onClick={() =>
              void handleDownload("excel")
            }
            className="flex h-[40px] items-center justify-center gap-2 rounded-lg bg-[#e63131] px-4 text-[11px] font-semibold text-white transition hover:bg-[#ca2929] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={15} />

            {downloading === "excel"
              ? "Membuat Excel..."
              : "Download Excel"}

            <Download size={13} />
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-3 text-[11px] text-red-600"
          >
            {error}
          </p>
        )}

        {loading && (
          <p
            role="status"
            className="mb-3 text-[11px] text-gray-500"
          >
            Memuat laporan...
          </p>
        )}

        {/* SUMMARY */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* TOTAL PENDAPATAN */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-50 p-2">
                <Banknote
                  size={20}
                  className="text-green-500"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  Total Pendapatan
                </p>

                <p className="mt-1 text-[21px] font-bold text-black">
                  {formatCurrency(
                    data.totalRevenue
                  )}
                </p>

                <p className="mt-2 text-[9px] font-medium text-green-500">
                  {changeText(
                    data.revenueChange,
                    data.comparison
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL PESANAN */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <ClipboardList
                  size={20}
                  className="text-blue-500"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  Total Pesanan
                </p>

                <p className="mt-1 text-[21px] font-bold text-black">
                  {data.totalOrders.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p className="mt-2 text-[9px] font-medium text-green-500">
                  {changeText(
                    data.orderChange,
                    data.comparison
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* RATA-RATA */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-yellow-50 p-2">
                <TrendingUp
                  size={20}
                  className="text-yellow-500"
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  Rata-rata Pesanan
                </p>

                <p className="mt-1 text-[21px] font-bold text-black">
                  {formatCurrency(
                    data.averageOrder
                  )}
                </p>

                <p className="mt-2 text-[9px] font-medium text-green-500">
                  {changeText(
                    data.averageChange,
                    data.comparison
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CHART + MENU TERLARIS */}

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_0.85fr]">
          {/* CHART */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[14px] font-bold">
                Grafik Pendapatan
              </h2>

              <div className="flex items-center gap-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Tren Pesanan
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-200" />
                  Jumlah Pesanan
                </div>
              </div>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <ComposedChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />

                  <YAxis
                    yAxisId="left"
                    tick={{
                      fontSize: 8,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{
                      fontSize: 8,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />

                  <Tooltip
                    formatter={(value, name) =>
                      name === "revenue"
                        ? formatCurrency(
                            Number(value ?? 0)
                          )
                        : Number(
                            value ?? 0
                          ).toLocaleString("id-ID")
                    }
                  />

                  <Bar
                    yAxisId="left"
                    dataKey="orders"
                    fill="#fecaca"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BEST MENU */}

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-[14px] font-bold">
              Menu Terlaris
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f7f7f7] text-left text-[10px] font-semibold text-gray-600">
                    <th className="rounded-l-lg px-2 py-2.5">
                      No.
                    </th>

                    <th className="px-2 py-2.5">
                      Menu
                    </th>

                    <th className="px-2 py-2.5">
                      Terjual
                    </th>

                    <th className="rounded-r-lg px-2 py-2.5">
                      Pendapatan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bestMenus.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-[11px] text-gray-400"
                      >
                        Belum ada penjualan pada periode ini.
                      </td>
                    </tr>
                  )}

                  {bestMenus.map(
                    (item, index) => (
                      <tr
                        key={item.id}
                        className="text-[10px] text-gray-700 transition hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-100 px-2 py-2.5">
                          {index + 1}
                        </td>

                        <td className="border-b border-gray-100 px-2 py-2.5">
                          <div className="flex items-center gap-2">
                            {item.image ? (
                              <Image
                                unoptimized
                                src={getImageUrl(
                                  item.image
                                )}
                                alt={item.name}
                                width={30}
                                height={30}
                                className="h-[30px] w-[30px] rounded-lg object-cover"
                              />
                            ) : (
                              <span className="h-[30px] w-[30px] rounded-lg bg-gray-100" />
                            )}

                            <span className="font-medium text-gray-800">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-100 px-2 py-2.5">
                          {item.sold}
                        </td>

                        <td className="border-b border-gray-100 px-2 py-2.5">
                          {formatCurrency(
                            item.revenue
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CATEGORY */}

        <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-[14px] font-bold">
            Pendapatan per Kategori
          </h2>

          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="h-[190px] w-[220px] shrink-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={78}
                  >
                    {categories.map(
                      (category, index) => (
                        <Cell
                          key={category.name}
                          fill={pieColors[index]}
                        />
                      )
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full flex-1">
              {categories.map(
                (category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between border-b border-gray-100 py-3 last:border-none"
                  >
                    <div className="flex items-center gap-3 text-[11px] text-gray-700">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            pieColors[index],
                        }}
                      />

                      {category.name}
                    </div>

                    <span className="text-[11px] font-bold text-gray-800">
                      {category.value.toLocaleString(
                        "id-ID",
                        {
                          maximumFractionDigits: 1,
                        }
                      )}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

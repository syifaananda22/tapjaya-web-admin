import { apiRequest } from "@/lib/api";

export type Period =
  | "today"
  | "week"
  | "month"
  | "sixMonths"
  | "year";

export type ReportData = {
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

export const reportService = {
  getOverview(period: Period) {
    return apiRequest<{ data: ReportData }>(
      `/api/reports/overview?period=${period}`
    );
  },
};
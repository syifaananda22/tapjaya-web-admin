export type Period =
  | "7hari"
  | "1bulan"
  | "6bulan"
  | "1tahun";

export type RevenueItem = {
  label: string;
  income: number;
};

export type CategoryItem = {
  name: string;
  value: number;
};

export type BestMenu = {
  id: number;
  name: string;
  image: string;
  sold: number;
  revenue: number;
};

export type LatestOrder = {
  id: string;
  time: string;
  menu: string;
  image: string;
  total: number;
  status: string;
};

export const revenueData: Record<
  Period,
  RevenueItem[]
> = {
  "7hari": [
    { label: "26 Sep", income: 200000 },
    { label: "27 Sep", income: 520000 },
    { label: "28 Sep", income: 430000 },
    { label: "29 Sep", income: 710000 },
    { label: "30 Sep", income: 1080000 },
    { label: "1 Okt", income: 590000 },
    { label: "2 Okt", income: 850000 },
  ],

  "1bulan": [
    {
      label: "Minggu 1",
      income: 2800000,
    },
    {
      label: "Minggu 2",
      income: 3500000,
    },
    {
      label: "Minggu 3",
      income: 3200000,
    },
    {
      label: "Minggu 4",
      income: 4540000,
    },
  ],

  "6bulan": [
    { label: "Mei", income: 12500000 },
    { label: "Jun", income: 13800000 },
    { label: "Jul", income: 15200000 },
    { label: "Agu", income: 14600000 },
    { label: "Sep", income: 17300000 },
    { label: "Okt", income: 18900000 },
  ],

  "1tahun": [
    { label: "Nov", income: 11500000 },
    { label: "Des", income: 13200000 },
    { label: "Jan", income: 12900000 },
    { label: "Feb", income: 14100000 },
    { label: "Mar", income: 14900000 },
    { label: "Apr", income: 15300000 },
    { label: "Mei", income: 16000000 },
    { label: "Jun", income: 17200000 },
    { label: "Jul", income: 16600000 },
    { label: "Agu", income: 18100000 },
    { label: "Sep", income: 19300000 },
    { label: "Okt", income: 20500000 },
  ],
};

export const categoryData: Record<
  Period,
  CategoryItem[]
> = {
  "7hari": [
    { name: "Makanan", value: 40.5 },
    { name: "Minuman", value: 28.3 },
    { name: "Kopi", value: 16.2 },
    { name: "Snack", value: 15 },
  ],

  "1bulan": [
    { name: "Makanan", value: 38 },
    { name: "Minuman", value: 30 },
    { name: "Kopi", value: 20 },
    { name: "Snack", value: 12 },
  ],

  "6bulan": [
    { name: "Makanan", value: 42 },
    { name: "Minuman", value: 25 },
    { name: "Kopi", value: 21 },
    { name: "Snack", value: 12 },
  ],

  "1tahun": [
    { name: "Makanan", value: 39 },
    { name: "Minuman", value: 29 },
    { name: "Kopi", value: 19 },
    { name: "Snack", value: 13 },
  ],
};

export const bestMenus: BestMenu[] = [
  {
    id: 1,
    name: "Bakmi Jaya",
    image: "/images/menu/bakmi-jaya.jpg",
    sold: 36,
    revenue: 1083000,
  },
  {
    id: 2,
    name: "Kopi Susu Berjaya",
    image: "/images/menu/kopi-susu.jpg",
    sold: 32,
    revenue: 795600,
  },
  {
    id: 3,
    name: "Nasi Goreng Jawa",
    image: "/images/menu/nasi-goreng.jpg",
    sold: 28,
    revenue: 591600,
  },
  {
    id: 4,
    name: "Mie Goreng Jawa",
    image: "/images/menu/mie-goreng.jpg",
    sold: 24,
    revenue: 581600,
  },
  {
    id: 5,
    name: "Milkshake Mango",
    image:
      "/images/menu/milkshake-mango.jpg",
    sold: 20,
    revenue: 491600,
  },
];

export const latestOrders: LatestOrder[] = [
  {
    id: "#0022",
    time: "12:28",
    menu: "Bakmi Jaya",
    image: "/images/menu/bakmi-jaya.jpg",
    total: 26187,
    status: "Menunggu",
  },
  {
    id: "#0021",
    time: "12:15",
    menu: "Kopi Susu Berjaya",
    image: "/images/menu/kopi-susu.jpg",
    total: 24345,
    status: "Diproses",
  },
  {
    id: "#0020",
    time: "11:40",
    menu: "Nasi Goreng Jawa",
    image: "/images/menu/nasi-goreng.jpg",
    total: 42321,
    status: "Siap",
  },
  {
    id: "#0019",
    time: "11:23",
    menu: "Mie Goreng Jawa",
    image: "/images/menu/mie-goreng.jpg",
    total: 15435,
    status: "Selesai",
  },
];
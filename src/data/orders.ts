export type OrderStatus =
  | "Menunggu"
  | "Diproses"
  | "Siap"
  | "Selesai";

export type OrderItem = {
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  date: string;
  time: string;
  customerName: string;
  tableNumber: string;
  orderType: "Dine-in" | "Takeaway";
  menu: string;
  image: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  note?: string;
};

export const orders: Order[] = [
  {
    id: "0002",
    date: "2026-10-02",
    time: "12:28",
    customerName: "Amanda",
    tableNumber: "07",
    orderType: "Dine-in",
    menu: "Bakmi Jaya",
    image: "/images/menu/bakmi-jaya.jpg",
    total: 26182,
    status: "Menunggu",
    items: [
      {
        name: "Bakmi Jaya",
        image: "/images/menu/bakmi-jaya.jpg",
        quantity: 1,
        price: 26182,
      },
    ],
    note: "Tidak terlalu pedas.",
  },

  {
    id: "0001",
    date: "2026-10-02",
    time: "12:15",
    customerName: "Budi",
    tableNumber: "05",
    orderType: "Dine-in",
    menu: "Kopi Susu Berjaya",
    image: "/images/menu/kopi-susu.jpg",
    total: 24545,
    status: "Diproses",
    items: [
      {
        name: "Kopi Susu Berjaya",
        image: "/images/menu/kopi-susu.jpg",
        quantity: 1,
        price: 24545,
      },
    ],
  },

  {
    id: "0000",
    date: "2026-10-02",
    time: "11:46",
    customerName: "Citra",
    tableNumber: "03",
    orderType: "Dine-in",
    menu: "Nasi Goreng Jaya",
    image: "/images/menu/nasi-goreng.jpg",
    total: 42211,
    status: "Siap",
    items: [
      {
        name: "Nasi Goreng Jaya",
        image: "/images/menu/nasi-goreng.jpg",
        quantity: 1,
        price: 42211,
      },
    ],
  },

  {
    id: "0029",
    date: "2026-10-02",
    time: "11:20",
    customerName: "Dinda",
    tableNumber: "04",
    orderType: "Dine-in",
    menu: "Mie Goreng Jaya",
    image: "/images/menu/mie-goreng.jpg",
    total: 31500,
    status: "Selesai",
    items: [
      {
        name: "Mie Goreng Jaya",
        image: "/images/menu/mie-goreng.jpg",
        quantity: 1,
        price: 31500,
      },
    ],
  },

  {
    id: "0008",
    date: "2026-10-02",
    time: "10:56",
    customerName: "Elvien",
    tableNumber: "09",
    orderType: "Dine-in",
    menu: "Milkshake Mango",
    image: "/images/menu/milkshake-mango.jpg",
    total: 34545,
    status: "Menunggu",
    items: [
      {
        name: "Milkshake Mango",
        image: "/images/menu/milkshake-mango.jpg",
        quantity: 1,
        price: 34545,
      },
    ],
  },

  {
    id: "0027",
    date: "2026-10-02",
    time: "10:34",
    customerName: "Gunawan",
    tableNumber: "02",
    orderType: "Dine-in",
    menu: "Bakmi Jaya",
    image: "/images/menu/bakmi-jaya.jpg",
    total: 52364,
    status: "Selesai",
    items: [
      {
        name: "Bakmi Jaya",
        image: "/images/menu/bakmi-jaya.jpg",
        quantity: 2,
        price: 26182,
      },
    ],
  },

  {
    id: "0005",
    date: "2026-10-02",
    time: "09:56",
    customerName: "Rani",
    tableNumber: "04",
    orderType: "Dine-in",
    menu: "Kopi Susu Berjaya",
    image: "/images/menu/kopi-susu.jpg",
    total: 49090,
    status: "Selesai",
    items: [
      {
        name: "Kopi Susu Berjaya",
        image: "/images/menu/kopi-susu.jpg",
        quantity: 2,
        price: 24545,
      },
    ],
  },

  {
    id: "0004",
    date: "2026-10-02",
    time: "09:32",
    customerName: "Salsa",
    tableNumber: "11",
    orderType: "Dine-in",
    menu: "Milkshake Mango",
    image: "/images/menu/milkshake-mango.jpg",
    total: 69100,
    status: "Diproses",
    items: [
      {
        name: "Milkshake Mango",
        image: "/images/menu/milkshake-mango.jpg",
        quantity: 2,
        price: 34550,
      },
    ],
  },

  {
    id: "0003",
    date: "2026-10-02",
    time: "09:18",
    customerName: "Fira",
    tableNumber: "08",
    orderType: "Dine-in",
    menu: "Nasi Goreng Jaya",
    image: "/images/menu/nasi-goreng.jpg",
    total: 84422,
    status: "Siap",
    items: [
      {
        name: "Nasi Goreng Jaya",
        image: "/images/menu/nasi-goreng.jpg",
        quantity: 2,
        price: 42211,
      },
    ],
  },

  {
    id: "0009",
    date: "2026-10-02",
    time: "08:45",
    customerName: "Nadia",
    tableNumber: "06",
    orderType: "Dine-in",
    menu: "Mie Goreng Jaya",
    image: "/images/menu/mie-goreng.jpg",
    total: 63000,
    status: "Menunggu",
    items: [
      {
        name: "Mie Goreng Jaya",
        image: "/images/menu/mie-goreng.jpg",
        quantity: 2,
        price: 31500,
      },
    ],
  },
];
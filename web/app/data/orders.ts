export type Order = {
  id: number;
  nama: string;
  kodeBarang: string;
  jumlah: number;
  status:
    | "request"
    | "potong"
    | "jahit"
    | "qc"
    | "gudang"
    | "selesai"
    | "rework"
    | "resi"; // ✅ TAMBAH INI
};

let orders: Order[] = [
  {
    id: 1,
    nama: "Kaos Hitam",
    kodeBarang: "K001",
    jumlah: 50,
    status: "request",
  },
];
let stokBarang: Record<string, number> = {
  K001: 0, // habis → biar masuk produksi
  K002: 100,
};

export const getStok = (kode: string) => {
  return stokBarang[kode] || 0;
};

export const getOrders = () => orders;

export const updateOrder = (id: number, newStatus: Order["status"]) => {
  orders = orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o));
};

export const addOrder = (order: Order) => {
  orders.push(order);
};

export const kurangiStok = (kode: string, jumlah: number) => {
  if (!stokBarang[kode]) stokBarang[kode] = 0;

  stokBarang[kode] -= jumlah;

  if (stokBarang[kode] < 0) stokBarang[kode] = 0;
};

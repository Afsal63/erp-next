/* ================= CUSTOMER ITEM (PRICE MAP) ================= */

export type CustomerItem = {
  _id: string;
  itemName: string;
  barCode: string;
  price: number;
};

/* ================= EXECUTIVE ITEM ================= */

export type ExecutiveItem = {
  _id: string;
  itemName: string;
  barCode: string;
  actualQty: number;
  price?: number;
};

/* ================= EXECUTIVE ================= */

export type Executive = {
  _id: string;
  name: string;
  surname?: string;
  items: ExecutiveItem[];
};

/* ================= CLIENT ================= */

export type Client = {
  _id: string;
  company: string;

  // 🔹 pricing mapped to customer
  items?: CustomerItem[]; // ✅ THIS FIXES YOUR ERROR

  executive?: Executive;

  clientTrnNumber?: string;
  customerDiscount?: string;
};
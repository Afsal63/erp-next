export type ItemSale = {
  barCode: string;
  itemName: string;
  quantity: number;
  amount: number;
};

export type OrderSummary = {
  _id: string;
  number: string;
  total: number;
  status: string;
};

export type ExecutiveDetails = {
  _id: string;
  name: string;
  surname: string;
  email: string;
};

export type ExecutiveSale = {
  executive: ExecutiveDetails;
  totalOrders: number;
  totalAmount: number;
  orders: OrderSummary[];
  items: ItemSale[];
};

export type DailySalesRow = {
  date: string;
  executives: ExecutiveSale[];
};
export type SaleOrderPerformanceItem = {
  status: string;
  percentage: number;
  count: number;
  amount: number; // mapped from total_amount
};

export type SaleOrderPerformance = SaleOrderPerformanceItem[];

export type InventoryItem = {
  _id: string;
  itemName: string;
  quantity: number;
  normalDiscountedPrice: number;
  unitOfMeasures: string;
};
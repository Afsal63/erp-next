import apiRequest from "@/lib/apiRequest";

const DashboardService = {
  getSaleOrderSummary: (id?: string) =>
    apiRequest(
      "GET",
      `/api/saleOrder/summary${id ? `?id=${id}` : ""}`
    ),

  getRecentSaleOrderList: (id?: string) =>
    apiRequest(
      "GET",
      `/api/executive/recent-orders${id ? `?Id=${id}` : ""}`
    ),

  getOrderSummary: (id?: string) =>
    apiRequest(
      "GET",
      `/api/executive/total-orders/details${id ? `?Id=${id}` : ""}`
    ),

  getRecentInventory: (id?: string) =>
    apiRequest(
      "GET",
      `/api/inventory/list${id ? `?id=${id}` : ""}`
    ),
};

export default DashboardService;
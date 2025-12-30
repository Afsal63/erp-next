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

  getCustomerSummary: (id?: string) =>
    apiRequest(
      "GET",
      `/api/customer/summary${id ? `?id=${id}` : ""}`
    ),

  getRecentInventory: (id?: string) =>
    apiRequest(
      "GET",
      `/api/inventory/list${id ? `?id=${id}` : ""}`
    ),
};

export default DashboardService;
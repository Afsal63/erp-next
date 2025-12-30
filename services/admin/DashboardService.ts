import apiRequest from "@/lib/apiRequest";

const DashboardService = {
  getSaleOrderSummary: () =>
    apiRequest("GET", "/api/saleOrder/summary"),

  getRecentSalerOrderList: () =>
    apiRequest("GET", "/api/recentSaleOrder/list"),

  getCustomerSummary: () =>
    apiRequest("GET", "/api/customer/summary"),

  getRecentInventory: () =>
    apiRequest("GET", "/api/inventory/list"),
};

export default DashboardService;
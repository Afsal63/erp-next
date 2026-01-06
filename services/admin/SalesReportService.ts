import apiRequest from "@/lib/apiRequest";

const SalesReportService = {
  /* ================= MONTHLY / CATEGORY ================= */

  getSalesReport: () =>
    apiRequest("GET", `/api/sales/list`),

  getSalesByCategory: (category: string) =>
    apiRequest("GET", `/api/sales/read/?category=${category}`),

  filterSalesByDate: ({
    category,
    fromDate,
    toDate,
    page = 1,
    items = 10,
  }: {
    category: string;
    fromDate: string;
    toDate: string;
    page?: number;
    items?: number;
  }) =>
    apiRequest(
      "POST",
      `/api/sales/filter?page=${page}&items=${items}&fromDate=${fromDate}&toDate=${toDate}&category=${category}`
    ),

  /* ================= DAILY SALES ================= */

  getDailySalesReport: () =>
    apiRequest("GET", `/api/saleOrder/daily-summary`),

  filterDailySalesByDate: ({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) =>
    apiRequest(
      "GET",
      `/api/saleOrder/daily-summary?fromDate=${fromDate}&toDate=${toDate}`
    ),
};

export default SalesReportService;
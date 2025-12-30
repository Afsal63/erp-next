import apiRequest from "@/lib/apiRequest";

const SalesReportService = {
  getSalesReport: () => apiRequest("GET", `/api/sales/list`),

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
};

export default SalesReportService;

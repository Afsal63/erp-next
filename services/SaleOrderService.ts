import apiRequest from "@/lib/apiRequest";

const SaleOrderService = {
  list: (page: number, limit: number) =>
    apiRequest("GET", `/api/saleOrder/list?page=${page}&items=${limit}`),

  search: (page: number, limit: number, query: string) =>
    apiRequest(
      "GET",
      `/api/saleOrder/search?page=${page}&items=${limit}&search=${query}`
    ),

  readById: (id: string) =>
    apiRequest("GET", `/api/saleOrder/read/${id}`),

  create: (data: any) =>
    apiRequest("POST", `/api/saleOrder/create`, data),

  update: (id: string, data: any) =>
    apiRequest("PATCH", `/api/saleOrder/update/${id}`, data),

  delete: (id: string) =>
    apiRequest("DELETE", `/api/saleOrder/delete/${id}`),

   /* ================= SALE ORDERS BY EMPLOYEE ================= */

     saleOrdersByClient: (
    clientId: string,
    page = 1,
    items = 10
  ) => {
    return apiRequest(
      "POST",
      `/api/saleOrder/filter?filter=client&equal=${clientId}&page=${page}&items=${items}`
    );
  },

  saleOrdersByEmployee: (
    employeeId: string,
    page = 1,
    items = 10
  ) =>
    apiRequest(
      "POST",
      `/api/saleOrder/filter?filter=executive&equal=${employeeId}&page=${page}&items=${items}`
    ),
};

export default SaleOrderService;
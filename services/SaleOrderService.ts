import apiRequest from "@/lib/apiRequest";

const SaleOrderService = {
  list: (page: number, limit: number) =>
    apiRequest("GET", `/api/saleOrder/list?page=${page}&items=${limit}`),

  search: (page: number, limit: number, query: string) =>
    apiRequest(
      "GET",
      `/api/saleOrder/list?page=${page}&items=${limit}&search=${query}`
    ),

  readById: (id: string) =>
    apiRequest("GET", `/api/saleOrder/read/${id}`),

  create: (data: any) =>
    apiRequest("POST", `/api/saleOrder/create`, data),

  update: (id: string, data: any) =>
    apiRequest("PUT", `/api/saleOrder/update/${id}`, data),

  delete: (id: string) =>
    apiRequest("DELETE", `/api/saleOrder/delete/${id}`),
};

export default SaleOrderService;
import apiRequest from "@/lib/apiRequest";

const CustomersService = {
  listCustomers: (page = 1, items = 10, search = "") =>
    apiRequest(
      "GET",
      `/api/customer/list?page=${page}&items=${items}&search=${search}`
    ),
  searchCustomers: (page = 1, items = 10, q = "", field = "company") =>
    apiRequest("POST", `/api/customer/filter?page=${page}&items=${items}`, {
      fields: field,
      q,
    }),

  create: (payload: any) => {
    return apiRequest("POST", "/api/customer/create", payload);
  },

  readById: (id: string) => apiRequest("GET", `/api/customer/read/${id}`),

  updateItem: (id: string, payload: any) =>
    apiRequest("PATCH", `/api/customer/update/${id}`, payload),

  deleteItem: (id: string) =>
    apiRequest("DELETE", `/api/customer/delete/${id}`),
};

export default CustomersService;

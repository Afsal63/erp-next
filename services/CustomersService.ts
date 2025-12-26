import apiRequest from "@/lib/apiRequest";

const CustomersService = {
  listCustomers: (page = 1, items = 10, search = "") =>
   apiRequest(
      "GET",
      `/api/customer/list?page=${page}&items=${items}&search=${search}`
    ),
      searchCustomers: (
    page = 1,
    items = 10,
    q = "",
    field = "company"
  ) =>
    apiRequest(
      "POST",
      `/api/customer/filter?page=${page}&items=${items}`,
      {
        fields: field,
        q,
      }
    ),
    
  readById: (id: string) =>
    apiRequest("GET", `/api/customer/read/${id}`),

 
};

export default CustomersService;
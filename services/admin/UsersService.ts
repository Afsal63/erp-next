import apiRequest from "@/lib/apiRequest";

const UsersService = {
  list: (page = 1, items = 10) =>
    apiRequest("GET", `/api/user/list?page=${page}&items=${items}`),

  create: (payload: any) => apiRequest("POST", `/api/user/create`, payload),

  updateRole: (userId: string, payload: any) =>
    apiRequest("PATCH", `/api/user/update/${userId}`, payload),

  passwordUpdate: (userId: string, payload: any) =>
    apiRequest("PATCH", `/api/user/password-update/${userId}`, payload),

  search: (page = 1, items = 10, q: string) =>
    apiRequest("GET", `/api/user/search?page=${page}&items=${items}&q=${q}`),
  deleteItem: (id: string) => apiRequest("DELETE", `/api/user/delete/${id}`),
};

export default UsersService;

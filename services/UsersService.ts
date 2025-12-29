import apiRequest from "@/lib/apiRequest";

const UsersService = {
  list: (page = 1, items = 10) =>
    apiRequest("GET", `/api/user/list?page=${page}&items=${items}`),

  search: (page = 1, items = 10, q: string) =>
    apiRequest(
      "GET",
      `/api/user/search?page=${page}&items=${items}&q=${q}`
    ),
};

export default UsersService;
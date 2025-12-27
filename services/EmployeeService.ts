// src/services/EmployeeService.ts
import apiRequest from "@/lib/apiRequest";

const EmployeeService = {
  /* ================= SEARCH EXECUTIVES ================= */
  searchExecutives: (q: string, fields = "name") =>
    apiRequest(
      "GET",
      `/api/employee/search?q=${q}&fields=${fields}`
    ),
};

export default EmployeeService;
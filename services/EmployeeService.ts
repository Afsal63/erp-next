// src/services/EmployeeService.ts
import apiRequest from "@/lib/apiRequest";

const EmployeeService = {
  /* ================= LIST EMPLOYEES ================= */
  listEmployees: (page = 1, items = 10) =>
    apiRequest(
      "GET",
      `/api/employee/list?page=${page}&items=${items}`
    ),

  /* ================= SEARCH EMPLOYEES ================= */
  searchEmployees: (q: string, fields = "name") =>
    apiRequest(
      "GET",
      `/api/employee/search?q=${q}&fields=${fields}`
    ),

  /* ================= READ EMPLOYEE ================= */
  readById: (id: string) =>
    apiRequest(
      "GET",
      `/api/employee/read/${id}`
    ),

  /* ================= CREATE EMPLOYEE ================= */
  create: (payload: any) =>
    apiRequest(
      "POST",
      `/api/employee/create`,
      payload
    ),

  /* ================= UPDATE EMPLOYEE ================= */
  update: (id: string, payload: any) =>
    apiRequest(
      "PATCH",
      `/api/employee/update/${id}`,
      payload
    ),

  /* ================= DELETE EMPLOYEE ================= */
  deleteItem: (id: string) =>
    apiRequest(
      "DELETE",
      `/api/employee/delete/${id}`
    ),
};

export default EmployeeService;
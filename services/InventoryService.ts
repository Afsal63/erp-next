import apiRequest from "@/lib/apiRequest";

const InventoryService = {
  listCategories: () =>
    apiRequest("GET", "/api/inventoryCategory/list"),

   createCategory: (barcode: string) =>
    apiRequest("POST", "/api/inventoryCategory/create", {
      data: {
        title: barcode,
        value: barcode,
        key: barcode,
        children: [],
      },
      type: "MainCategory",
    }),

updateCategory: (id: string, barcode: string) =>
  apiRequest("PATCH", `/api/inventoryCategory/update/${id}`, {
    parent: barcode.toUpperCase().trim(),
  }),

  deleteCategory: (id: string) =>
    apiRequest("DELETE", `/api/inventoryCategory/delete/${id}`),
};

export default InventoryService;
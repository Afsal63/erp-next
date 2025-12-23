import apiRequest from "@/lib/apiRequest";

const InventoryItemService = {

  listByBarcode: (barCode: string, page = 1, items = 10, search = "") =>
    apiRequest(
      "POST",
      `/api/inventory/filter?page=${page}&items=${items}&barCode=${barCode}&search=${search}`
    ),
     create: (payload: any) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    return apiRequest(
      "POST",
      "/api/inventory/create",
      formData
    );
  },

 readById: (id: string) =>
    apiRequest("GET", `/api/inventory/read/${id}`),

  updateItem: (id: string, payload: any) =>
    apiRequest("PATCH", `/api/inventory/update/${id}`, payload),
  
  addQuantity: (id: string, addQty: number) =>
    apiRequest("PATCH", `/api/inventory/update/${id}`, {
      addQty,
    }),
     deleteItem: (id: string) =>
    apiRequest("DELETE", `/api/inventory/delete/${id}`),
};

export default InventoryItemService;
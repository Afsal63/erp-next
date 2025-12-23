"use client";

import { useCallback, useEffect, useState } from "react";
import InventoryItemService from "@/services/InventoryItemService";
import { toast } from "sonner";

const useInventoryItems = (barCode: string | null) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [qtyMap, setQtyMap] = useState<Record<string, string>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalForm, setModalForm] = useState<any>({});
  const [modalId, setModalId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* FETCH */
  const fetchItems = useCallback(async () => {
    if (!barCode) return;
    setLoading(true);

    const res = await InventoryItemService.listByBarcode(
      barCode,
      page,
      10,
      search
    );

    setItems(Array.isArray(res?.result) ? res.result : []);
    setPagination(res?.pagination || null);
    setLoading(false);
  }, [barCode, page, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /* SEARCH */
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  /* ADD QTY */
  const handleQtyChange = (id: string, v: string) =>
    setQtyMap((p) => ({ ...p, [id]: v }));

  const handleAddQty = async (id: string) => {
    const qty = Number(qtyMap[id]);
    if (!qty || qty <= 0) return toast.error("Enter valid quantity");

    await InventoryItemService.addQuantity(id, qty);
    toast.success(`Quantity +${qty} added`);

    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity + qty } : i
      )
    );

    setQtyMap((p) => {
      const c = { ...p };
      delete c[id];
      return c;
    });
  };

  /* MODAL */
  const openItemModal = async (id: string, mode: "view" | "edit") => {
    setModalMode(mode);
    setModalLoading(true);
    const res = await InventoryItemService.readById(id);
    if (res?.success) {
      setModalForm(res.result);
      setModalId(id);
      setModalOpen(true);
    }
    setModalLoading(false);
  };

  const openCreateModal = (barCode: string) => {
    setModalMode("create");
    setModalId(null);
    setModalForm({
      barCode,
      itemName: "",
      normalDiscountedPrice: "",
      quantity: "",
      unitOfMeasures: "",
      previewImage: [],
    });
    setModalOpen(true);
  };

  const saveItem = async () => {
    setModalLoading(true);

    const res =
      modalMode === "create"
        ? await InventoryItemService.create(modalForm)
        : await InventoryItemService.updateItem(modalId!, modalForm);

    if (res?.success) {
      toast.success(
        modalMode === "create" ? "Inventory created" : "Inventory updated"
      );
      setModalOpen(false);
      fetchItems();
    } else {
      toast.error(res?.message || "Operation failed");
    }

    setModalLoading(false);
  };

   const deleteItem = async (id: string) => {
    const toastId = toast.loading("Deleting item...");

    try {
      const res = await InventoryItemService.deleteItem(id);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to delete barcode");
      }

      toast.success("Item deleted successfully", { id: toastId });
      await fetchItems();;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete barcode", {
        id: toastId,
      });
    }
  };

  /* DELETE */
 

  return {
    items,
    loading,
    search,
    setSearch: handleSearchChange,
    page,
    setPage,
    pagination,
    qtyMap,
    handleQtyChange,
    handleAddQty,
    openItemModal,
    openCreateModal,
    modalOpen,
    modalMode,
    modalLoading,
    modalForm,
    setModalForm,
    saveItem,
    setModalOpen,
    deleteId,
    setDeleteId,
    deleteName,
    setDeleteName,
    deleting,
    deleteItem,
    setDeleting
  };
};

export default useInventoryItems;
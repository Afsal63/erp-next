"use client";

import { useCallback, useEffect, useState } from "react";
import InventoryItemService from "@/services/admin/InventoryItemService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const useInventoryItems = (barCode: string | null) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [qtyMap, setQtyMap] = useState<Record<string, string>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState<"view" | "edit" | "create">("view");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalForm, setModalForm] = useState<any>({});
  const [modalId, setModalId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */
  const fetchItems = useCallback(
    async (pageNo = page, searchValue = search) => {
      if (!barCode) return;

      try {
        setLoading(true);

        let res;

        if (searchValue) {
          // 🔍 INVENTORY SEARCH (BARCODE + SEARCH)
          res = await InventoryItemService.searchInventoryItem(
            barCode,
            pageNo,
            ITEMS_PER_PAGE,
            searchValue
          );
        } else {
          // 📄 NORMAL LIST BY BARCODE
          res = await InventoryItemService.listByBarcode(
            barCode,
            pageNo,
            ITEMS_PER_PAGE
          );
        }

        setItems(Array.isArray(res?.result) ? res.result : []);
        setPagination(res?.pagination || null);
      } catch {
        toast.error("Failed to load inventory items");
        setItems([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [barCode, page, search]
  );

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchItems();
  }, [page]);

  /* ================= SEARCH (BUTTON ONLY) ================= */
  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    setSearch(trimmed);
    setPage(1);
    fetchItems(1, trimmed);
  };

  /* ================= ADD QTY ================= */
  const handleQtyChange = (id: string, v: string) =>
    setQtyMap((p) => ({ ...p, [id]: v }));

  const handleAddQty = async (id: string) => {
    const qty = Number(qtyMap[id]);
    if (!qty || qty <= 0) {
      return toast.error("Enter valid quantity");
    }

    await InventoryItemService.addQuantity(id, qty);
    toast.success(`Quantity +${qty} added`);

    setItems((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity + qty } : i
      )
    );

    setQtyMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  /* ================= MODAL ================= */
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
        modalMode === "create"
          ? "Inventory item created"
          : "Inventory item updated"
      );
      setModalOpen(false);
      fetchItems();
    } else {
      toast.error(res?.message || "Operation failed");
    }

    setModalLoading(false);
  };

  /* ================= DELETE ================= */
  const deleteItem = async (id: string) => {
    const toastId = toast.loading("Deleting item...");

    try {
      const res = await InventoryItemService.deleteItem(id);
      if (!res?.success) throw new Error();

      toast.success("Item deleted successfully", { id: toastId });
      fetchItems();
    } catch {
      toast.error("Failed to delete item", { id: toastId });
    }
  };

  return {
    items,
    loading,
    search,
    handleSearch,
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
    setDeleting,
  };
};

export default useInventoryItems;
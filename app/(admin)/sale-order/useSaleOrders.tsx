"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import SaleOrderService from "@/services/SaleOrderService";
import CustomersService from "@/services/CustomersService";
import { Client } from "@/types/client";

const ITEMS_PER_PAGE = 10;

/* ================= TYPES (ADDED ONLY) ================= */



const useSaleOrders = () => {
  /* ================= LIST ================= */
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");

  /* ================= CUSTOMER SEARCH ================= */
  const [customers, setCustomers] = useState<Client[]>([]); // ✅ FIXED
  const [customerSearch, setCustomerSearch] = useState("");

  /* ================= DELETE ================= */
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ================= MODAL ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">(
    "view"
  );

  const [modalForm, setModalForm] = useState<any>({});
  const [modalId, setModalId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async (
    pageNo: number = page,
    searchValue: string = search
  ) => {
    try {
      setLoading(true);

      const res = searchValue.trim()
        ? await SaleOrderService.search(
            pageNo,
            ITEMS_PER_PAGE,
            searchValue.trim()
          )
        : await SaleOrderService.list(pageNo, ITEMS_PER_PAGE);

if (res?.success) {
  setOrders(res.result || []);
  setPagination(res.pagination || null);
} else {
  setOrders([]);
  setPagination(null);
}
    } catch {
      toast.error("Failed to load sale orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /* ================= SEARCH ================= */
  const handleSearch = (value: string) => {
    setSearch(value.trim());
    setPage(1);
    fetchOrders(1, value.trim());
  };

  /* ================= CUSTOMER SEARCH ================= */
  useEffect(() => {
    if (!customerSearch.trim()) {
      setCustomers([]);
      return;
    }

    const delay = setTimeout(async () => {
      const res = await CustomersService.searchCustomers(
        1,
        10,
        customerSearch,
        "company"
      );
      setCustomers(res?.success ? res.result : []);
    }, 400);

    return () => clearTimeout(delay);
  }, [customerSearch]);

  /* ================= MODALS ================= */
  const openCreateModal = () => {
    setModalMode("create");
    setModalId(null);

    setModalForm({
      client: "",
      clientName: "",
      clientTrnNumber: "",
      customerDiscount: 0,
      discountAmount: 0,
      customerItems: [],
      executive: "",
      executiveName: "",
      executiveItems: [], // ✅ SAFE ADD
      date: new Date().toISOString().slice(0, 10),
      note: "",
      status: "pending",
      taxRate: 5,
      discount: 0,
      subTotal: 0,
      taxTotal: 0,
      total: 0,
      items: [],
    });

    setModalOpen(true);
  };

  const openItemModal = async (id: string, mode: "view" | "edit") => {
    try {
      setModalMode(mode);
      setModalLoading(true);

      const res = await SaleOrderService.readById(id);
      if (!res?.success) return;

      const data = res.result;

      setModalForm({
        ...data,
        client: data.client?._id || "",
        clientName: data.client?.company || "",
        // ✅ ADD THESE
        clientTrnNumber: data.client?.clientTrnNumber || "",
        customerDiscount: Number(data.client?.customerDiscount || 0),
        customerItems: data.client?.items || [],
        discountAmount: data.discountAmount || 0,
        executive: data.executive?._id || "",
        executiveName: data.executive
          ? `${data.executive.name} ${data.executive.surname || ""}`
          : "",
        executiveItems: data.executive?.items || [], // ✅ SAFE ADD
        items: (data.items || []).map((i: any) => ({
          _id: i._id,
          barCode: i.barCode,
          itemName: i.itemName,
          quantity: Number(i.quantity),
          price: Number(i.price),
          total: Number(i.total),
        })),
      });

      setModalId(id);
      setModalOpen(true);
    } finally {
      setModalLoading(false);
    }
  };

  /* ================= SAVE ================= */
  const saveOrder = async () => {
    try {
      setModalLoading(true);

      if (!modalForm.client || !modalForm.executive || !modalForm.date) {
        toast.error("Customer, Executive and Date are required");
        return;
      }

      const payload = {
        ...modalForm,
        items: (modalForm.items || [])
          .filter((i: any) => Number(i.quantity) > 0) // ✅ ONLY QTY > 0
          .map((i: any) => ({
            barCode: i.barCode,
            itemName: i.itemName,
            quantity: Number(i.quantity),
            price: Number(i.price),
            total: Number(i.total),
          })),
      };

      const res =
        modalMode === "create"
          ? await SaleOrderService.create(payload)
          : await SaleOrderService.update(modalId!, payload);

      if (!res?.success) throw new Error();

      toast.success(
        modalMode === "create"
          ? "Sale order created successfully"
          : "Sale order updated successfully"
      );

      setModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(`Save failed ${error}`);
    } finally {
      setModalLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteItem = async (id: string) => {
    await SaleOrderService.delete(id);
    fetchOrders();
  };

  return {
    loading,
    orders,
    page,
    pagination,

    customers,
    setCustomerSearch,

    modalOpen,
    modalMode,
    modalForm,
    modalLoading,

    openCreateModal,
    openItemModal,
    saveOrder,

    deleteId,
    deleteName,
    deleting,
    deleteItem,

    setPage,
    setDeleteId,
    setDeleteName,
    setDeleting,
    setModalForm,
    setModalOpen,

    handleSearch,
    fetchOrders,
  };
};

export default useSaleOrders;

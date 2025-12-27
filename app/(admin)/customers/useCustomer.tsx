import apiRequest from "@/lib/apiRequest";
import CustomersService from "@/services/CustomersService";
import { Customer } from "@/types/customer";
import { Executive } from "@/types/employee";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const useCustomers = () => {
   /* ================= STATE ================= */
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");

  /* ================= EXECUTIVES ================= */
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [executiveSearch, setExecutiveSearch] = useState("");
  const [executiveLoading, setExecutiveLoading] = useState(false);

  /* ================= DELETE ================= */
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* ================= MODAL ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState<"view" | "edit" | "create">("view");
  const [modalForm, setModalForm] = useState<any>({});
  const [modalId, setModalId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchCustomers = async (
    pageNo: number = page,
    searchValue: string = search
  ) => {
    try {
      setLoading(true);

      let res;

      if (searchValue.trim()) {
        // 🔍 SEARCH API
        res = await CustomersService.searchCustomers(
          pageNo,
          ITEMS_PER_PAGE,
          searchValue.trim(),
          "company"
        );
      } else {
        // 📄 LIST API
        res = await CustomersService.listCustomers(
          pageNo,
          ITEMS_PER_PAGE
        );
      }

      if (res?.success) {
        setCustomers(res.result || []);
        setPagination(res.pagination || null);
      } else {
        setCustomers([]);
        setPagination(null);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load customers");
      setCustomers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGINATION ================= */
  useEffect(() => {
    fetchCustomers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /* ================= SEARCH (BUTTON ONLY) ================= */
  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    setSearch(trimmed);
    setPage(1);
    fetchCustomers(1, trimmed);
  };

   /* ================= EXECUTIVE SEARCH ================= */
  useEffect(() => {
    if (!executiveSearch.trim()) {
      setExecutives([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setExecutiveLoading(true);

        const res = await apiRequest(
          "GET",
          `/api/employee/search?q=${executiveSearch}&fields=name`
        );

        if (res?.success) {
          setExecutives(res.result || []);
        } else {
          setExecutives([]);
        }
      } catch {
        setExecutives([]);
      } finally {
        setExecutiveLoading(false);
      }
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [executiveSearch]);

  /* ================= MODALS ================= */
  const openItemModal = async (id: string, mode: "view" | "edit") => {
    try {
      setModalMode(mode);
      setModalLoading(true);

      const res = await CustomersService.readById(id);
      if (res?.success) {
        setModalForm(res.result);
        setModalId(id);
        setModalOpen(true);
      }
    } catch {
      toast.error("Failed to load customer");
    } finally {
      setModalLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setModalId(null);
    setModalForm({});
    setModalOpen(true);
  };

  /* ================= SAVE (CREATE / EDIT) ================= */
  const saveCustomer = async () => {
    try {
      setModalLoading(true);

      const res =
        modalMode === "create"
          ? await CustomersService.create(modalForm)
          : await CustomersService.updateItem(modalId!, modalForm);

      if (!res?.success) throw new Error(res?.message);

      toast.success(
        modalMode === "create"
          ? "Customer created successfully"
          : "Customer updated successfully"
      );

      setModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
    } finally {
      setModalLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteItem = async (id: string) => {
    const toastId = toast.loading("Deleting customer...");

    try {
      setDeleting(true);

      const res = await CustomersService.deleteItem(id);
      if (!res?.success) throw new Error();

      toast.success("Customer deleted successfully", { id: toastId });
      fetchCustomers();
    } catch {
      toast.error("Failed to delete customer", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return {
    /* state */
    loading,
    customers,
    page,
    pagination,

    executives,
    executiveSearch,
    executiveLoading,

    deleteId,
    deleteName,
    deleting,
    deleteItem,

    modalOpen,
    modalMode,
    modalForm,
    modalLoading,

    /* actions */
    setPage,
    handleSearch,
    setDeleteId,
    setDeleteName,
    setDeleting,

    openItemModal,
    openCreateModal,
    saveCustomer,

    setModalForm,
    setModalOpen,

    setExecutiveSearch,
  };
};

export default useCustomers;
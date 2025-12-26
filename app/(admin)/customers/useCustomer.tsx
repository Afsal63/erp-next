import CustomersService from "@/services/CustomersService";
import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const useCustomers = () => {
  /* ================= STATE ================= */
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // committed search value (used for API)
  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
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

    setSearch(trimmed);  // store committed search
    setPage(1);          // reset pagination
    fetchCustomers(1, trimmed); // 🔥 IMMEDIATE API CALL
  };

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

  /* ================= RETURN ================= */
  return {
    /* state */
    loading,
    customers,
    page,
    pagination,
    search,

    /* actions */
    setPage,
    handleSearch,
    setDeleteId,
    setDeleteName,
    openItemModal,
    openCreateModal,

    /* modal */
    modalOpen,
    modalMode,
    modalForm,
    modalLoading,
  };
};

export default useCustomers;
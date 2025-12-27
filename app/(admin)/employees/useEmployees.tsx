import apiRequest from "@/lib/apiRequest";
import EmployeeService from "@/services/EmployeeService";
import InventoryItemService from "@/services/InventoryItemService";
import { Employee } from "@/types/employee";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const useEmployees = () => {
  /* ================= STATE ================= */
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");

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

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const fetchInventoryByBarcode = async (barCode: string) => {
    try {
      setInventoryLoading(true);
      const res = await InventoryItemService.listByBarcode(barCode, 1, 50, "");
      setInventoryItems(res?.result || []);
    } catch {
      setInventoryItems([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  /* ================= FETCH ================= */
  const fetchEmployees = async (
    pageNo: number = page,
    searchValue: string = search
  ) => {
    try {
      setLoading(true);

      let res;

      if (searchValue.trim()) {
        // 🔍 SEARCH EMPLOYEES
        res = await apiRequest(
          "GET",
          `/api/employee/search?q=${searchValue.trim()}&fields=name`
        );
      } else {
        // 📄 LIST EMPLOYEES
        res = await apiRequest(
          "GET",
          `/api/employee/list?page=${pageNo}&items=${ITEMS_PER_PAGE}`
        );
      }

      if (res?.success) {
        setEmployees(res.result || []);
        setPagination(res.pagination || null);
      } else {
        setEmployees([]);
        setPagination(null);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load employees");
      setEmployees([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGINATION ================= */
  useEffect(() => {
    fetchEmployees(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /* ================= SEARCH (BUTTON ONLY) ================= */
  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    setSearch(trimmed);
    setPage(1);
    fetchEmployees(1, trimmed);
  };

  /* ================= MODALS ================= */
  const openItemModal = async (
    id: string,
    mode: "view" | "edit" | "delete"
  ) => {
    try {
      setModalMode(mode === "delete" ? "view" : mode);
      setModalLoading(true);

      const res = await apiRequest("GET", `/api/employee/read/${id}`);
      if (res?.success) {
        setModalForm(res.result);
        setModalId(id);
        setModalOpen(true);
      }
    } catch {
      toast.error("Failed to load employee");
    } finally {
      setModalLoading(false);
    }
  };

  /* ================= MODAL OPENERS ================= */
  const openCreateModal = () => {
    setModalMode("create");
    setModalForm({
      name: "",
      surname: "",
      phone: "",
      phonePrefix: "+971",
      department: "",
      position: "",
      address: "",
      state: "",
      items: [],
    });
    setInventoryItems([]);
    setModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setModalMode("edit");
    setModalForm(employee);
    setModalOpen(true);
  };

  /* ================= SAVE (CREATE / EDIT) ================= */
  const saveEmployee = async () => {
    try {
      setModalLoading(true);

      if (!modalForm.name || !modalForm.phone) {
        toast.error("Name and Phone are required");
        return;
      }

      const payload = {
        ...modalForm,
        items: (modalForm.items || []).map((i: any) => ({
          barCode: i.barCode,
          quantity: Number(i.quantity || 0),
        })),
      };

      const res =
        modalMode === "create"
          ? await EmployeeService.create(payload)
          : await EmployeeService.update(modalForm._id, payload);

      if (!res?.success) throw new Error(res?.message);

      toast.success(
        modalMode === "create"
          ? "Employee created successfully"
          : "Employee updated successfully"
      );

      setModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save employee");
    } finally {
      setModalLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteItem = async (id: string) => {
    const toastId = toast.loading("Deleting customer...");

    try {
      setDeleting(true);

      const res = await EmployeeService.deleteItem(id);
      if (!res?.success) throw new Error();

      toast.success("Customer deleted successfully", { id: toastId });
      fetchEmployees();
    } catch {
      toast.error("Failed to delete customer", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return {
    /* state */
    loading,
    employees,
    page,
    pagination,

    modalOpen,
    modalMode,
    modalForm,
    modalLoading,

    deleteId,
    deleteName,
    deleting,
    deleteItem,

    /* actions */
    setPage,
    handleSearch,
    setDeleteId,
    setDeleteName,
    setDeleting,

    openItemModal,
    openCreateModal,
    saveEmployee,

    setModalForm,
    setModalOpen,

    inventoryItems,
    inventoryLoading,
    fetchInventoryByBarcode,

    openEditModal,
  };
};

export default useEmployees;

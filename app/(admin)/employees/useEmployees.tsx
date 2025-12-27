import apiRequest from "@/lib/apiRequest";
import EmployeeService from "@/services/EmployeeService";
import InventoryItemService from "@/services/InventoryItemService";
import { Employee } from "@/types/employee";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">(
    "view"
  );
  const [modalForm, setModalForm] = useState<any>({});
  const [modalLoading, setModalLoading] = useState(false);

  const fetchEmployees = async (pageNo = page, searchValue = search) => {
    try {
      setLoading(true);
      const res = searchValue
        ? await apiRequest(
            "GET",
            `/api/employee/search?q=${searchValue}&fields=name`
          )
        : await apiRequest(
            "GET",
            `/api/employee/list?page=${pageNo}&items=${ITEMS_PER_PAGE}`
          );

      setEmployees(res?.success ? res.result : []);
      setPagination(res?.pagination || null);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const handleSearch = (v: string) => {
    setSearch(v.trim());
    setPage(1);
    fetchEmployees(1, v.trim());
  };

  const openItemModal = async (id: string, mode: "view" | "edit") => {
    try {
      setModalMode(mode);
      setModalLoading(true);
      const res = await apiRequest("GET", `/api/employee/read/${id}`);
      if (res?.success) {
        setModalForm(res.result);
        setModalOpen(true);
      }
    } finally {
      setModalLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setModalForm({
      name: "",
      surname: "",
      phone: "",
      email: "",
      phonePrefix: "+971",
      department: "",
      position: "",
      items: [],
    });
    setModalOpen(true);
  };

  const onBarcodeSelect = async (barCode: string) => {
  try {
    const res = await InventoryItemService.listByBarcode(barCode, 1, 100, "");
    if (!res?.success) return;

    setModalForm((prev: any) => {
      const existing = prev.items || [];

      // 🔑 unique key = barCode + itemName
      const existingKeySet = new Set(
        existing.map((i: any) => `${i.barCode}__${i.itemName}`)
      );

      const newItems = res.result
        .filter(
          (inv: any) =>
            !existingKeySet.has(`${inv.barCode}__${inv.itemName}`)
        )
        .map((inv: any) => ({
          _id: inv._id,
          barCode: inv.barCode,
          itemName: inv.itemName,

          // ✅ inventory-based available qty ONLY for newly added
          availableQty: inv.quantity,

          // ❌ do NOT set actualQty here
          quantity: 0,
        }));

      // ⛔ if nothing new, return prev state
      if (newItems.length === 0) return prev;

      return { ...prev, items: [...existing, ...newItems] };
    });
  } catch {
    toast.error("Failed to load inventory items");
  }
};

  const saveEmployee = async () => {
    try {
      setModalLoading(true);

      if (!modalForm.name || !modalForm.phone) {
        toast.error("Name and Phone are required");
        return;
      }

      const payload = {
        ...modalForm,

        items: (modalForm.items || [])
          .filter(
            (i: any) =>
              Number(i.quantity) > 0 ||
              (typeof i.actualQty !== "undefined" &&
                i.actualQty !== i._originalActualQty)
          )
          .map((i: any) => ({
            barCode: i.barCode,
            itemName: i.itemName,

            // ✅ Add Qty
            quantity: Number(i.quantity) || 0,

            // ✅ Send actualQty ONLY if user changed it
            ...(typeof i.actualQty !== "undefined" &&
            i.actualQty !== i._originalActualQty
              ? { actualQty: Number(i.actualQty) }
              : {}),
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
      fetchEmployees();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save employee");
    } finally {
      setModalLoading(false);
    }
  };
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

    setPage,
    handleSearch,
    setDeleteId,
    setDeleteName,
    setDeleting,

    openItemModal,
    openCreateModal,
    saveEmployee,
    setModalOpen,
    setModalForm,

    onBarcodeSelect,
    deleteItem,
  };
};

export default useEmployees;

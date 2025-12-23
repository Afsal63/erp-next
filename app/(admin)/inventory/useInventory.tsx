"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InventoryService from "@/services/InventoryService";

export type InventoryItem = {
  id: string;
  name: string;
};

const useInventory = () => {
  const router = useRouter();
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const res = await InventoryService.listCategories();

      if (res?.success) {
        setData(
          res.result.map((item: any) => ({
            id: item._id,
            name: item.title,
          }))
        );
      } else {
        throw new Error(res?.message || "Failed to load inventory");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const createBarcode = async (barcode: string) => {
    if (!barcode) {
      toast.error("Barcode cannot be empty");
      return;
    }

    const toastId = toast.loading("Creating barcode...");

    try {
      const res = await InventoryService.createCategory(barcode);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to create barcode");
      }

      toast.success("Barcode created successfully", {
        id: toastId,
      });

      await fetchInventory(); // 🔄 refresh list
    } catch (err: any) {
      toast.error(err.message || "Failed to create barcode", {
        id: toastId,
      });
      throw err;
    }
  };

  // ================= UPDATE =================
 const updateBarcode = async (id: string, barcode: string) => {
  if (!barcode) {
    toast.error("Barcode cannot be empty");
    return;
  }

  const toastId = toast.loading("Updating barcode...");

  try {
    const res = await InventoryService.updateCategory(id, barcode);

    if (!res?.success) {
      throw new Error(res?.message || "Failed to update barcode");
    }

    toast.success("Barcode updated successfully", { id: toastId });
    await fetchInventory();
  } catch (err: any) {
    // 👇 SPECIAL HANDLING
    if (
      err?.message?.toLowerCase().includes("already")
    ) {
      toast.error(
        "This barcode is already used in inventory. Rename is not allowed.",
        { id: toastId }
      );
    } else {
      toast.error(err.message || "Failed to update barcode", {
        id: toastId,
      });
    }

    throw err;
  }
};

  const deleteBarcode = async (id: string) => {
    const toastId = toast.loading("Deleting barcode...");

    try {
      const res = await InventoryService.deleteCategory(id);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to delete barcode");
      }

      toast.success("Barcode deleted successfully", { id: toastId });
      await fetchInventory();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete barcode", {
        id: toastId,
      });
    }
  };

  return {
    data,
    loading,
    error,
    openId,
    setOpenId,
    createBarcode,
    updateBarcode,
    deleteBarcode,
    creating,
    setCreating,
    showCreate,
    setShowCreate,
    newBarcode,
    setNewBarcode,
    editId,
    setEditId,
    editValue,
    setEditValue,
    editing,
    setEditing,
    deleteId,
    setDeleteId,
    deleteName,
    setDeleteName,
    deleting,
    setDeleting,
   
    router
  };
};

export default useInventory;

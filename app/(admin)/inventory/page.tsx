"use client";

import { ChevronRight, ChevronDown, Pencil, Trash2, Eye } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import useInventory from "./useInventory";
import EditModal from "@/components/ui/EditModal";
import InventoryItemModal from "@/components/inventory/InventoryItemModal";

export default function InventoryPage() {
  const {
    data,
    loading,
    error,
    openId,
    setOpenId,
    createBarcode,
    updateBarcode,
    deleteBarcode,
    setShowCreate,
    showCreate,
    setNewBarcode,
    newBarcode,
    creating,
    setCreating,
    deleteId,
    setDeleteId,
    deleting,
    setDeleting,
    deleteName,
    setDeleteName,
    editId,
    setEditId,
    editValue,
    setEditValue,
    editing,
    setEditing,
    router
  } = useInventory();

  if (loading) return <p className="text-gray-500">Loading inventory...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Categories</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="
            px-4 py-2 rounded-xl
            bg-gradient-to-r from-indigo-600 to-blue-600
            text-white font-medium
            hover:opacity-90 transition
          "
        >
          + Create Barcode
        </button>
      </div>

      {/* ================= CREATE BARCODE PANEL ================= */}
      {showCreate && (
        <div className="bg-white border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Create Barcode</h2>

            <button
              onClick={() => {
                setShowCreate(false);
                setNewBarcode("");
              }}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newBarcode}
              onChange={(e) => setNewBarcode(e.target.value)}
              placeholder="Enter barcode / category"
              className="
                flex-1 px-4 py-2 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

            <button
              disabled={!newBarcode || creating}
              onClick={async () => {
                try {
                  setCreating(true);
                  await createBarcode(newBarcode);
                  setShowCreate(false);
                  setNewBarcode("");
                } catch (err: any) {
                  alert(err.message || "Failed to create barcode");
                } finally {
                  setCreating(false);
                }
              }}
              className="
                px-5 py-2 rounded-lg
                bg-blue-600 text-white
                hover:bg-blue-700 transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {creating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* ================= INVENTORY LIST ================= */}
      <div className="bg-white rounded-2xl shadow-sm border divide-y">
        {data.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className="px-4">
              {/* ROW */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="
                    w-full flex items-center gap-3
                    py-4 text-left
                    hover:bg-gray-50 transition
                  "
                >
                  {isOpen ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}

                  <span className="font-medium text-gray-800">{item.name}</span>
                </button>

                {/* SHOW BUTTON */}
               <button
  onClick={() =>
    router.push(`/inventory/items?barCode=${item.name}`)
  }
  className="
    flex items-center gap-1 px-4 py-2 rounded-lg
    bg-gray-100 text-gray-700
    hover:bg-gray-700 hover:text-white
    transition
  "
>
  <Eye size={16} />
  Show
</button>
              </div>

              {/* EXPANDED ACTIONS */}
              {isOpen && (
                <div className="pb-4 pl-7">
                  <div className="flex gap-3">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setEditId(item.name);
                        setEditValue(item.name);
                      }}
                      className="
                       flex items-center gap-1 px-4 py-2 rounded-lg
                      bg-blue-100 text-blue-700
                       hover:bg-blue-600 hover:text-white
                        transition
                        "
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setDeleteId(item.name);
                        setDeleteName(item.name);
                      }}
                      className="
                        flex items-center gap-1 px-4 py-2 rounded-lg
                       bg-red-100 text-red-700
                       hover:bg-red-600 hover:text-white
                       transition
                       "
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No inventory categories found
          </div>
        )}
      </div>

      <EditModal
        open={!!editId}
        value={editValue}
        loading={editing}
        onChange={setEditValue}
        onCancel={() => {
          setEditId(null);
          setEditValue("");
        }}
        onSave={async () => {
          if (!editId) return;

          try {
            setEditing(true);
            await updateBarcode(editId, editValue);
            setEditId(null);
            setEditValue("");
          } finally {
            setEditing(false);
          }
        }}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Barcode"
        message={`Are you sure you want to delete "${deleteName}"? This action cannot be undone.`}
        loading={deleting}
        onCancel={() => {
          setDeleteId(null);
          setDeleteName("");
        }}
        onConfirm={async () => {
          if (!deleteId) return;

          try {
            setDeleting(true);
            await deleteBarcode(deleteId);
          } finally {
            setDeleting(false);
            setDeleteId(null);
            setDeleteName("");
          }
        }}
      />

    
    </div>
  );
}

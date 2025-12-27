"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useInventoryItems from "./useInventoryItems";
import { ArrowLeft, Search, Plus, Check } from "lucide-react";

import Pagination from "@/components/ui/Pagination";
import ActionDropdown from "@/components/ui/ActionDropdown";
import InventoryItemModal from "@/components/inventory/InventoryItemModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SearchInput from "@/components/ui/SearchInput";

export default function InventoryItemsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const barCode = searchParams.get("barCode");

  if (!barCode) {
    return (
      <div className="p-6 text-red-500 font-medium">Barcode not provided</div>
    );
  }

  const {
    items,
    loading,
    search,
    handleSearch,
    page,
    pagination,
    setPage,
    qtyMap,
    handleAddQty,
    handleQtyChange,

    modalOpen,
    modalMode,
    modalLoading,
    modalForm,
    setModalForm,
    openItemModal,
    openCreateModal,
    saveItem,
    setModalOpen,

    deleteId,
    setDeleteId,
    deleteName,
    setDeleteName,
    deleting,
    deleteItem,
    setDeleting,
  } = useInventoryItems(barCode);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Inventory Items</h1>
            <p className="text-sm text-gray-500">
              Barcode: <span className="font-medium">{barCode}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ================= SEARCH + ADD ================= */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* ================= SEARCH ================= */}
        <SearchInput onSearch={handleSearch} placeholder="Search item..." />

        <button
          onClick={() => openCreateModal(barCode)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Add Inventory
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="hidden md:block bg-white border rounded-2xl shadow-sm overflow-visible">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-600">
                Item Name
              </th>
              <th className="p-4 text-center font-medium text-gray-600">
                Quantity
              </th>
              <th className="p-4 text-center font-medium text-gray-600">
                Price
              </th>
              <th className="p-4 text-center font-medium text-gray-600">
                Add Qty
              </th>
              <th className="p-4 text-center font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {(items || []).map((item) => {
              const inputQty = qtyMap[item._id];

              return (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.itemName}</td>

                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {item.quantity}
                    </span>
                  </td>

                  <td className="p-4 text-center font-semibold">
                    ₹{item.normalDiscountedPrice}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={inputQty || ""}
                        onChange={(e) =>
                          handleQtyChange(item._id, e.target.value)
                        }
                        className="w-20 px-2 py-1 text-sm border rounded-lg"
                      />

                      {inputQty && Number(inputQty) > 0 && (
                        <button
                          onClick={() => handleAddQty(item._id)}
                          className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <ActionDropdown
                      onShow={() => openItemModal(item._id, "view")}
                      onEdit={() => openItemModal(item._id, "edit")}
                      onDelete={() => {
                        setDeleteId(item._id);
                        setDeleteName(item.itemName);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {(items || []).map((item) => {
          const inputQty = qtyMap[item._id];

          return (
            <div
              key={item._id}
              className="bg-white border rounded-2xl shadow-sm p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.itemName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ₹{item.normalDiscountedPrice}
                  </p>
                </div>

                <ActionDropdown
                  onShow={() => openItemModal(item._id, "view")}
                  onEdit={() => openItemModal(item._id, "edit")}
                  onDelete={() => {
                    setDeleteId(item._id);
                    setDeleteName(item.itemName);
                  }}
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Qty</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  {item.quantity}
                </span>
              </div>

              {/* Add Qty */}
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={inputQty || ""}
                  onChange={(e) => handleQtyChange(item._id, e.target.value)}
                  placeholder="Add quantity"
                  className="
              flex-1 px-3 py-2 text-sm
              border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
                />

                {inputQty && Number(inputQty) > 0 && (
                  <button
                    onClick={() => handleAddQty(item._id)}
                    className="
                px-4 py-2 rounded-lg
                bg-green-600 text-white
                hover:bg-green-700 transition
              "
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!loading && items.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No inventory items found
          </div>
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <Pagination
        page={page}
        totalPages={pagination?.pages || 1}
        onPageChange={setPage}
      />

      {/* ================= MODALS ================= */}
      <InventoryItemModal
        open={modalOpen}
        mode={modalMode}
        loading={modalLoading}
        form={modalForm}
        setForm={setModalForm}
        onClose={() => setModalOpen(false)}
        onSave={saveItem}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteName}"?`}
        loading={deleting}
        onCancel={() => {
          setDeleteId(null);
          setDeleteName("");
        }}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            setDeleting(true);
            await deleteItem(deleteId);
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

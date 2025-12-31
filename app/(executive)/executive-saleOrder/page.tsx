"use client";

import useSaleOrders from "./useSaleOrders";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import ActionDropdown from "@/components/ui/ActionDropdown";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SaleOrderModal from "@/components/admin/saleOrder/SaleOrderModal";
import { Plus } from "lucide-react";

export default function SaleOrderPage() {
  const {
    loading,
    orders,
    page,
    pagination,
    router,
    setPage,
    handleSearch,

    // ✅ modal
    openCreateModal,
    openItemModal,
    modalOpen,
    modalMode,
    modalForm,
    modalLoading,
    saveOrder,
    setModalForm,
    setModalOpen,

    // ✅ REQUIRED FOR MODAL
    customers,
    setCustomerSearch,

    // ✅ delete
    deleteId,
    deleteName,
    deleting,
    deleteItem,
    setDeleting,
    setDeleteId,
    setDeleteName,
  } = useSaleOrders();

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">Loading sale orders...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sale Orders</h1>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search Sale Orders..."
        />

        <button
          onClick={openCreateModal}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-blue-600 text-white
            hover:bg-blue-700 transition
          "
        >
          <Plus size={16} />
          Create SaleOrder
        </button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-visible hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Invoice No</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Executive</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{o.number}</td>
                <td className="p-4">{o.client?.company || "-"}</td>
                <td className="p-4">
                  {o.client?.executive
                    ? `${o.client.executive.name} ${
                        o.client.executive.surname || ""
                      }`
                    : "-"}
                </td>
                <td className="p-4">{new Date(o.date).toLocaleDateString()}</td>
                <td className="p-4 text-end">
                  <ActionDropdown
                onShow={() => router.push(`/executive-saleOrder/${o._id}`)}
                    onEdit={() => openItemModal(o._id, "edit")}
                    onDelete={() => {
                      setDeleteId(o._id);
                      setDeleteName(o.number);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No sale orders found
          </div>
        )}
      </div>

    
{/* MOBILE VIEW */}
<div className="md:hidden space-y-4">
  {(orders ?? []).map((o) => (
    <div
      key={o._id}
      className="border rounded-xl p-4 bg-white shadow-sm space-y-3"
    >
      {/* Order Info */}
      <div className="font-semibold text-base">{o.number}</div>

      <div className="text-sm text-gray-600">
        Client: {o.client?.company || "-"}
      </div>

      <div className="text-sm">
        Executive:{" "}
        {o.client?.executive
          ? `${o.client.executive.name} ${o.client.executive.surname || ""}`
          : "-"}
      </div>

      <div className="text-sm">
        Date: {new Date(o.date).toLocaleDateString()}
      </div>

      {/* ACTION BAR */}
      <div className="pt-3 border-t flex justify-end relative">
        <ActionDropdown
           onShow={() => router.push(`/executive-saleOrder/${o._id}`)}
          onEdit={() => openItemModal(o._id, "edit")}
          onDelete={() => {
            setDeleteId(o._id);
            setDeleteName(o.number);
          }}
        />
      </div>
    </div>
  ))}
</div>
      {/* ================= SALE ORDER MODAL ================= */}
      <SaleOrderModal
        open={modalOpen}
        mode={modalMode}
        loading={modalLoading}
        form={modalForm}
        setForm={setModalForm}
        onClose={() => setModalOpen(false)}
        onSave={saveOrder}
        customers={customers}
        onCustomerSearch={setCustomerSearch}
      />

      {/* ================= DELETE CONFIRM ================= */}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Customer"
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

      <Pagination
        page={page}
        totalPages={pagination?.pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}

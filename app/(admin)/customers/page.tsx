"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import useCustomers from "./useCustomer";
import ActionDropdown from "@/components/ui/ActionDropdown";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { Search, Plus } from "lucide-react";
import CustomerModal from "@/components/customer/CustomerModal";

export default function CustomersPage() {
  const {
    loading,
    customers,
    page,
    setPage,
    pagination,
    handleSearch,

    openItemModal,
    openCreateModal,

    deleteId,
    deleteName,
    deleting,
    deleteItem,
    setDeleteId,
    setDeleteName,
    setDeleting,

    modalOpen,
    modalMode,
    modalForm,
    modalLoading,
    saveCustomer,
    setModalForm,
    setModalOpen,

    executives,
    setExecutiveSearch,
  } = useCustomers();

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">Loading customers...</div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">Manage your customer list</p>
        </div>

        
      </div>

      {/* ================= SEARCH ================= */}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

      <SearchInput onSearch={handleSearch} placeholder="Search customers..." />
      {/* CREATE CUSTOMER */}
        <button
          onClick={openCreateModal}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-blue-600 text-white
            hover:bg-blue-700 transition
          "
        >
          <Plus size={16} />
          Create Customer
        </button>
        </div>

      {/* ================= DESKTOP TABLE ================= */}
     <div className="hidden md:block bg-white border rounded-2xl shadow-sm overflow-visible">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-medium text-gray-600">
                Company
              </th>
              <th className="p-4 text-left font-medium text-gray-600">Phone</th>
              <th className="p-4 text-left font-medium text-gray-600">
                Location
              </th>
              <th className="p-4 text-left font-medium text-gray-600">
                Payment
              </th>
              <th className="p-4 text-left font-medium text-gray-600">
                Executive
              </th>
              <th className="p-4 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="p-4 text-center font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{c.company}</td>
                <td className="p-4 text-gray-700">{c.phone}</td>
                <td className="p-4 text-gray-700">{c.location || "-"}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {c.paymentMode || "N/A"}
                  </span>
                </td>
                <td className="p-4 text-gray-700">
                  {c.executive
                    ? `${c.executive.name} ${c.executive.surname || ""}`
                    : "-"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <ActionDropdown
                    onShow={() => openItemModal(c._id, "view")}
                    onEdit={() => openItemModal(c._id, "edit")}
                    onDelete={() => {
                      setDeleteId(c._id);
                      setDeleteName(c.company);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No customers found
          </div>
        )}
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {customers.map((c) => (
          <div
            key={c._id}
            className="bg-white border rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{c.company}</h3>
                <p className="text-xs text-gray-500">{c.phone}</p>
              </div>

              <ActionDropdown
                onShow={() => openItemModal(c._id, "view")}
                onEdit={() => openItemModal(c._id, "edit")}
                onDelete={() => {
                  setDeleteId(c._id);
                  setDeleteName(c.company);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium">{c.location || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Payment</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {c.paymentMode || "N/A"}
                </span>
              </div>

              <div>
                <p className="text-gray-500">Executive</p>
                <p className="font-medium">{c.executive?.name || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No customers found
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={pagination?.pages || 1}
        onPageChange={setPage}
      />

    
      <CustomerModal
        open={modalOpen}
        mode={modalMode}
        loading={modalLoading}
        form={modalForm}
        setForm={setModalForm}
        onClose={() => setModalOpen(false)}
        onSave={saveCustomer}
        executives={executives}
        onExecutiveSearch={setExecutiveSearch}
      />
    

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
    </div>
  );
}

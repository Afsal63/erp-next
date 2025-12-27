"use client";

import ActionDropdown from "@/components/ui/ActionDropdown";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import { Plus } from "lucide-react";
import useEmployees from "./useEmployees";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmployeeModal from "@/components/employee/EmployeeModal";

export default function EmployeesPage() {
  const {
    loading,
    employees,
    page,
    setPage,

    deleteId,
    deleteName,
    deleting,
    setDeleteName,
    setDeleteId,
    setDeleting,
    deleteItem,

    pagination,
    handleSearch,
    openItemModal,
    openCreateModal,

    modalOpen,
    modalMode,
    modalForm,
    modalLoading,
    setModalOpen,
    setModalForm,
    saveEmployee,

    onBarcodeSelect,
  } = useEmployees();

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-gray-500">
            Manage your employee list
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Employee
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <SearchInput
        onSearch={handleSearch}
        placeholder="Search employees..."
      />

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white border rounded-2xl shadow-sm overflow-visible">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">
                  {e.name} {e.surname || ""}
                </td>

                <td className="p-4">
                  {e.phonePrefix} {e.phone}
                </td>

                <td className="p-4">{e.department || "-"}</td>
                <td className="p-4">{e.position || "-"}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      e.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {e.enabled ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <ActionDropdown
                    onShow={() => openItemModal(e._id, "view")}
                    onEdit={() => openItemModal(e._id, "edit")}
                    onDelete={() => {
                      setDeleteId(e._id);
                      setDeleteName(e.name);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {employees.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No employees found
          </div>
        )}
      </div>

      {/* ================= MOBILE VIEW (RESTORED) ================= */}
      <div className="space-y-4 md:hidden">
        {employees.map((e) => (
          <div
            key={e._id}
            className="bg-white border rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {e.name} {e.surname || ""}
                </h3>
                <p className="text-xs text-gray-500">
                  {e.phonePrefix} {e.phone}
                </p>
              </div>

              <ActionDropdown
                onShow={() => openItemModal(e._id, "view")}
                onEdit={() => openItemModal(e._id, "edit")}
                onDelete={() => {
                  setDeleteId(e._id);
                  setDeleteName(e.name);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium">
                  {e.department || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Position</p>
                <p className="font-medium">
                  {e.position || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                    e.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {e.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No employees found
          </div>
        )}
      </div>

      {/* ================= EMPLOYEE MODAL ================= */}
       <EmployeeModal
        open={modalOpen}
        mode={modalMode === "view" ? "edit" : modalMode}
        loading={modalLoading}
        form={modalForm}
        setForm={setModalForm}
        onBarcodeSelect={onBarcodeSelect}
        onClose={() => setModalOpen(false)}
        onSave={saveEmployee}
      />

      {/* ================= DELETE CONFIRM ================= */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete Employee"
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

      {/* ================= PAGINATION ================= */}
      <Pagination
        page={page}
        totalPages={pagination?.pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
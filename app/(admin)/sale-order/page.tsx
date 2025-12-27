"use client";

import useSaleOrders from "./useSaleOrders";
import Pagination from "@/components/ui/Pagination";
import SearchInput from "@/components/ui/SearchInput";
import ActionDropdown from "@/components/ui/ActionDropdown";

export default function SaleOrderPage() {
  const {
    loading,
    orders,
    page,
    pagination,
    setPage,
    handleSearch,
  } = useSaleOrders();

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading sale orders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sale Orders</h1>

      <SearchInput onSearch={handleSearch} placeholder="Search Sale Orders..." />

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Order No</th>
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
                    ? `${o.client.executive.name} ${o.client.executive.surname || ""}`
                    : "-"}
                </td>
                <td className="p-4">
                  {new Date(o.date).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <ActionDropdown
                    onShow={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
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

      <Pagination
        page={page}
        totalPages={pagination?.pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
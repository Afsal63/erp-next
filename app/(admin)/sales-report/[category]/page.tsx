"use client";

import { useParams, useRouter } from "next/navigation";
import useCategorySales from "./useCategorySale";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalesByCategoryReportPdf from "@/components/salesReport/SalesByCategoryReportPdf";

export default function SalesByCategoryPage() {
  const { category } = useParams();
  const router = useRouter();

  const {
    data,
    loading,
    error,

    fromDate,
    toDate,
    setFromDate,
    setToDate,

    applyDateFilter,
    clearDateFilter,
  } = useCategorySales(String(category));

  /* ================= HANDLERS ================= */

  const handleDateChange = (type: "from" | "to", value: string) => {
    if (type === "from") setFromDate(value);
    if (type === "to") setToDate(value);
  };

  const handleApplyFilter = () => {
    if (fromDate && toDate) {
      applyDateFilter(fromDate, toDate);
    }
  };

  const handleClearFilter = () => {
    clearDateFilter();
  };

  /* ================= STATES ================= */

  if (loading) {
    return <div className="p-6 text-gray-400">Loading orders…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ===== Left: Back + Title ===== */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
          >
            ← Back
          </button>

          <h1 className="text-xl lg:text-2xl font-semibold capitalize">
            {String(category).replace(/-/g, " ")} Orders
          </h1>
        </div>

        {/* ===== Right: Filters + Download ===== */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fromDate ?? ""}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />

          <span className="text-gray-400 hidden sm:inline">→</span>

          <input
            type="date"
            value={toDate ?? ""}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm"
          />

          <button
            onClick={handleApplyFilter}
            disabled={!fromDate || !toDate}
            className="
        px-3 py-1.5 text-sm rounded-lg
        bg-indigo-600 text-white
        disabled:opacity-40 disabled:cursor-not-allowed
      "
          >
            Apply
          </button>

          {(fromDate || toDate) && (
            <button
              onClick={handleClearFilter}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
            >
              Clear
            </button>
          )}

          {/* ===== Download Button ===== */}
          <PDFDownloadLink
            document={
              <SalesByCategoryReportPdf
                category={String(category)}
                data={data}
                fromDate={fromDate}
                toDate={toDate}
              />
            }
            fileName={`${category}-sales-report.pdf`}
          >
            {({ loading }) => (
              <button
                className="
            px-3 py-1.5 text-sm rounded-lg
            border border-indigo-600 text-indigo-600
            hover:bg-indigo-50
            disabled:opacity-40
          "
                disabled={loading || !data.length}
              >
                {loading ? "Preparing PDF..." : "Download Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">Order No</th>
              <th className="py-3 px-4 text-left">Client</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 font-medium">{order.number}</td>

                <td className="py-3 px-4">
                  {order.clientInfo?.company || order.client?.company || "-"}
                </td>

                <td className="py-3 px-4 text-gray-600">
                  {new Date(order.date).toDateString()}
                </td>

                <td className="py-3 px-4 text-right font-semibold">
                  {order.total.toFixed(2)}
                </td>

                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}

            {!data.length && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

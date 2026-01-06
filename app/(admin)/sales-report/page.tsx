"use client";

import useSalesReport from "./useSalesReport";

export default function SalesReportPage() {
  const { data, byCategory, months, loading, error, router } = useSalesReport();

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400 animate-pulse">
        Loading sales analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            📊 Sales Report
          </h1>
          <p className="text-sm text-gray-500">
            Monthly sales by customer category
          </p>
        </div>

        {/* 👉 REDIRECTION BUTTON */}
        <button
          onClick={() => router.push("sales-report/daily-sales-report")}
          className="
      inline-flex items-center gap-2
      px-4 py-2
      text-sm font-medium
      rounded-xl
      bg-indigo-600 text-white
      hover:bg-indigo-700
      transition
      shadow-sm
    "
        >
          📅 Daily Sales
        </button>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(byCategory).map(([category, total], idx) => (
          <div
            key={category}
            className="
              relative overflow-hidden rounded-2xl p-5
              bg-white border border-gray-200
              shadow-sm hover:shadow-lg transition-all duration-300
            "
          >
            {/* Accent */}
            <div
              className={`absolute top-0 left-0 h-1 w-full ${
                idx % 3 === 0
                  ? "bg-indigo-500"
                  : idx % 3 === 1
                  ? "bg-emerald-500"
                  : "bg-orange-500"
              }`}
            />

            <p className="text-xs uppercase tracking-wide text-gray-500">
              {category.replace(/-/g, " ")}
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>

            <p className="text-xs text-gray-400 mt-1">Total sales</p>
          </div>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Month</th>
                <th className="text-right py-3 px-4">Total Sales</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="
                    border-b last:border-b-0
                    hover:bg-gray-50 transition
                  "
                >
                  <td className="py-3 px-4 font-medium capitalize">
                    {row.category.replace(/-/g, " ")}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{row.month}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    {row.totalSales.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() =>
                        router.push(`/sales-report/${row.category}`)
                      }
                      className="
            px-3 py-1.5 text-xs font-medium
            rounded-lg border
            bg-white hover:bg-gray-100
            transition
          "
                    >
                      View Orders
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-400">
        <span>Showing {data.length} records</span>
        <span>Months: {months.join(", ")}</span>
      </div>
    </div>
  );
}

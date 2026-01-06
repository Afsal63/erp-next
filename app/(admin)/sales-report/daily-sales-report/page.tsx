"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useDailySalesReport from "./useDailySalesReport";
import { DailySalesRow, ExecutiveSale, ItemSale } from "@/types/useDailySalesReport";

export default function DailySalesReportPage() {
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
  } = useDailySalesReport();

  const [openExec, setOpenExec] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400 animate-pulse">
        Loading daily sales…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Daily Sales Report
          </h1>
          <p className="text-sm text-gray-500">
            Executive-wise orders & inventory
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      {/* ================= DATE FILTER ================= */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4">
        <div>
          <label className="text-xs text-gray-500">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="block border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="block border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={() => applyDateFilter(fromDate, toDate)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Apply
          </button>
          <button
            onClick={clearDateFilter}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ================= DATE BLOCKS ================= */}
      {data.map((day: DailySalesRow) => (
        <div
          key={day.date}
          className="bg-white rounded-2xl border shadow-sm p-6 space-y-6"
        >
          {/* DATE HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">📅 {day.date}</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              {day.executives.length} Executives
            </span>
          </div>

          {/* EXECUTIVES */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {day.executives.map((exec: ExecutiveSale) => {
              const isOpen = openExec === exec.executive._id;

              return (
                <div
                  key={exec.executive._id}
                  className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exec.executive.name} {exec.executive.surname}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {exec.executive.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="font-semibold">{exec.totalOrders}</p>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Total Sales</p>
                    <p className="text-lg font-bold text-emerald-600">
                      ₹{exec.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  {/* ORDERS */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Orders</p>
                    <div className="flex flex-wrap gap-2">
                      {exec.orders.map((order) => (
                        <button
                          key={order._id}
                          onClick={() =>
                            router.push(`/sale-order/${order._id}`)
                          }
                          className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          {order.number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TOGGLE ITEMS */}
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        setOpenExec(isOpen ? null : exec.executive._id)
                      }
                      className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                      {isOpen ? "Hide Items ▲" : "View Items ▼"}
                    </button>
                  </div>

                  {/* ITEMS */}
                  {isOpen && (
                    <div className="mt-3 border rounded-lg bg-white max-h-52 overflow-y-auto">
                      <table className="min-w-full text-xs">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-2 py-2 text-left">Item</th>
                            <th className="px-2 py-2 text-right">Qty</th>
                            <th className="px-2 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exec.items.map((item: ItemSale) => (
                            <tr key={item.barCode} className="border-t">
                              <td className="px-2 py-2">{item.itemName}</td>
                              <td className="px-2 py-2 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-2 py-2 text-right font-medium">
                                ₹{item.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-xs text-gray-400">
        Showing {data.length} days
      </div>
    </div>
  );
}
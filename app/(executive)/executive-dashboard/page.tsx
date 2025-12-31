"use client";

import Card from "@/components/ui/Card";
import RecentSaleOrder from "@/components/executive/executiveDashboard/RecentSaleOrder";
import useDashboard from "./useDashboard";

import {
  TrendingUp,
  Clock,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";

export default function DashboardPage() {
  const { loading, error, totalOrderSummery, saleOrderList } =
    useDashboard();

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of your sales performance
          </p>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Total Sales</p>
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-2xl font-bold mt-3">
            ₹{totalOrderSummery?.totalOrderCash ?? 0}
          </p>
          <p className="text-xs mt-1 opacity-80">This month</p>
        </div>

        {/* Pending Amount */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Pending Amount</p>
            <Clock className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-2xl font-bold mt-3">
            ₹{totalOrderSummery?.pendingOrderCash ?? 0}
          </p>
          <p className="text-xs mt-1 opacity-80">Awaiting completion</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Pending Orders</p>
            <ShoppingCart className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-2xl font-bold mt-3">
            {totalOrderSummery?.pendingOrderCount ?? 0}
          </p>
          <p className="text-xs mt-1 opacity-80">Orders in progress</p>
        </div>

        {/* Completed Orders */}
        <div className="rounded-xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Completed Orders</p>
            <CheckCircle2 className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-2xl font-bold mt-3">
            {totalOrderSummery?.completedOrderCount ?? 0}
          </p>
          <p className="text-xs mt-1 opacity-80">Successfully delivered</p>
        </div>
      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div className="grid grid-cols-1 gap-6">
        <Card title="Recent Sale Orders">
          <RecentSaleOrder data={saleOrderList} />
        </Card>
      </div>
    </div>
  );
}
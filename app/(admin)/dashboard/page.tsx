"use client";

import Card from "@/components/ui/Card";
import SaleOrderPercentageBar from "@/components/admin/dashboard/SaleOrderPercentageBar";
import RecentInventory from "@/components/admin/dashboard/RecentInventory";
import RecentSaleOrder from "@/components/admin/dashboard/RecentSaleOrder";
import useDashboard from "./useDashboard";

import { SaleOrderPerformance } from "@/types/dashboard";

/* ================= STATUS COLORS ================= */

const STATUS_COLOR: Record<string, string> = {
  draft: "text-gray-500",
  pending: "text-yellow-600",
  sent: "text-blue-600",
  declined: "text-red-600",
  accepted: "text-green-600",
};

export default function DashboardPage() {
  const {
    loading,
    error,
    saleSummary,
    customerSummary,
    inventory,
    saleOrderList,
    totalSaleSummary,
  } = useDashboard();

  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  /* ================= MAP CHART DATA ================= */
  const performance: SaleOrderPerformance =
    saleSummary?.performance?.map((item: any) => ({
      status: item.status.toUpperCase(),
      percentage: Number(item.percentage),
      count: Number(item.count),
      amount: Number(item.total_amount),
    })) || [];

  return (
    <div className="space-y-10 px-4 sm:px-6 pb-10 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Sales, customers, and inventory overview
        </p>
      </div>

      {/* ================= PRIMARY KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card
          title="Sales (This Month)"
          value={`₹${saleSummary?.total || 0}`}
          className="h-[120px]"
        />

        <Card
          title="Total Sales (All Time)"
          value={`₹${totalSaleSummary?.grand_total || 0}`}
          className="h-[120px]"
        />

        <Card
          title="Total Orders"
          value={totalSaleSummary?.total_orders || 0}
          className="h-[120px]"
        />

        <Card
          title="Active Customers"
          value={customerSummary?.active || 0}
          className="h-[120px]"
        />
      </div>

      {/* ================= STATUS BREAKDOWN ================= */}
      <Card title="Sale Orders by Status">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {totalSaleSummary?.by_status?.map((item: any) => (
            <div
              key={item.status}
              className="rounded-xl border border-gray-200 p-4 text-center bg-white"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {item.status}
              </p>

              <p
                className={`text-lg font-semibold mt-1 ${
                  STATUS_COLOR[item.status] || ""
                }`}
              >
                ₹{item.amount}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {item.orders} orders
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ================= CHART + RECENT ORDERS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Sale Order Status (%)"
          className="lg:col-span-2"
        >
          <SaleOrderPercentageBar data={performance} />
        </Card>

        <Card title="Recent Sale Orders">
          <RecentSaleOrder data={saleOrderList} />
        </Card>
      </div>

      {/* ================= INVENTORY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Inventory">
          <RecentInventory data={inventory} />
        </Card>

        <Card title="Inventory Summary">
          <p className="text-3xl font-bold">{inventory.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            Total inventory items
          </p>
        </Card>
      </div>
    </div>
  );
}
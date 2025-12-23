"use client";

import Card from "@/components/ui/Card";
import SaleOrderPercentageBar from "@/components/dashboard/SaleOrderPercentageBar";
import RecentInventory from "@/components/dashboard/RecentInventory";
import RecentSaleOrder from '@/components/dashboard/RecentSaleOrder'
import useDashboard from "./useDashboard";

import { SaleOrderPerformance } from "@/types/dashboard";

export default function DashboardPage() {
  const {
    loading,
    error,
    saleSummary,
    customerSummary,
    inventory,
    saleOrderList
  } = useDashboard();

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  /**
   * ✅ MAP BACKEND DATA → FRONTEND CHART DATA
   */
  const performance: SaleOrderPerformance =
    saleSummary?.performance?.map((item: any) => ({
      status: item.status.toUpperCase(),
      percentage: Number(item.percentage),
      count: Number(item.count),
      amount: Number(item.total_amount), // 👈 IMPORTANT
    })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Sales - This month" value={`₹${saleSummary?.total || 0}`} />
        <Card title="New Customers" value={customerSummary?.new || 0} />
        <Card title="Active Customers" value={customerSummary?.active || 0} />
        <Card title="Inventory Items" value={inventory.length} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sale Order Status (%)">
          <SaleOrderPercentageBar data={performance} />
        </Card>

        <Card title="Recent Sale Order">
        <RecentSaleOrder data={saleOrderList} />
      </Card>

       
      </div>

      {/* Recent Inventory */}
      <Card title="Recent Inventory">
        <RecentInventory data={inventory} />
      </Card>
    </div>
  );
}
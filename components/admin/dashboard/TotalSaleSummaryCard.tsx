"use client";

import Card from "@/components/ui/Card";

type StatusItem = {
  status: string;
  orders: number;
  amount: number;
};

type Props = {
  data: {
    grand_total: string;
    total_orders: number;
    by_status: StatusItem[];
  };
};

const STATUS_COLORS: Record<string, string> = {
  draft: "text-gray-500",
  pending: "text-yellow-600",
  sent: "text-blue-600",
  declined: "text-red-600",
  accepted: "text-green-600",
};

export default function SaleStatusSummary({ data }: Props) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* ================= OVERALL ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Total Orders (All Time)">
          <p className="text-2xl font-bold">{data.total_orders}</p>
        </Card>

        <Card title="Total Sales Value (All Time)">
          <p className="text-2xl font-bold">₹{data.grand_total}</p>
        </Card>
      </div>

      {/* ================= STATUS BREAKDOWN ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.by_status.map((item) => (
          <Card
            key={item.status}
            title={item.status.toUpperCase()}
          >
            <p
              className={`text-xl font-semibold ${
                STATUS_COLORS[item.status] || ""
              }`}
            >
              ₹{item.amount}
            </p>
            <p className="text-sm text-gray-500">
              {item.orders} orders
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
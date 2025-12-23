"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#facc15", "#94a3b8", "#22c55e", "#ef4444", "#3b82f6"];

export default function SaleOrderPercentagePie({ data }: { data: any[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="status"
            outerRadius={100}
            label={(d) => `${d.status} (${d.percentage}%)`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => `${value}%`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
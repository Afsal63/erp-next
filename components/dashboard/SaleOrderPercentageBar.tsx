"use client";

import { SaleOrderPerformance } from "@/types/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: SaleOrderPerformance
};

export default function SaleOrderPercentageBar({ data }: Props) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="status" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "percentage") {
                return [`${value}%`, "Completion"];
              }
              return value;
            }}
            labelFormatter={(label) => `Status: ${label}`}
            content={({ payload }) => {
              if (!payload || !payload.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white border rounded-lg p-3 text-sm shadow">
                  <p className="font-semibold">{d.status}</p>
                  <p>Percentage: {d.percentage}%</p>
                  <p>Orders: {d.count}</p>
                  <p>Total Amount: ₹{d.amount}</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="percentage"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
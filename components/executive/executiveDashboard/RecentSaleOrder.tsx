"use client";

import { formatDate } from "@/lib/formateDate";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function RecentSaleOrder({ data }: { data: any[] }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
       
        <span className="text-xs text-gray-400">
          Last 5 records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Customer
              </th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data?.slice(0, 5).map((item) => (
              <tr
                key={item._id}
                onClick={() =>
                  router.push(`/executive-saleOrder/${item._id}`)
                }
                className="group cursor-pointer transition hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-gray-700">
                  {formatDate(item.date)}
                </td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  {item.clientName}
                </td>

                <td className="px-4 py-3 text-right">
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition" />
                </td>
              </tr>
            ))}

            {!data?.length && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No recent inventory found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
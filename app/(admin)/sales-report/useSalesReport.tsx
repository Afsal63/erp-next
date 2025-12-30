// src/hooks/useSalesReport.ts

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SalesReportService from "@/services/admin/SalesReportService";

type SalesReportItem = {
  category: string;
  month: string;
  totalSales: number;
};

export default function useSalesReport() {
  const [data, setData] = useState<SalesReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await SalesReportService.getSalesReport();

        // ✅ FIX: extract array safely
        setData(Array.isArray(res?.result) ? res.result : []);
      } catch (err: any) {
        setError(err.message || "Failed to load sales report");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ================= DERIVED DATA ================= */

  const byCategory = useMemo<Record<string, number>>(() => {
    if (!Array.isArray(data) || !data.length) return {};

    return data.reduce(
      (acc, cur) => {
        acc[cur.category] = (acc[cur.category] || 0) + cur.totalSales;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [data]);

  const months = useMemo<string[]>(() => {
    if (!Array.isArray(data)) return [];
    return Array.from(new Set(data.map(d => d.month))).sort();
  }, [data]);

  return {
    data,
    byCategory,
    months,
    loading,
    error,
    router
  };
}
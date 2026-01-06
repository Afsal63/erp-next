"use client";

import { useEffect, useState } from "react";
import SalesReportService from "@/services/admin/SalesReportService";
import { DailySalesRow } from "@/types/useDailySalesReport";

/* ================= TYPES ================= */



/* ================= HOOK ================= */

export default function useDailySalesReport() {
  const [data, setData] = useState<DailySalesRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================= FETCH ================= */

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await SalesReportService.getDailySalesReport();

      setData(Array.isArray(res?.result) ? res.result : []);
    } catch (err: any) {
      setError(err.message || "Failed to load daily sales");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const applyDateFilter = async (from: string, to: string) => {
    if (!from || !to) return;

    try {
      setLoading(true);
      setError(null);

      const res = await SalesReportService.filterDailySalesByDate({
        fromDate: from,
        toDate: to,
      });

      setData(Array.isArray(res?.result) ? res.result : []);
    } catch (err: any) {
      setError(err.message || "Failed to filter daily sales");
    } finally {
      setLoading(false);
    }
  };

  const clearDateFilter = () => {
    setFromDate("");
    setToDate("");
    fetchReport();
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return {
    data,
    loading,
    error,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    applyDateFilter,
    clearDateFilter,
  };
}
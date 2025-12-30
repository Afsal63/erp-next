"use client";

import { useEffect, useState } from "react";
import SalesReportService from "@/services/SalesReportService";

/* ================= TYPES ================= */

export type CategorySaleItem = {
  _id: string;
  number: string;
  date: string;
  total: number;
  status: string;
  client?:{
    company?: string;
  }
  clientInfo?: {
    company?: string;
  };
};

export default function useCategorySales(category: string) {
  const [data, setData] = useState<CategorySaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  /* ================= FETCH DEFAULT CATEGORY DATA ================= */

  const fetchCategorySales = async () => {
    if (!category) return;

    try {
      setLoading(true);
      const res = await SalesReportService.getSalesByCategory(category);
      setData(Array.isArray(res?.result) ? res.result : []);
    } catch (err: any) {
      setError(err.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPLY DATE FILTER ================= */

  const applyDateFilter = async (from: string, to: string) => {
    if (!category || !from || !to) return;

    try {
      setLoading(true);
      const res = await SalesReportService.filterSalesByDate({
        category,
        fromDate: from,
        toDate: to,
      });

      setData(Array.isArray(res?.result) ? res.result : []);
    } catch (err: any) {
      setError(err.message || "Failed to filter sales");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEAR FILTER ================= */

  const clearDateFilter = () => {
    setFromDate(null);
    setToDate(null);
    fetchCategorySales(); // 🔥 restore original data
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchCategorySales();
  }, [category]);

  /* ================= PUBLIC API ================= */

  return {
    data,
    loading,
    error,

    // date state
    fromDate,
    toDate,
    setFromDate,
    setToDate,

    // actions
    applyDateFilter,
    clearDateFilter,
  };
}
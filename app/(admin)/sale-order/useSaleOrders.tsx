"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import SaleOrderService from "@/services/SaleOrderService";

const ITEMS_PER_PAGE = 10;

const useSaleOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchOrders = async (
    pageNo: number = page,
    searchValue: string = search
  ) => {
    try {
      setLoading(true);

      let res;

      if (searchValue.trim()) {
        res = await SaleOrderService.search(
          pageNo,
          ITEMS_PER_PAGE,
          searchValue.trim()
        );
      } else {
        res = await SaleOrderService.list(pageNo, ITEMS_PER_PAGE);
      }

      if (res?.success) {
        setOrders(res.result || []);
        setPagination(res.pagination || null);
      } else {
        setOrders([]);
        setPagination(null);
      }
    } catch {
      toast.error("Failed to load sale orders");
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ IMPORTANT FIX */
  useEffect(() => {
    fetchOrders(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /* ================= SEARCH ================= */
  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setSearch(trimmed);
    setPage(1);
    fetchOrders(1, trimmed);
  };

  return {
    loading,
    orders,
    page,
    pagination,
    setPage,
    handleSearch,
    fetchOrders,
  };
};

export default useSaleOrders;
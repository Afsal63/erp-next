"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import SaleOrderService from "@/services/SaleOrderService";

const ITEMS_PER_PAGE = 10;

const useEmployeeSaleOrders = (employeeId?: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const fetchOrders = async (pageNo = page) => {
    if (!employeeId) return;

    try {
      setLoading(true);

     const res = await SaleOrderService.saleOrdersByEmployee(
        employeeId,
        pageNo,
        ITEMS_PER_PAGE
      );

      setOrders(res?.success ? res.result : []);
      setPagination(res?.pagination || null);
    } catch {
      toast.error("Failed to load sale orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, page]);

  return {
    orders,
    loading,
    page,
    pagination,
    setPage,
    refresh: fetchOrders,
  };
};

export default useEmployeeSaleOrders;
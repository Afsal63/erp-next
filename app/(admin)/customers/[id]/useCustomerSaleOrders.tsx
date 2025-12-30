"use client";

import { useEffect, useState } from "react";
import apiRequest from "@/lib/apiRequest";
import SaleOrderService from "@/services/admin/SaleOrderService";

const ITEMS_PER_PAGE = 10;

const useCustomerSaleOrders = (customerId?: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    if (!customerId) return;

    const fetchOrders = async (pageNo =page) => {
      try {
        setLoading(true);

         const res = await SaleOrderService.saleOrdersByClient(
        customerId,
        pageNo,
        ITEMS_PER_PAGE
      );

        setOrders(res?.success ? res.result || [] : []);
        setPagination(res?.pagination || null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, page]);

  return {
    orders,
    loading,
    page,
    pagination,
    setPage,
  };
};

export default useCustomerSaleOrders;
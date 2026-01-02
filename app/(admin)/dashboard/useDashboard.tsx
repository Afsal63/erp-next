"use client";

import { useEffect, useState } from "react";
import DashboardService from "@/services/admin/DashboardService";

const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saleSummary, setSaleSummary] = useState<any>(null);
  const [totalSaleSummary, setTotalSaleSummary] = useState<any>(null);
  const [quotationSummary, setQuotationSummary] = useState<any>(null);
  const [saleOrderList, setSalerOrderList] = useState<any>(null);
  const [customerSummary, setCustomerSummary] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [
          saleRes,
          totalSaleRes,
          recentSalerOrder,
          customerRes,
          inventoryRes,
        ] = await Promise.all([
          DashboardService.getSaleOrderSummary(),
          DashboardService.getTotalSaleOrderSummary(),
          DashboardService.getRecentSalerOrderList(),
          DashboardService.getCustomerSummary(),
          DashboardService.getRecentInventory(),
        ]);

        if (saleRes?.success) setSaleSummary(saleRes.result);
        if (totalSaleRes?.success) setTotalSaleSummary(totalSaleRes.result);
        if (recentSalerOrder?.success)
          setSalerOrderList(recentSalerOrder.result);
        if (customerRes?.success) setCustomerSummary(customerRes.result);
        if (inventoryRes?.success) setInventory(inventoryRes.result || []);
      } catch (err: any) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    loading,
    error,
    saleSummary,
    quotationSummary,
    totalSaleSummary,
    customerSummary,
    inventory,
    saleOrderList,
  };
};

export default useDashboard;

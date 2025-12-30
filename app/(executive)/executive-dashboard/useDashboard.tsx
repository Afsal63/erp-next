"use client";

import { useEffect, useState } from "react";
import DashboardService from "@/services/executive/DashboardService";
import { getUser } from "@/lib/auth";
import { UserType } from "@/types/user";

const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [saleSummary, setSaleSummary] = useState<any>(null);
  const [quotationSummary, setQuotationSummary] = useState<any>(null);
  const [saleOrderList, setSaleOrderList] = useState<any>(null);
  const [customerSummary, setCustomerSummary] = useState<any>(null);
  const [user, setUser] = useState<UserType | null>(null);

  /* ================= GET USER ================= */
  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    if (!user?.id) return; // ⛔ wait until user is ready

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          saleOrderRes,
          recentSaleOrderRes,
          customerRes,
        ] = await Promise.all([
          DashboardService.getSaleOrderSummary(user.id),
          DashboardService.getRecentSaleOrderList(user.id),
          DashboardService.getCustomerSummary(user.id),
        ]);

        if (saleOrderRes?.success) {
          setSaleSummary(saleOrderRes.result);
        }

        if (recentSaleOrderRes?.success) {
          setSaleOrderList(recentSaleOrderRes.result.recentOrders);
        }

        if (customerRes?.success) {
          setCustomerSummary(customerRes.result);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.id]);

  return {
    loading,
    error,
    saleSummary,
    quotationSummary,
    customerSummary,
    saleOrderList,
  };
};

export default useDashboard;
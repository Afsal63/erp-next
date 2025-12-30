"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import SaleOrderService from "@/services/admin/SaleOrderService";

export default function useViewSaleOrder(
  printRef: React.RefObject<HTMLDivElement>
) {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await SaleOrderService.readById(id as string);
        if (res?.success) setOrder(res.result);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= PDF DOWNLOAD (NO html2canvas) ================= */
  const downloadPdf = async () => {
    if (!printRef.current || !order) return;

    const pdf = new jsPDF("p", "mm", "a4");

    await pdf.html(printRef.current, {
      x: 10,
      y: 10,
      width: 190, // A4 width minus margins
      windowWidth: 794, // EXACT A4 PX WIDTH
      html2canvas: {
        scale: 1, // IMPORTANT: no scaling
        useCORS: true,
      },
    });

    pdf.save(`Invoice-${order.number}.pdf`);
  };

  return {
    order,
    loading,
    router,
    downloadPdf,
  };
}
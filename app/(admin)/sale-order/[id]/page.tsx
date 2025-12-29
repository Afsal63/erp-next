"use client";

import { useRef } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from "@/components/viewSaleOrder/InvoicePdf";
import { ArrowLeft, FileDown } from "lucide-react";
import Image from "next/image";
import useViewSaleOrder from "./useViewSaleOrder";
import TotalRow from "@/components/viewSaleOrder/TotalRow";
import Row from "@/components/viewSaleOrder/Row";

/* ================= STATIC COMPANY INFO ================= */

const COMPANY = {
  name: "MUSFIRA SALTED PRESERVED FISH & SEAFOOD TRADING CO.L.L.C",
  arabic: "مصفرة لتجارة الاسماك والاغذية البحرية المملحة والمحفوظة ذ.م.م",
  phones: "+971 52 972 4362 / 058 877 3535",
  address: "Deira, Dubai - UAE",
  email: "musfiradryfishdubai@gmail.com",
  trn: "100614900700003",
};

export default function SaleOrderViewPage() {
  const printRef = useRef<any>(null);

  const { order, loading, router, downloadPdf } = useViewSaleOrder(printRef);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading sale order...</div>;
  }

  if (!order) {
    return <div className="p-6 text-red-500">Sale order not found</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
          </button>

          <h1 className="text-xl font-semibold">Invoice #{order.number}</h1>
        </div>

        <PDFDownloadLink
          document={<InvoicePdf order={order} />}
          fileName={`Invoice-${order.number}.pdf`}
          className="px-4 py-2 border rounded-lg flex items-center gap-2"
        >
          {({ loading }) =>
            loading ? (
              "Preparing PDF..."
            ) : (
              <>
                <FileDown size={16} />
                Download PDF
              </>
            )
          }
        </PDFDownloadLink>
      </div>

      {/* ================= PRINT AREA ================= */}

      <div className="overflow-x-auto">
        <div
          ref={printRef}
          className="bg-white text-black mx-auto p-8"
          style={{
            minWidth: "794px", // EXACT A4 WIDTH
            // color: "#000",
            backgroundColor: "#fff",
          }}
        >
          {/* COMPANY / CLIENT / EXECUTIVE */}
          <div className="grid grid-cols-3 gap-6 border-b pb-6">
            <div className="space-y-2 text-sm">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={140}
                height={70}
              />
              <p className="font-bold">{COMPANY.name}</p>
              <p>{COMPANY.arabic}</p>
              <p>{COMPANY.phones}</p>
              <p>{COMPANY.address}</p>
              <p>{COMPANY.email}</p>
              <p className="font-medium">TRN: {COMPANY.trn}</p>
            </div>

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Client</h3>
              <Row label="Company" value={order.client?.company} />
              <Row label="Address" value={order.client?.address} />
              <Row label="Phone" value={order.client?.phone} />
              <Row label="Client TRN" value={order.client?.clientTrnNumber} />
            </div>

            <div className="space-y-2 text-sm">
              <h3 className="font-semibold">Executive</h3>
              <Row label="Date" value={new Date(order.date).toDateString()} />
              <Row
                label="Name"
                value={`${order.executive?.name} ${
                  order.executive?.surname || ""
                }`}
              />
              <Row
                label="Phone"
                value={`${order.executive?.phonePrefix} ${order.executive?.phone}`}
              />
            </div>
          </div>

          {/* ITEMS */}
          <table className="w-full text-sm mt-8 border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th>Barcode</th>
                <th>Price</th>
                <th>Qty</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i: any) => (
                <tr key={i._id} className="border-b">
                  <td className="py-3 font-medium">{i.itemName}</td>
                  <td>{i.barCode}</td>
                  <td>{Number(i.price).toFixed(2)}</td>
                  <td>{i.quantity}</td>
                  <td className="text-right font-medium">
                    {Number(i.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTALS */}
          <div className="flex justify-end mt-8">
            <div className="w-72 space-y-2 text-sm">
              <TotalRow label="Sub Total" value={order.subTotal} />

              {Number(order.discountPercent) > 0 && (
                <TotalRow
                  label={`Customer Discount (${order.discountPercent}%)`}
                  value={`-${order.discountAmount}`}
                  highlight="discount"
                />
              )}

              <TotalRow
                label={`VAT (${order.taxRate}%)`}
                value={order.taxTotal}
              />

              <TotalRow label="Grand Total" value={order.total} bold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

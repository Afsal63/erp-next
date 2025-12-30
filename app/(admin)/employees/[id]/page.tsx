"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, IndianRupee } from "lucide-react";
import EmployeeService from "@/services/admin/EmployeeService";
import Pagination from "@/components/ui/Pagination";
import useEmployeeSaleOrders from "./useEmployeeSaleOrders";

/* ================= PAGE ================= */

export default function EmployeeViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    orders = [], // ✅ SAFE DEFAULT
    loading: ordersLoading,
    page,
    pagination,
    setPage,
  } = useEmployeeSaleOrders(id as string);

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await EmployeeService.readById(id as string);
        if (res?.success) setEmployee(res.result);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ================= STATS (SAFE) ================= */
  const stats = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];

    const totalOrders = safeOrders.length;
    const revenue = safeOrders.reduce(
      (sum, o) => sum + Number(o?.total || 0),
      0
    );

    return { totalOrders, revenue };
  }, [orders]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading employee...</div>;
  }

  if (!employee) {
    return <div className="p-6 text-red-500">Employee not found</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-bold">Employee Overview</h1>
      </div>

      {/* ================= INFO CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          label="Name"
          value={`${employee.name} ${employee.surname || ""}`}
        />
        <InfoCard label="Email" value={employee.email} />
        <InfoCard
          label="Phone"
          value={`${employee.phonePrefix} ${employee.phone}`}
        />
        <InfoCard label="Department" value={employee.department || "-"} />
        <InfoCard label="Position" value={employee.position || "-"} />
        <InfoCard
          label="Status"
          value={employee.enabled ? "Active" : "Inactive"}
          badge
        />
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart size={18} />}
        />
        <StatCard
          title="Total Revenue"
          value={`₹ ${stats.revenue.toFixed(2)}`}
          icon={<IndianRupee size={18} />}
        />
      </div>

      {/* ================= SALE ORDERS ================= */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-lg">Sale Orders</h2>

        {ordersLoading && (
          <p className="text-sm text-gray-500">Loading orders...</p>
        )}

        {!ordersLoading && orders.length === 0 && (
          <p className="text-sm text-gray-500">
            No sale orders assigned to this employee
          </p>
        )}

        <div className="grid gap-4">
          {orders.map((o: any) => (
            <div
              key={o._id}
              onClick={() => router.push(`/sale-order/${o._id}`)}
              className="border cursor-pointer rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{o.number}</span>
                <span className="text-xs text-gray-500">
                  {new Date(o.date).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Client: <span className="font-medium">{o.client?.company}</span>
              </p>

              <div className="flex justify-between items-center">
                <span className="font-medium">₹ {o.total}</span>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    o.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {pagination?.pages > 1 && (
          <Pagination
            page={page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const InfoCard = ({
  label,
  value,
  badge,
}: {
  label: string;
  value?: string;
  badge?: boolean;
}) => (
  <div className="bg-white border rounded-xl p-4 text-sm shadow-sm">
    <p className="text-gray-500">{label}</p>
    {badge ? (
      <span
        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
          value === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {value}
      </span>
    ) : (
      <p className="font-medium">{value || "-"}</p>
    )}
  </div>
);

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm">
    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

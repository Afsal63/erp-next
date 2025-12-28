"use client";

import { X, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";

/* ================= FORM SELECT OPTION TYPE ================= */

type Option =
  | string
  | {
      value: string;
      label: string;
    };

/* ================= TYPES ================= */

type ExecutiveItem = {
  _id: string;
  itemName: string;
  barCode: string;
  actualQty: number;
  price?: number;
};

type Executive = {
  _id: string;
  name: string;
  surname?: string;
  items: ExecutiveItem[];
};

type Client = {
  _id: string;
  company: string;
  executive?: Executive;
};

type ItemRow = {
  barCode: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
};

/* ================= PROPS ================= */

type Props = {
  open: boolean;
  mode: "view" | "edit" | "create";
  loading?: boolean;
  form: any;
  setForm: (fn: (prev: any) => any) => void;
  onClose: () => void;
  onSave: () => void;
  customers: Client[];
  onCustomerSearch: (q: string) => void;
};

/* ================= CONSTANTS ================= */

const STATUS_OPTIONS: Option[] = ["pending", "accepted", "declined"];

/* ================= COMPONENT ================= */

export default function SaleOrderModal({
  open,
  mode,
  loading = false,
  form,
  setForm,
  onClose,
  onSave,
  customers,
  onCustomerSearch,
}: Props) {
  /* ================= STATE ================= */

  const items: ItemRow[] = Array.isArray(form.items) ? form.items : [];
  const [selectedBarcode, setSelectedBarcode] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    setLoadingCustomers(false);
  }, [customers]);

  // ✅ AUTO SET EXECUTIVE WHEN CUSTOMER CHANGES (TS SAFE)
  useEffect(() => {
    if (!form.client) return;

    const c = customers.find((x) => x._id === form.client);
    if (!c?.executive) return;

    const exec = c.executive; // 🔒 REQUIRED FOR TS

    setForm((p: any) => ({
      ...p,
      executive: exec._id,
      executiveName: `${exec.name} ${exec.surname || ""}`,
      executiveItems: exec.items,
    }));
  }, [form.client, customers, setForm]);

  /* ================= DERIVED ================= */

  const barcodeOptions: Option[] = useMemo(() => {
    if (!Array.isArray(form.executiveItems)) return [];

    const codes: string[] = form.executiveItems.map((i: ExecutiveItem) =>
      String(i.barCode)
    );

    const uniqueCodes = Array.from(new Set(codes));

    return uniqueCodes.map((code) => ({
      value: code,
      label: `Barcode ${code}`,
    }));
  }, [form.executiveItems]);

  const selectedBarcodes = useMemo(() => {
    return [...new Set(items.map((i) => i.barCode))];
  }, [items]);

  if (!open) return null;

  /* ================= HELPERS ================= */

  const update = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const recalcTotals = (rows: ItemRow[]) => {
    const subTotal = rows.reduce((s, r) => s + r.total, 0);
    const taxRate = Number(form.taxRate || 5);
    const taxTotal = (subTotal * taxRate) / 100;

    setForm((prev: any) => ({
      ...prev,
      items: rows,
      subTotal,
      taxTotal,
      total: subTotal + taxTotal,
    }));
  };

  const updateItem = (index: number, patch: Partial<ItemRow>) => {
    const updated = items.map((it, i) =>
      i === index
        ? {
            ...it,
            ...patch,
            total: (patch.quantity ?? it.quantity) * (patch.price ?? it.price),
          }
        : it
    );
    recalcTotals(updated);
  };

  /* ================= BARCODE HANDLERS ================= */

  const handleBarcodeSelect = (barCode: string) => {
    setSelectedBarcode("");

    const related =
      form.executiveItems?.filter((i: any) => i.barCode === barCode) || [];

    const rows: ItemRow[] = related.map((i: any) => ({
      barCode: i.barCode,
      itemName: i.itemName,
      quantity: 1,
      price: Number(i.price || 0),
      total: Number(i.price || 0),
    }));

    recalcTotals([...items, ...rows]);
  };

  const removeBarcode = (barCode: string) => {
    recalcTotals(items.filter((i) => i.barCode !== barCode));
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Save Sale Order" : "Edit Sale Order"}
          </h2>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              + Save Sale Order
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* CUSTOMER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Customer *
              </label>

              <input
                placeholder="Search Here"
                onChange={(e) => {
                  setLoadingCustomers(true);
                  onCustomerSearch(e.target.value);
                }}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />

              <select
                className="w-full mt-2 px-3 py-2 border rounded-lg"
                value={form.client || ""}
                disabled={loadingCustomers}
                onChange={(e) => {
                  const c = customers.find((x) => x._id === e.target.value);

                  if (!c?.executive) {
                    setForm((p: any) => ({
                      ...p,
                      client: c?._id || "",
                      clientName: c?.company || "",
                      executive: "",
                      executiveName: "",
                      executiveItems: [],
                      items: [],
                    }));
                    return;
                  }

                  const exec = c.executive;

                  setForm((p: any) => ({
                    ...p,
                    client: c._id,
                    clientName: c.company,
                    executive: exec._id,
                    executiveName: `${exec.name} ${exec.surname || ""}`,
                    executiveItems: exec.items,
                    items: [],
                  }));
                }}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.company}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Executive"
              value={form.executiveName || ""}
              disabled
              onChange={() => {}}
            />

            <FormSelect
              label="Status"
              value={form.status || "pending"}
              options={STATUS_OPTIONS}
              onChange={(v) => update("status", v)}
            />
          </div>

          {/* ================= NOTE / DATE ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Note"
              value={form.note || ""}
              onChange={(v) => update("note", v)}
            />
            <FormInput
              label="Date"
              type="date"
              value={form.date || ""}
              onChange={(v) => update("date", v)}
            />
          </div>

          {/* BARCODE */}
          <FormSelect
            label="Add Barcode"
            value={selectedBarcode}
            options={barcodeOptions}
            disabled={!form.client}
            onChange={handleBarcodeSelect}
          />

          {/* TAGS */}
          <div className="flex flex-wrap gap-2">
            {selectedBarcodes.map((code) => (
              <span
                key={code}
                className="px-3 py-1 bg-blue-100 rounded-full text-xs flex gap-1"
              >
                {code}
                <button onClick={() => removeBarcode(code)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* ITEMS */}
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2">
              <FormInput
                label="Item"
                value={item.itemName}
                disabled
                onChange={() => {}}
              />
              <FormInput
                label="Qty"
                value={String(item.quantity)}
                onChange={(v) => updateItem(idx, { quantity: Number(v) })}
              />
              <FormInput
                label="Rate"
                value={String(item.price)}
                onChange={(v) => updateItem(idx, { price: Number(v) })}
              />
              <div className="flex gap-2">
                <FormInput
                  label="Total"
                  value={String(item.total)}
                  disabled
                  onChange={() => {}}
                />
                <button
                  onClick={() =>
                    recalcTotals(items.filter((_, i) => i !== idx))
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* ================= TOTALS ================= */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <FormInput
                label="Tax (5%)"
                value={String(form.taxTotal || "0.00")}
                onChange={() => {}}
                disabled
              />
              <FormInput
                label="Grand Total"
                value={String(form.total || "0.00")}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

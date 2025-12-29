"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import { BARCODE_OPTIONS } from "@/constants/barcodes";

/* ================= CONSTANTS ================= */

const DEPARTMENTS = [
  "Sales",
  "Production",
  "Accounts",
  "Packing",
  "Marketing",
  "Delivery",
];

const POSITIONS = [
  "Production Head",
  "Packing Head",
  "Packing Staff",
  "Quality Controller",
  "Accountants Head",
  "Billing Staff",
  "Delivery Staff",
  "Head Of Sales",
];

/* ================= TYPES ================= */

type Props = {
  open: boolean;
  mode?: "create" | "edit" |"";
  loading?: boolean;
  form: any;
  setForm: (fn: (prev: any) => any) => void;
  onBarcodeSelect: (barCode: string) => void;
  onClose: () => void;
  onSave: () => void;
};

/* ================= COMPONENT ================= */

export default function EmployeeModal({
  open,
  mode,
  loading,
  form,
  setForm,
  onBarcodeSelect,
  onClose,
  onSave,
}: Props) {
  const [selectedBarcode, setSelectedBarcode] = useState("");

  /* ================= DERIVED ================= */

  // only for UI tags (NOT for blocking logic)
  const selectedBarcodes = useMemo(() => {
    const set = new Set<string>();
    (form.items || []).forEach((i: any) => {
      if (i.barCode) set.add(i.barCode);
    });
    return Array.from(set);
  }, [form.items]);

  /* ================= HANDLERS ================= */

  const handleBarcodeSelect = (barCode: string) => {
    setSelectedBarcode("");
    onBarcodeSelect(barCode); // 🔒 untouched
  };

  // ✅ Remove only ONE item (row-level remove)
  const removeItemById = (id: string) => {
    setForm((prev: any) => ({
      ...prev,
      items: (prev.items || []).filter((i: any) => i._id !== id),
    }));
  };

  // ✅ Remove ALL items under a barcode (tag-level remove)
  const removeBarcode = (barCode: string) => {
    setForm((prev: any) => ({
      ...prev,
      items: (prev.items || []).filter((i: any) => i.barCode !== barCode),
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg max-h-[90vh] flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between px-5 py-4 border-b shrink-0">
          <h2 className="font-semibold text-lg">
            {mode === "create" ? "Create Employee" : "Edit Employee"}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* BASIC INFO */}
          <FormInput
            label="Name"
            value={form.name || ""}
            onChange={(v) => setForm((p: any) => ({ ...p, name: v }))}
          />

          <FormInput
            label="Surname"
            value={form.surname || ""}
            onChange={(v) => setForm((p: any) => ({ ...p, surname: v }))}
          />
          <FormInput
            label="email"
            value={form.email || ""}
            onChange={(v) => setForm((p: any) => ({ ...p, email: v }))}
          />

          <FormInput
            label="Phone"
            value={form.phone || ""}
            onChange={(v) => setForm((p: any) => ({ ...p, phone: v }))}
          />

          <FormSelect
            label="Department"
            value={form.department || ""}
            options={DEPARTMENTS}
            onChange={(v) => setForm((p: any) => ({ ...p, department: v }))}
          />

          <FormSelect
            label="Position"
            value={form.position || ""}
            options={POSITIONS}
            onChange={(v) => setForm((p: any) => ({ ...p, position: v }))}
          />

          {/* ================= BARCODE SELECT ================= */}
          <FormSelect
            label="Add Barcode"
            value={selectedBarcode}
            options={BARCODE_OPTIONS}
            onChange={handleBarcodeSelect}
          />

          {/* ================= BARCODE TAGS ================= */}
          {selectedBarcodes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedBarcodes.map((code) => (
                <span
                  key={code}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {code}
                  <button
                    onClick={() => removeBarcode(code)}
                    className="hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* ================= ITEMS ================= */}
          {(form.items || []).map((item: any, i: number) => (
            <div key={item._id} className="border p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold">{item.itemName}</p>
                  <p className="text-xs text-gray-500">
                    Barcode: {item.barCode}
                  </p>
                </div>

                <button
                  onClick={() => removeItemById(item._id)}
                  className="text-red-500"
                >
                  <X size={14} />
                </button>
              </div>

              {/* ================= QTY ROW ================= */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                {/* ACTUAL QTY — ONLY IF BACKEND SENT */}
                {typeof item.actualQty !== "undefined" && (
                  <div>
                    <p className="text-gray-500">Actual Qty</p>
                    <input
                      type="number"
                      min={0}
                      value={item.actualQty}
                      onChange={(e) => {
                        const qty = Number(e.target.value);
                        setForm((prev: any) => {
                          const next = [...prev.items];
                          next[i] = {
                            ...next[i],
                            actualQty: qty,
                          };
                          return { ...prev, items: next };
                        });
                      }}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                )}

                {/* ADD QTY — ALWAYS */}
                <div>
                  <p className="text-gray-500">Add Qty</p>
                  <input
                    type="number"
                    min={0}
                    value={item.quantity ?? ""}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setForm((prev: any) => {
                        const next = [...prev.items];
                        next[i] = {
                          ...next[i],
                          quantity: qty,
                        };
                        return { ...prev, items: next };
                      });
                    }}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                {/* AVAILABLE QTY — READ ONLY */}
                {/* AVAILABLE QTY — ONLY FOR NEWLY ADDED INVENTORY ITEMS */}
                {typeof item.availableQty !== "undefined" && (
                  <div>
                    <p className="text-gray-500">Available Qty</p>
                    <p className="font-medium">{item.availableQty}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 border-t flex gap-3 shrink-0">
          <button onClick={onClose} className="flex-1 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { X } from "lucide-react";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import { BARCODE_OPTIONS } from "@/constants/barcodes";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  form: any;
  setForm: (fn: (prev: any) => any) => void;
  inventoryItems: any[];
  onBarcodeSelect: (barCode: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function EmployeeModal({
  open,
  mode,
  loading,
  form,
  setForm,
  inventoryItems,
  onBarcodeSelect,
  onClose,
  onSave,
}: Props) {
  if (!open) return null;

  const update = (key: string, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  const updateItemQty = (index: number, qty: number) => {
    const items = [...(form.items || [])];
    items[index].quantity = qty;
    update("items", items);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-lg">
            {mode === "create" ? "Create Employee" : "Edit Employee"}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <FormInput label="Name" value={form.name} onChange={(v) => update("name", v)} />
          <FormInput label="Surname" value={form.surname} onChange={(v) => update("surname", v)} />
          <FormInput label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />

          <FormSelect
            label="Select Barcode"
            value=""
            options={BARCODE_OPTIONS}
            onChange={(v) => onBarcodeSelect(v)}
          />

          {/* INVENTORY ITEMS */}
          {inventoryItems.map((item, i) => (
            <div key={item._id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <p className="text-sm font-medium">{item.itemName}</p>
                <p className="text-xs text-gray-500">
                  Available: {item.actualQty}
                </p>
              </div>

              <input
                type="number"
                min={0}
                placeholder="Qty"
                onChange={(e) =>
                  updateItemQty(i, Number(e.target.value))
                }
                className="w-20 border rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
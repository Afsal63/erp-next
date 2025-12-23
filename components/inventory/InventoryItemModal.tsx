"use client";

import { X } from "lucide-react";

type Mode = "view" | "edit" | "create";

type Props = {
  open: boolean;
  mode: Mode;
  loading: boolean;
  form: any;
  setForm: (v: any) => void;
  onClose: () => void;
  onSave: () => void;
};

const BARCODE_OPTIONS = [
  "9656222255661",
  "9656332255662",
  "9656442255663",
  "9656552255664",
  "9656662255665",
  "9656772255666",
  "9656112255660",
];

const UNIT_OPTIONS = ["Kg", "Numbers", "Grams", "Liters"];

export default function InventoryItemModal({
  open,
  mode,
  loading,
  form,
  setForm,
  onClose,
  onSave,
}: Props) {
  if (!open) return null;

  const isView = mode === "view";
  const isCreate = mode === "create";
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 space-y-5">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {mode === "view" && "View Inventory Item"}
            {mode === "edit" && "Edit Inventory Item"}
            {mode === "create" && "Add Inventory Item"}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <div className="space-y-4">
          {/* Item Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Item Name
            </label>
            <input
              disabled={isView}
              value={form.itemName || ""}
              onChange={(e) =>
                setForm({ ...form, itemName: e.target.value })
              }
              className={`
                w-full px-4 py-2 border rounded-lg
                ${isView ? "bg-gray-100" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              placeholder="Item name"
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              disabled={isView}
              type="number"
              value={form.normalDiscountedPrice || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  normalDiscountedPrice: e.target.value,
                })
              }
              className={`
                w-full px-4 py-2 border rounded-lg
                ${isView ? "bg-gray-100" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              placeholder="Price"
            />
          </div>

          {/* Barcode (DROPDOWN ONLY ON CREATE) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Barcode
            </label>

            {isCreate ? (
              <select
                value={form.barCode || ""}
                onChange={(e) =>
                  setForm({ ...form, barCode: e.target.value })
                }
                className="
                  w-full px-4 py-2 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              >
                <option value="">Select barcode</option>
                {BARCODE_OPTIONS.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            ) : (
              <input
                disabled
                value={form.barCode || ""}
                className="
                  w-full px-4 py-2 border rounded-lg
                  bg-gray-100 text-gray-600
                "
              />
            )}
          </div>

          {/* Quantity (EDITABLE IN CREATE + EDIT) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Quantity
            </label>
            <input
              disabled={isView}
              type="number"
              value={form.quantity ?? ""}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              className={`
                w-full px-4 py-2 border rounded-lg
                ${isView ? "bg-gray-100 text-gray-600" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              placeholder="Quantity"
            />
          </div>

          {/* Unit of Measure (DROPDOWN) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Unit of Measure
            </label>
            <select
              disabled={isView}
              value={form.unitOfMeasures || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  unitOfMeasures: e.target.value,
                })
              }
              className={`
                w-full px-4 py-2 border rounded-lg
                ${isView ? "bg-gray-100" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              <option value="">Select unit</option>
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Close
          </button>

          {(isEdit || isCreate) && (
            <button
              disabled={loading}
              onClick={onSave}
              className="
                px-5 py-2 rounded-lg
                bg-blue-600 text-white
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {loading ? "Saving..." : isCreate ? "Create" : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
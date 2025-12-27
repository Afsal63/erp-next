"use client";

import { X, Plus, Trash2 } from "lucide-react";

/* ================= TYPES ================= */

type Executive = {
  _id: string;
  name: string;
  surname?: string;
};

type BarcodeItem = {
  barCode: string;
  price: string;
};

type Props = {
  open: boolean;
  mode: "view" | "edit" | "create";
  loading?: boolean;
  form: any;
  setForm: (updater: (prev: any) => any) => void;
  onClose: () => void;
  onSave: () => void;
  executives: Executive[];
  onExecutiveSearch: (q: string) => void;
};

/* ================= CONSTANTS ================= */

const CATEGORIES = [
  "hypermarket",
  "supermarket",
  "grocery",
  "pasons-group",
  "new-era",
  "baniyas-spike",
  "day-to-day-international",
];

const TRN_OPTIONS = ["100614900700003", "nil"];

/* ================= COMPONENT ================= */

export default function CustomerModal({
  open,
  mode,
  loading = false,
  form,
  setForm,
  onClose,
  onSave,
  executives,
  onExecutiveSearch,
}: Props) {
  if (!open) return null;

  const isView = mode === "view";
  const safeExecutives = Array.isArray(executives) ? executives : [];

  /* ================= HELPERS ================= */

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const items: BarcodeItem[] = Array.isArray(form.items) ? form.items : [];

  /* ================= BARCODE HANDLERS ================= */

  const addBarcode = () => {
    update("items", [...items, { barCode: "", price: "" }]);
  };

  const updateBarcode = (
    index: number,
    key: keyof BarcodeItem,
    value: string
  ) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    update("items", next);
  };

  const removeBarcode = (index: number) => {
    const next = [...items];
    next.splice(index, 1);
    update("items", next);
  };

  /* ================= RENDER ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
      <div
        className="
          w-full md:max-w-xl
          bg-white
          rounded-t-2xl md:rounded-2xl
          shadow-lg
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-base md:text-lg font-semibold">
            {mode === "create"
              ? "Create Customer"
              : mode === "edit"
              ? "Edit Customer"
              : "Customer Details"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <Input
            label="Company Name"
            value={form.company}
            disabled={isView}
            onChange={(v) => update("company", v)}
          />

          <Input
            label="Phone"
            value={form.phone}
            disabled={isView}
            onChange={(v) => update("phone", v)}
          />

          <Input
            label="Location"
            value={form.location}
            disabled={isView}
            onChange={(v) => update("location", v)}
          />

          <Select
            label="Category"
            value={form.category}
            disabled={isView}
            options={CATEGORIES}
            onChange={(v) => update("category", v)}
          />

          <Select
            label="Company TRN"
            value={form.companyTrnNumber}
            disabled={isView}
            options={TRN_OPTIONS}
            onChange={(v) => update("companyTrnNumber", v)}
          />

          {/* ================= EXECUTIVE ================= */}
<div>
  <label className="text-xs font-medium text-gray-600">
    Executive
  </label>

  {!isView && (
    <input
      placeholder="Search executive..."
      onChange={(e) => onExecutiveSearch(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
    />
  )}

  <select
    value={form.executive?._id || ""}
    disabled={isView}
    onChange={(e) =>
      update(
        "executive",
        safeExecutives.find((ex) => ex._id === e.target.value)
      )
    }
    className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
  >
    <option value="">Select Executive</option>

    {safeExecutives.map((e) => (
      <option key={e._id} value={e._id}>
        {e.name} {e.surname || ""}
      </option>
    ))}
  </select>
</div>

          {/* ================= BARCODE + PRICE ================= */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Barcodes & Prices
            </label>

            <div className="space-y-3 mt-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Barcode"
                    value={item.barCode}
                    disabled={isView}
                    onChange={(e) =>
                      updateBarcode(i, "barCode", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />

                  <input
                    placeholder="Price"
                    value={item.price}
                    disabled={isView}
                    onChange={(e) =>
                      updateBarcode(i, "price", e.target.value)
                    }
                    className="w-24 px-3 py-2 border rounded-lg text-sm"
                  />

                  {!isView && (
                    <button
                      onClick={() => removeBarcode(i)}
                      className="p-2 rounded-lg bg-red-50 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!isView && (
              <button
                onClick={addBarcode}
                className="mt-3 flex items-center gap-2 text-sm text-blue-600"
              >
                <Plus size={14} /> Add Barcode
              </button>
            )}
          </div>

          <Select
            label="Status"
            value={form.status || "active"}
            disabled={isView}
            options={["active", "inactive"]}
            onChange={(v) => update("status", v)}
          />
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-5 py-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border text-sm"
          >
            Close
          </button>

          {!isView && (
            <button
              onClick={onSave}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create"
                : "Update"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUTS ================= */

const Input = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <input
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
    />
  </div>
);

const Select = ({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value?: string;
  options: any[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <div>
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <select
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
    >
      <option value="">Select</option>
      {options.map((o) =>
        typeof o === "string" ? (
          <option key={o} value={o}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  </div>
);
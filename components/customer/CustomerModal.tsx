"use client";

import { X, Plus, Trash2 } from "lucide-react";
import FormSelect from "../ui/FormSelect";
import FormInput from "../ui/FormInput";

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

const PAYMENT_MODES = ["cash", "credit 30 days", "bill to bill"];

const BARCODE_OPTIONS = [
  "9656222255661",
  "9656332255662",
  "9656442255663",
  "9656552255664",
  "9656662255665",
  "9656772255666",
  "9656112255660",
];

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
  const items: BarcodeItem[] = Array.isArray(form.items) ? form.items : [];

  const update = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  /* ================= BARCODE ================= */

  const addBarcode = () =>
    update("items", [...items, { barCode: "", price: "" }]);

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

  /* ================= VIEW MODE ================= */

  if (isView) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
        <div className="w-full md:max-w-xl bg-white rounded-t-2xl md:rounded-2xl shadow-lg">
          <div className="flex justify-between items-center px-5 py-4 border-b">
            <h2 className="text-lg font-semibold">Customer Details</h2>
            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-3 text-sm">
            <ViewRow label="Company" value={form.company} />
            <ViewRow label="Phone" value={form.phone} />
            <ViewRow label="Location" value={form.location} />
            <ViewRow label="Category" value={form.category} />
            <ViewRow label="Payment Mode" value={form.paymentMode} />
            <ViewRow label="Company TRN" value={form.companyTrnNumber} />
            <ViewRow
              label="Executive"
              value={
                safeExecutives.find((e) => e._id === form.executive)
                  ? safeExecutives.find((e) => e._id === form.executive)?.name
                  : "-"
              }
            />

            <div>
              <p className="font-medium text-gray-600">Barcodes & Prices</p>
              <ul className="mt-2 space-y-1">
                {items.map((i, idx) => (
                  <li key={idx}>
                    {i.barCode} — ₹{i.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= CREATE / EDIT MODE ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
      <div className="w-full md:max-w-xl bg-white rounded-t-2xl md:rounded-2xl shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Create Customer" : "Edit Customer"}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <FormInput label="Company Name" value={form.company} onChange={(v) => update("company", v)} />
          <FormInput label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
          <FormInput label="Location" value={form.location} onChange={(v) => update("location", v)} />

          <FormSelect label="Category" value={form.category} options={CATEGORIES} onChange={(v) => update("category", v)} />
          <FormSelect label="Payment Mode" value={form.paymentMode} options={PAYMENT_MODES} onChange={(v) => update("paymentMode", v)} />
          <FormSelect label="Company TRN" value={form.companyTrnNumber} options={TRN_OPTIONS} onChange={(v) => update("companyTrnNumber", v)} />

          {/* Executive */}
          <div>
            <label className="text-xs font-medium text-gray-600">Executive</label>
            <input
              placeholder="Search executive..."
              onChange={(e) => onExecutiveSearch(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            />
            <select
              value={form.executive || ""}
              onChange={(e) => update("executive", e.target.value)}
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

          {/* ================= BARCODE SELECT ================= */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Barcodes & Prices
            </label>

            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <select
                  value={item.barCode}
                  onChange={(e) =>
                    updateBarcode(i, "barCode", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Select Barcode</option>
                  {BARCODE_OPTIONS.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>

                <input
                  value={item.price}
                  onChange={(e) =>
                    updateBarcode(i, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="w-24 px-3 py-2 border rounded-lg text-sm"
                />

                <button
                  onClick={() => removeBarcode(i)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={addBarcode}
              className="mt-3 text-sm text-blue-600 flex items-center gap-2"
            >
              <Plus size={14} /> Add Barcode
            </button>
          </div>

          <FormSelect
            label="Status"
            value={form.status || "active"}
            options={["active", "inactive"]}
            onChange={(v) => update("status", v)}
          />
        </div>

        <div className="p-4 border-t flex gap-3">
          <button className="flex-1 border rounded-lg" onClick={onClose}>
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

/* ================= VIEW ROW ================= */

const ViewRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);
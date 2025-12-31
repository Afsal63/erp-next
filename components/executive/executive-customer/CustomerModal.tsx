"use client";

import { X, Plus, Trash2 } from "lucide-react";
import FormSelect from "@/components/ui/FormSelect";
import FormInput from "@/components/ui/FormInput";
import { BARCODE_OPTIONS } from "@/constants/barcodes";

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

const PAYMENT_MODES = ["cash", "credit 30 days", "bill to bill"];

const STATES = [
  "Ajman",
  "Rasal Kaim",
  "Fujaira",
  "Dubai",
  "Abudabi",
  "Sharja",
  "Alain",
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
  const items: BarcodeItem[] = Array.isArray(form.items) ? form.items : [];

  const update = (key: string, value: any) =>
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));

  /* ================= CATEGORY CHANGE ================= */
  const handleCategoryChange = (value: string) => {
    setForm((prev: any) => ({
      ...prev,
      category: value,
      paymentMode: prev.paymentMode || "credit 30 days", // auto-set once
      country: "UAE",
    }));
  };

  /* ================= VIEW MODE ================= */

  if (isView) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
        <div className="w-full md:max-w-xl bg-white rounded-t-2xl md:rounded-2xl shadow-lg">
          <div className="flex justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-semibold">Customer Details</h2>
            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-3 text-sm">
            <ViewRow label="Company" value={form.company} />
            <ViewRow label="Phone" value={form.phone} />
            <ViewRow label="Location" value={form.location} />
            <ViewRow label="State" value={form.state} />
            <ViewRow label="Category" value={form.category} />
            <ViewRow label="Payment Mode" value={form.paymentMode} />
            <ViewRow label="Company TRN" value={form.companyTrnNumber} />
            <ViewRow label="Client TRN" value={form.clientTrnNumber} />
            <ViewRow label="Country" value="UAE" />
            <ViewRow label="Executive" value={form.executiveName || "-"} />

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
            <button onClick={onClose} className="w-full border rounded-lg py-2">
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
      <div className="w-full md:max-w-3xl bg-white rounded-t-2xl md:rounded-2xl shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Create Customer" : "Edit Customer"}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <div className="p-5 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Company Name"
              value={form.company || ""}
              onChange={(v) => update("company", v)}
            />
            <FormInput
              label="Phone"
              value={form.phone || ""}
              onChange={(v) => update("phone", v)}
            />
            <FormInput
              label="Address"
              value={form.address || ""}
              onChange={(v) => update("address", v)}
            />
            <FormInput
              label="Location"
              value={form.location || ""}
              onChange={(v) => update("location", v)}
            />

            <FormSelect
              label="State"
              value={form.state || ""}
              options={STATES}
              onChange={(v) => update("state", v)}
            />

            <FormSelect
              label="Category"
              value={form.category || ""}
              options={CATEGORIES}
              onChange={handleCategoryChange}
            />

            <FormSelect
              label="Payment Mode"
              value={form.paymentMode || ""}
              options={PAYMENT_MODES}
              onChange={(v) => update("paymentMode", v)}
            />

            <FormSelect
              label="Company TRN"
              value={form.companyTrnNumber || ""}
              options={TRN_OPTIONS}
              onChange={(v) => update("companyTrnNumber", v)}
            />

            <FormInput
              label="Client TRN Number"
              value={form.clientTrnNumber || ""}
              onChange={(v) => update("clientTrnNumber", v)}
            />
            <FormInput
              label="Customer Discount"
              value={form.customerDiscount || ""}
              onChange={(v) => update("customerDiscount", v)}
            />
          </div>

          {/* ================= EXECUTIVE (READ ONLY) ================= */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Executive
            </label>

            <input
              value={form.executiveName || ""}
              disabled
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* ================= BARCODE ================= */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Barcodes & Prices
            </label>

            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <select
                  value={item.barCode}
                  onChange={(e) =>
                    update(
                      "items",
                      items.map((it, idx) =>
                        idx === i ? { ...it, barCode: e.target.value } : it
                      )
                    )
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
                    update(
                      "items",
                      items.map((it, idx) =>
                        idx === i ? { ...it, price: e.target.value } : it
                      )
                    )
                  }
                  placeholder="Price"
                  className="w-24 px-3 py-2 border rounded-lg text-sm"
                />

                <button
                  onClick={() =>
                    update(
                      "items",
                      items.filter((_, idx) => idx !== i)
                    )
                  }
                  className="p-2 bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                update("items", [...items, { barCode: "", price: "" }])
              }
              className="mt-3 text-sm text-blue-600 flex items-center gap-2"
            >
              <Plus size={14} /> Add Barcode
            </button>
          </div>
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

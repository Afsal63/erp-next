"use client";

type Props = {
  open: boolean;
  title?: string;
  value: string;
  loading?: boolean;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function EditModal({
  open,
  title = "Edit Barcode",
  value,
  loading,
  onChange,
  onCancel,
  onSave,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onSave}
            className="
              px-4 py-2 rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
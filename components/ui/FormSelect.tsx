"use client";

type Option =
  | string
  | {
      value: string;
      label: string;
    };

type FormSelectProps = {
  label: string;
  value?: string;
  options: Option[];
  onChange: (v: string) => void;
  disabled?: boolean;
};

export default function FormSelect({
  label,
  value = "",
  options,
  onChange,
  disabled = false,
}: FormSelectProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full mt-1 px-3 py-2
          border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100
        "
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
}
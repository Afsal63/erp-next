"use client";

type FormInputProps = {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "number" | "date" | "email" | "tel";
};

export default function FormInput({
  label,
  value = "",
  onChange,
  disabled = false,
  placeholder = "",
  type = "text", // ✅ default stays text
}: FormInputProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        type={type}                
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full mt-1 px-3 py-2
          border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100
        "
      />
    </div>
  );
}
type RowProps = {
  label: string;
  value?: string | number;
  muted?: boolean;
  badge?: boolean;
};

export default function Row({
  label,
  value,
  muted = true,
  badge = false,
}: RowProps) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className={muted ? "text-gray-500" : ""}>
        {label} :
      </span>

      {badge ? (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {value || "-"}
        </span>
      ) : (
        <span className="font-medium">
          {value ?? "-"}
        </span>
      )}
    </div>
  );
}
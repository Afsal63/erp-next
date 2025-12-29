type TotalRowProps = {
  label: string;
  value: string | number;
  bold?: boolean;
  highlight?: "discount";
};

export default function TotalRow({
  label,
  value,
  bold = false,
  highlight,
}: TotalRowProps) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "font-semibold text-base border-t pt-2 mt-2" : ""
      }`}
    >
      <span>{label} :</span>

      <span
        className={`${
          highlight === "discount"
            ? "text-red-600 font-medium"
            : ""
        }`}
      >
        {typeof value === "number"
          ? value.toFixed(2)
          : value}
      </span>
    </div>
  );
}
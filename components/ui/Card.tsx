import React from "react";

type CardProps = {
  title?: string;
  value?: string | number;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({
  title,
  value,
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border
        p-4 transition hover:shadow-md
        ${className}
      `}
    >
      {title && (
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      )}

      {value !== undefined && (
        <p className="text-2xl font-bold mt-1">{value}</p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
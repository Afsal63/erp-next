import React from "react";
import clsx from "clsx";

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
      className={clsx(
        "bg-white rounded-2xl border border-gray-100",
        "p-4 sm:p-5",
        "shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      {title && (
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          {title}
        </p>
      )}

      {value !== undefined && (
        <p className="text-xl sm:text-2xl font-semibold mt-1">
          {value}
        </p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
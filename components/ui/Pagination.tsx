"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      {/* Info */}
      <p className="text-sm text-gray-500">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="
            flex items-center gap-1 px-3 py-1.5 rounded-lg
            border text-sm
            hover:bg-gray-100 transition
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="
            flex items-center gap-1 px-3 py-1.5 rounded-lg
            border text-sm
            hover:bg-gray-100 transition
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
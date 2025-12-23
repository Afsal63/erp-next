"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

type Props = {
  onShow: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ActionDropdown({
  onShow,
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="
          p-2 rounded-lg
          hover:bg-gray-100
          transition
        "
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-40
            bg-white border rounded-xl
            shadow-lg z-50
          "
        >
          <button
            onClick={() => {
              onShow();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <Eye size={14} /> Show
          </button>

          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
          >
            <Pencil size={14} /> Edit
          </button>

          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
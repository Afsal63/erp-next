"use client";

import { useState, useRef, useEffect } from "react";
import {
  Eye,
  Pencil,
  Lock,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

type Props = {
  onShow?: () => void;
  onUpdateRole?: () => void;
  onUpdatePassword?: () => void;
  onDelete?: () => void;
};

export default function UserDropdown({
  onShow,
  onUpdateRole,
  onUpdatePassword,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
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
      {/* TOGGLE */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48
            bg-white border rounded-xl shadow-lg
            z-50 overflow-hidden
          "
        >
          <DropdownItem
            icon={<Eye size={16} />}
            label="Show"
            onClick={() => {
              setOpen(false);
              onShow?.();
            }}
          />

          <DropdownItem
            icon={<Pencil size={16} />}
            label="Update Role"
            onClick={() => {
              setOpen(false);
              onUpdateRole?.();
            }}
          />

          <DropdownItem
            icon={<Lock size={16} />}
            label="Update Password"
            onClick={() => {
              setOpen(false);
              onUpdatePassword?.();
            }}
          />

          <div className="border-t" />

          <DropdownItem
            icon={<Trash2 size={16} />}
            label="Delete"
            danger
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ================= ITEM ================= */

const DropdownItem = ({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-2 text-sm
      ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}
      transition
    `}
  >
    {icon}
    {label}
  </button>
);
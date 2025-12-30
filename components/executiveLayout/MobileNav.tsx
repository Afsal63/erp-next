"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import useLayout from "./useLayout";

type Props = {
  open: boolean;
  onClose: () => void;
};



export default function MobileNav({ open, onClose }: Props) {
  const {menu} = useLayout()
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Slide Menu */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 animate-slideIn">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="font-bold text-lg">ERP Admin</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {menu.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                  ${active ? "bg-slate-800" : "hover:bg-slate-800"}`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useLayout from "./useLayout";

export default function Sidebar() {
  const { menu } = useLayout();
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden md:flex
        fixed top-0 left-0
        h-screen w-64
        bg-slate-900 text-white
        flex-col
        z-50
      "
    >
      {/* Logo */}
      <div className="p-5 border-b bg-white">
        <Image
          src="/images/logo/logo.png"
          alt="ERP Logo"
          width={140}
          height={70}
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const active = pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-3
                px-4 py-2 rounded-lg
                transition
                ${active ? "bg-slate-800" : "hover:bg-slate-800"}
              `}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
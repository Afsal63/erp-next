"use client";

import { LogOut, User, Menu } from "lucide-react";
import MobileNav from "./MobileNav";
import useLayout from "./useLayout";
import { getUser } from "@/lib/auth";
import { useEffect } from "react";

export default function Topbar() {
  const {
    setMobileOpen,
    setProfileOpen,
    profileOpen,
    mobileOpen,
    dropdownRef,
    handleLogout,
    user,
    setUser,
  } = useLayout();

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <>
      {/* Topbar */}
      <header
        className="
          fixed top-0
          left-0 md:left-64
          right-0
          h-14
          bg-slate-900
          border-b
          flex items-center
          px-4
          justify-between
          text-white
          z-40
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>

          <h1 className="font-semibold">ERP Dashboard</h1>
        </div>

        {/* RIGHT - Admin Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
          >
            <User size={16} />
            <span className="text-sm">Admin</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-lg border z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">
                  {user?.name} {user?.surname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {user?.role && (
                  <p className="mt-1 text-[11px] text-blue-600 font-medium uppercase">
                    {user.role}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex items-center gap-2
                  px-4 py-2
                  text-sm
                  text-red-600
                  hover:bg-gray-100
                  rounded-b-xl
                "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content hiding under fixed topbar */}
      <div className="h-14" />

      {/* Mobile Navigation */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

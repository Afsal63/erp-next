"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isExecutive } from "@/lib/auth";

import Sidebar from "@/components/executiveLayout/Sidebar";
import Topbar from "@/components/executiveLayout/Topbar";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isExecutive()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <>
      {/* Fixed Sidebar (Desktop only) */}
      <Sidebar />

      {/* Page Wrapper */}
      <div className="min-h-screen md:ml-64 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <main className="flex-1 pt-14 p-4 md:p-6 bg-gray-100 overflow-x-hidden">
          {children}
        </main>
      </div>
    </>
  );
}

"use client";

import Sidebar from "@/components/executive/executiveLayout/Sidebar";
import Topbar from "@/components/executive/executiveLayout/Topbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["executive"]}>
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
    </ProtectedRoute>
  );
}

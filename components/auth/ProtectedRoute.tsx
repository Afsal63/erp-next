"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    if (!auth || !auth.isLoggedIn) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(auth.role)) {
      if (auth.role === "super admin") {
        router.replace("/dashboard");
      } else if (auth.role === "executive") {
        router.replace("/executive-customers");
      } else {
        router.replace("/login");
      }
      return;
    }

    setIsAuthorized(true);
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}

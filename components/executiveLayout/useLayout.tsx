import { useEffect, useRef, useState } from "react";
import AuthService from "@/services/AuthService";
import { Boxes, FileText, LayoutDashboard, UserCog, Users,FileChartColumnIncreasing } from "lucide-react";
import { UserType } from "@/types/user";

const useLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
   const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    // { name: "Inventory", path: "/inventory", icon: Boxes },
    { name: "Customers", path: "/executive-customers", icon: Users },
    { name: "Sale Orders", path: "executive-saleOrder", icon: FileText },
    // { name: "Sals Report", path: "/sales-report", icon: FileChartColumnIncreasing },
    // { name: "Employees", path: "/employees", icon: UserCog },
    // { name: "Users", path: "/users", icon: Users },
  ];

  const handleLogout = () => {
    setProfileOpen(false);
    AuthService.logout();
  };

  return {
    menu,
    profileOpen,
    setProfileOpen,
    mobileOpen,
    setMobileOpen,
    dropdownRef,
    handleLogout,
    user,
    setUser
  };
};

export default useLayout;
import { Boxes, FileText, LayoutDashboard, UserCog, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const useLayout =()=>{
     const [profileOpen, setProfileOpen] = useState(false);
      const [mobileOpen, setMobileOpen] = useState(false);


  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 outside click handler
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
  { name: "Inventory", path: "/inventory", icon: Boxes },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Sale Orders", path: "/sale-order", icon: FileText },
  { name: "Employees", path: "/employees", icon: UserCog },
  { name: "Users", path: "/users", icon: Users },
];

return{menu, profileOpen, setProfileOpen, mobileOpen, setMobileOpen, dropdownRef}
}

export default useLayout
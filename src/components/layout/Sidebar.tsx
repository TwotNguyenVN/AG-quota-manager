"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, Settings, Rocket, Grid2X2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Rocket },
  { name: "Accounts", href: "/accounts", icon: Grid2X2 },
  { name: "History", href: "/history", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center h-full px-4 relative z-50">
      <div className="flex flex-col items-center bg-[#1a1f2e]/80 backdrop-blur-xl border border-[#2a3041] rounded-[24px] py-4 shadow-xl">
        <div className="mb-6 flex justify-center w-full">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] mx-1"></div>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        </div>
        
        <nav className="flex flex-col items-center space-y-4 px-2 w-full">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className={cn(
                  "group flex items-center justify-center rounded-2xl w-10 h-10 transition-all duration-200",
                  isActive
                    ? "bg-[#2563eb] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "text-[#64748b] hover:bg-[#1e293b] hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-[#64748b] group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

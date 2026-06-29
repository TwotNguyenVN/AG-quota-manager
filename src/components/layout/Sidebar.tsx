"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, Settings, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: Users },
  { name: "History", href: "/history", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#161a23] text-zinc-300 border-r border-[#2a3041] shadow-2xl relative z-10">
      <div className="flex h-16 items-center px-6 border-b border-[#2a3041]">
        <Database className="h-6 w-6 text-blue-500 mr-3" />
        <span className="text-lg font-bold tracking-tight text-white">AG Quota</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2563eb]/10 text-[#60a5fa] ring-1 ring-[#2563eb]/20"
                  : "text-[#64748b] hover:bg-[#1e293b] hover:text-zinc-200"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-[#3b82f6]" : "text-[#64748b] group-hover:text-zinc-300"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#2a3041] text-[11px] text-[#64748b] flex flex-col items-center">
        <div className="mb-3 flex justify-center gap-1.5 w-full">
          <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
        </div>
        Local-first Quota Manager
      </div>
    </div>
  );
}

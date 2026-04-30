"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Mail,
  FileText,
  AlertTriangle,
  FileSignature,
  BarChart3,
  Files,
  Users,
  User,
  LogOut,
  Gift,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  user: {
    email: string;
    nome: string;
    piano: string;
  };
  onSignOut: () => void;
}

const templateItems = [
  { href: "/dashboard/email", label: "Email", icon: Mail },
  { href: "/dashboard/preventivo", label: "Preventivo", icon: FileText },
  { href: "/dashboard/reclamo", label: "Reclamo", icon: AlertTriangle },
  { href: "/dashboard/contratto", label: "Contratto", icon: FileSignature },
  { href: "/dashboard/report", label: "Report Cliente", icon: BarChart3 },
];

const mainItems = [
  { href: "/dashboard/documenti", label: "I miei documenti", icon: Files },
  { href: "/dashboard/referral", label: "Invita amici", icon: Gift },
];

const accountItems = [
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/account", label: "Account", icon: User },
];

export function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <>
      <div className="p-5 pb-4">
        <Link href="/dashboard" className="text-white text-lg font-bold">
          ScriviAI
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 py-2 text-xs font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
          Template
        </div>
        {templateItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "sidebar-item",
              isActive(item.href) && "sidebar-item-active"
            )}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="h-px bg-[rgba(255,255,255,0.08)] my-3" />

        {mainItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "sidebar-item",
              isActive(item.href) && "sidebar-item-active"
            )}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}

        {user.piano === "team" && (
          <>
            <div className="h-px bg-[rgba(255,255,255,0.08)] my-3" />
            {accountItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive(item.href) && "sidebar-item-active"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-[rgba(255,255,255,0.08)]">
        <div className="text-xs text-[rgba(255,255,255,0.4)] truncate mb-2">
          {user.email}
        </div>
        {user.piano !== "free" && (
          <div className="mb-3">
            <span
              className={cn(
                "inline-block px-2 py-0.5 rounded text-xs font-medium",
                user.piano === "pro" && "bg-[#16A34A] text-white",
                user.piano === "team" && "bg-[#3B82F6] text-white"
              )}
            >
              {user.piano === "team" ? "Team" : "Pro"}
            </span>
          </div>
        )}
        <button
          onClick={() => {
            setIsOpen(false);
            onSignOut();
          }}
          className="flex items-center gap-2 text-[rgba(255,255,255,0.65)] text-sm hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Esci</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-[#E5E7EB] rounded-md shadow-sm"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:bg-[#111827]">
        <SidebarContent />
      </aside>

      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-60 bg-[#111827] z-50 flex flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
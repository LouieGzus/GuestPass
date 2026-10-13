"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
  Image as ImageIcon,
  ChartNoAxesCombined,
  Mail,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { label: "Dashboard", href: "/protected", icon: LayoutDashboard, active: true },
  { label: "Events", href: "#events", icon: CalendarDays },
  { label: "Guests", href: "#guests", icon: Users },
  { label: "Invitations", href: "#invitations", icon: Mail },
  { label: "Check-in", href: "#check-in", icon: ClipboardCheck },
  { label: "Photo Review", href: "#photo-review", icon: ImageIcon },
  { label: "Reports", href: "#reports", icon: ChartNoAxesCombined },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-stone-100">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col border-r border-white/[0.08] bg-[#101012] transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[88px] items-center border-b border-white/[0.08] px-5">
          <Link
            href="/protected"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d7b56d]/30 bg-[#d7b56d]/[0.08]">
              <img
                src="/guestpass-logo.png"
                alt="GuestPass emblem"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[19px] font-semibold tracking-wide text-[#e8c982]">
                GuestPass
              </div>
              <div className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-stone-500">
                Event access platform
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-2 text-stone-400 hover:bg-white/5 md:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-600">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={item.active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] transition ${
                    item.active
                      ? "border border-[#d7b56d]/20 bg-[#d7b56d]/[0.10] font-medium text-[#e8c982]"
                      : "text-stone-400 hover:bg-white/[0.04] hover:text-stone-100"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d7b56d]" />
                  )}
                  {!item.active && (
                    <span className="ml-auto text-[9px] text-stone-600">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="mb-3 rounded-xl border border-[#d7b56d]/15 bg-gradient-to-br from-[#d7b56d]/[0.09] to-transparent p-4">
            <div className="mb-2 flex items-center gap-2 text-[#e8c982]">
              <ShieldCheck size={16} />
              <span className="text-xs font-medium">Secure by design</span>
            </div>
            <p className="text-[11px] leading-5 text-stone-500">
              Guest identity and event access belong in one secure workspace.
            </p>
          </div>
          <Link
            href="#settings"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-stone-400 hover:bg-white/[0.04] hover:text-white"
          >
            <Settings size={17} />
            Settings
            <span className="ml-auto text-[9px] text-stone-600">Soon</span>
          </Link>
          <div className="mt-3 border-t border-white/[0.08] pt-4 text-[10px] text-stone-600">
            <div>GUESTPASS · MVP</div>
            <div className="mt-1">A Noskar Enterprise product</div>
          </div>
        </div>
      </aside>

      <div className="min-h-screen md:pl-[258px]">
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-white/[0.08] bg-[#0b0b0d]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-white/10 p-2 text-stone-300 hover:bg-white/5 md:hidden"
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-stone-600">
                Workspace
              </p>
              <p className="mt-0.5 text-sm font-medium text-stone-200">
                Event management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-[11px] text-stone-500 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Workspace connected
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <LogoutButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

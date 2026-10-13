"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ModerationToast from "@/components/moderation/ModerationToast";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = pathname === "/comments" ? "Comment Management" : pathname === "/rules" ? "Moderation Rules" : "Comment Moderation";
  const tab = pathname === "/comments" ? "Comments" : pathname === "/rules" ? "Rules" : "Overview";
  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar currentTab={tab} />
        <section className="min-w-0 flex-1">
          <Header title={title} tab={tab} />
          {children}
        </section>
      </div>
      <ModerationToast />
    </main>
  );
}

"use client";

import Link from "next/link";
import { navigationItems } from "@/constants/navigation";
import { PRODUCT_NAME, PRODUCT_SUBTITLE } from "@/constants/moderation";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function Sidebar({ currentTab }: { currentTab: string }) {
  const { counts } = useModerationContext();
  return (
    <aside className="hidden w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-7 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">Y</div>
        <div><h1 className="text-base font-bold text-slate-900">{PRODUCT_NAME}</h1><p className="text-xs text-slate-400">{PRODUCT_SUBTITLE}</p></div>
      </div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${currentTab === item.label ? "bg-red-50 text-red-600" : "text-slate-500 hover:bg-red-50 hover:text-red-600"}`}>
            <span className="w-5 text-center">{item.icon}</span>{item.label}
            {item.label === "Comments" && <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">{counts.pending}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-red-100 bg-red-50 p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">✦</div>
        <p className="text-sm font-bold text-slate-800">Keep your community safe</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Automated moderation helps you focus on creating great content.</p>
      </div>
    </aside>
  );
}

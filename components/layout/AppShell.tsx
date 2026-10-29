"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ModerationToast from "@/components/moderation/ModerationToast";

function getPageMeta(pathname: string) {
	if (pathname === "/comments")
		return { title: "Comment Management", tab: "Comments" };
	if (pathname === "/rules") return { title: "Moderation Rules", tab: "Rules" };
	if (pathname === "/video") return { title: "Video Library", tab: "Videos" };
	if (pathname.startsWith("/video/"))
		return { title: "Video Details", tab: "Videos" };
	return { title: "Overview", tab: "Overview" };
}

export default function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	if (pathname === "/masuk" || pathname === "/daftar") return <>{children}</>;
	const { title, tab } = getPageMeta(pathname);

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

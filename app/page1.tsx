// "use client";

// import { useMemo, useState } from "react";

// type CommentStatus = "Blocked" | "Pending" | "Allowed";

// type Comment = {
// 	id: number;
// 	name: string;
// 	avatar: string;
// 	comment: string;
// 	time: string;
// 	status: CommentStatus;
// 	reason: string;
// };

// const initialComments: Comment[] = [
// 	{
// 		id: 1,
// 		name: "Crypto Promo",
// 		avatar: "C",
// 		comment: "FREE GIFT! Claim your reward at bit.ly/free...",
// 		time: "2 minutes ago",
// 		status: "Blocked",
// 		reason: "Suspicious link",
// 	},
// 	{
// 		id: 2,
// 		name: "Alex Morgan",
// 		avatar: "A",
// 		comment: "Great explanation! This really helped me.",
// 		time: "5 minutes ago",
// 		status: "Allowed",
// 		reason: "No violations",
// 	},
// 	{
// 		id: 3,
// 		name: "Gaming World",
// 		avatar: "G",
// 		comment: "Subscribe to my channel!!! SUB4SUB!!!",
// 		time: "8 minutes ago",
// 		status: "Blocked",
// 		reason: "Spam detected",
// 	},
// 	{
// 		id: 4,
// 		name: "Sarah Lee",
// 		avatar: "S",
// 		comment: "Could you explain the second step again?",
// 		time: "12 minutes ago",
// 		status: "Pending",
// 		reason: "Needs review",
// 	},
// 	{
// 		id: 5,
// 		name: "Unknown User",
// 		avatar: "U",
// 		comment: "You are an idiot. This video is trash.",
// 		time: "18 minutes ago",
// 		status: "Blocked",
// 		reason: "Inappropriate language",
// 	},
// ];

// const initialRules = [
// 	{
// 		id: "spam",
// 		title: "Spam detection",
// 		description: "Detect repetitive comments and promotional spam.",
// 		enabled: true,
// 	},
// 	{
// 		id: "links",
// 		title: "Suspicious links",
// 		description: "Flag comments containing suspicious URLs.",
// 		enabled: true,
// 	},
// 	{
// 		id: "words",
// 		title: "Blocked keywords",
// 		description: "Block comments containing restricted words.",
// 		enabled: true,
// 	},
// 	{
// 		id: "review",
// 		title: "Manual review",
// 		description: "Send uncertain comments for manual moderation.",
// 		enabled: true,
// 	},
// ];

// const blockedWords = ["idiot", "stupid", "scam"];

// const statusStyles: Record<CommentStatus, string> = {
// 	Blocked: "bg-red-50 text-red-600 border-red-100",
// 	Pending: "bg-amber-50 text-amber-600 border-amber-100",
// 	Allowed: "bg-emerald-50 text-emerald-600 border-emerald-100",
// };

// export default function Page() {
// 	const [comments, setComments] = useState(initialComments);
// 	const [rules, setRules] = useState(initialRules);
// 	const [activeFilter, setActiveFilter] = useState("All");
// 	const [search, setSearch] = useState("");
// 	const [keywords, setKeywords] = useState(blockedWords.join(", "));
// 	const [keywordInput, setKeywordInput] = useState("");
// 	const [notice, setNotice] = useState("");
// 	const [scanning, setScanning] = useState(false);
// 	const [activeTab, setActiveTab] = useState("Overview");

// 	const blockedCount = comments.filter(
// 		(comment) => comment.status === "Blocked",
// 	).length;

// 	const pendingCount = comments.filter(
// 		(comment) => comment.status === "Pending",
// 	).length;

// 	const allowedCount = comments.filter(
// 		(comment) => comment.status === "Allowed",
// 	).length;

// 	const filteredComments = useMemo(() => {
// 		return comments.filter((comment) => {
// 			const matchesStatus =
// 				activeFilter === "All" || comment.status === activeFilter;

// 			const matchesSearch =
// 				comment.name.toLowerCase().includes(search.toLowerCase()) ||
// 				comment.comment.toLowerCase().includes(search.toLowerCase());

// 			return matchesStatus && matchesSearch;
// 		});
// 	}, [comments, activeFilter, search]);

// 	function toggleRule(id: string) {
// 		setRules((current) =>
// 			current.map((rule) =>
// 				rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
// 			),
// 		);
// 	}

// 	function updateComment(id: number, status: CommentStatus) {
// 		setComments((current) =>
// 			current.map((comment) =>
// 				comment.id === id
// 					? {
// 							...comment,
// 							status,
// 							reason:
// 								status === "Blocked"
// 									? "Blocked manually"
// 									: status === "Allowed"
// 										? "Approved manually"
// 										: "Needs review",
// 						}
// 					: comment,
// 			),
// 		);

// 		setNotice(
// 			status === "Blocked"
// 				? "Comment blocked successfully."
// 				: status === "Allowed"
// 					? "Comment approved successfully."
// 					: "Comment moved to pending review.",
// 		);
// 	}

// 	function runScan() {
// 		if (scanning) return;

// 		setScanning(true);
// 		setNotice("Scanning comments...");

// 		window.setTimeout(() => {
// 			const activeRules = rules.filter((rule) => rule.enabled);
// 			const hasKeywordRule = activeRules.some((rule) => rule.id === "words");
// 			const hasSpamRule = activeRules.some((rule) => rule.id === "spam");
// 			const hasLinkRule = activeRules.some((rule) => rule.id === "links");

// 			const customWords = keywords
// 				.split(",")
// 				.map((word) => word.trim().toLowerCase())
// 				.filter(Boolean);

// 			setComments((current) =>
// 				current.map((comment) => {
// 					if (comment.status === "Blocked") return comment;

// 					const text = comment.comment.toLowerCase();

// 					const containsKeyword =
// 						hasKeywordRule && customWords.some((word) => text.includes(word));

// 					const containsLink =
// 						hasLinkRule && /https?:\/\/|bit\.ly|www\./i.test(text);

// 					const containsSpam =
// 						hasSpamRule &&
// 						/(sub4sub|free gift|subscribe to my channel)/i.test(text);

// 					if (containsKeyword || containsLink || containsSpam) {
// 						return {
// 							...comment,
// 							status: "Blocked",
// 							reason: containsKeyword
// 								? "Blocked keyword"
// 								: containsLink
// 									? "Suspicious link"
// 									: "Spam detected",
// 						};
// 					}

// 					return comment;
// 				}),
// 			);

// 			setScanning(false);
// 			setNotice("Scan complete. Moderation rules applied.");
// 		}, 1000);
// 	}

// 	function addKeyword() {
// 		const value = keywordInput.trim();

// 		if (!value) return;

// 		const current = keywords
// 			.split(",")
// 			.map((word) => word.trim())
// 			.filter(Boolean);

// 		if (current.some((word) => word.toLowerCase() === value.toLowerCase())) {
// 			setNotice("This keyword already exists.");
// 			return;
// 		}

// 		setKeywords([...current, value].join(", "));
// 		setKeywordInput("");
// 		setNotice(`Keyword "${value}" added.`);
// 	}

// 	const tabs = ["Overview", "Comments", "Rules"];

// 	return (
// 		<main className="min-h-screen bg-[#f8f9fc] text-slate-800">
// 			<style jsx global>{`
// 				* {
// 					box-sizing: border-box;
// 				}

// 				body {
// 					margin: 0;
// 					font-family: Arial, Helvetica, sans-serif;
// 				}

// 				button,
// 				input {
// 					font: inherit;
// 				}

// 				button {
// 					cursor: pointer;
// 				}

// 				.soft-shadow {
// 					box-shadow: 0 8px 30px rgba(15, 23, 42, 0.035);
// 				}

// 				.sidebar-link {
// 					transition: all 0.2s ease;
// 				}

// 				.sidebar-link:hover {
// 					background: #fff1f2;
// 					color: #dc2626;
// 				}

// 				.switch {
// 					position: relative;
// 					display: inline-flex;
// 					width: 42px;
// 					height: 24px;
// 					flex-shrink: 0;
// 					align-items: center;
// 					border-radius: 999px;
// 					transition: background 0.2s;
// 				}

// 				.switch::after {
// 					content: "";
// 					position: absolute;
// 					left: 3px;
// 					width: 18px;
// 					height: 18px;
// 					border-radius: 50%;
// 					background: white;
// 					box-shadow: 0 1px 3px #0002;
// 					transition: transform 0.2s;
// 				}

// 				.switch[data-enabled="true"] {
// 					background: #dc2626;
// 				}

// 				.switch[data-enabled="false"] {
// 					background: #cbd5e1;
// 				}

// 				.switch[data-enabled="true"]::after {
// 					transform: translateX(18px);
// 				}
// 			`}</style>

// 			<div className="flex min-h-screen">
// 				{/* Sidebar */}
// 				<aside className="hidden w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-7 lg:flex">
// 					<div className="mb-10 flex items-center gap-3">
// 						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white">
// 							Y
// 						</div>

// 						<div>
// 							<h1 className="text-base font-bold text-slate-900">
// 								PilotyComment
// 							</h1>
// 							<p className="text-xs text-slate-400">YouTube Moderator</p>
// 						</div>
// 					</div>

// 					<p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
// 						Workspace
// 					</p>

// 					<nav className="space-y-1">
// 						{tabs.map((tab) => (
// 							<button
// 								key={tab}
// 								onClick={() => setActiveTab(tab)}
// 								className={`sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${
// 									activeTab === tab
// 										? "bg-red-50 text-red-600"
// 										: "text-slate-500"
// 								}`}>
// 								<span className="w-5 text-center">
// 									{tab === "Overview" ? "▦" : tab === "Comments" ? "☷" : "⚙"}
// 								</span>
// 								{tab}
// 								{tab === "Comments" && (
// 									<span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
// 										{pendingCount}
// 									</span>
// 								)}
// 							</button>
// 						))}
// 					</nav>

// 					<div className="mt-auto rounded-2xl border border-red-100 bg-red-50 p-4">
// 						<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
// 							✦
// 						</div>
// 						<p className="text-sm font-bold text-slate-800">
// 							Keep your community safe
// 						</p>
// 						<p className="mt-1 text-xs leading-5 text-slate-500">
// 							Automated moderation helps you focus on creating great content.
// 						</p>
// 					</div>
// 				</aside>

// 				{/* Main content */}
// 				<section className="min-w-0 flex-1">
// 					{/* Header */}
// 					<header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
// 						<div>
// 							<div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
// 								<span>Workspace</span>
// 								<span>/</span>
// 								<span className="text-red-600">{activeTab}</span>
// 							</div>
// 							<h2 className="text-xl font-bold tracking-tight text-slate-900">
// 								{activeTab === "Overview"
// 									? "Comment Moderation"
// 									: activeTab === "Comments"
// 										? "Comment Management"
// 										: "Moderation Rules"}
// 							</h2>
// 						</div>

// 						<div className="flex items-center gap-3">
// 							<div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 sm:flex">
// 								<span className="h-2 w-2 rounded-full bg-emerald-500" />
// 								Demo mode
// 							</div>

// 							<button
// 								onClick={runScan}
// 								disabled={scanning}
// 								className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:opacity-60">
// 								{scanning ? "Scanning..." : "↻ Run scan"}
// 							</button>
// 						</div>
// 					</header>

// 					<div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
// 						{/* Demo notice */}
// 						<div className="flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-5 sm:flex-row sm:items-center sm:p-6">
// 							<div className="flex gap-4">
// 								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-xl text-white">
// 									▶
// 								</div>
// 								<div>
// 									<div className="mb-1 flex flex-wrap items-center gap-2">
// 										<h3 className="font-bold text-slate-900">
// 											Automated comment protection
// 										</h3>
// 										<span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
// 											Demo
// 										</span>
// 									</div>
// 									<p className="max-w-2xl text-sm leading-6 text-slate-500">
// 										Monitor comments, detect spam, and apply moderation rules
// 										from one simple dashboard.
// 									</p>
// 								</div>
// 							</div>

// 							<div className="flex items-center gap-2 self-start rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-600 sm:self-center">
// 								<span className="h-2 w-2 rounded-full bg-emerald-500" />
// 								System ready
// 							</div>
// 						</div>

// 						{/* Stats */}
// 						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
// 							<StatCard
// 								label="Total comments"
// 								value={comments.length}
// 								detail="Comments in this demo"
// 								icon="☷"
// 								color="slate"
// 							/>
// 							<StatCard
// 								label="Blocked comments"
// 								value={blockedCount}
// 								detail="Flagged by moderation"
// 								icon="⊘"
// 								color="red"
// 							/>
// 							<StatCard
// 								label="Pending review"
// 								value={pendingCount}
// 								detail="Waiting for your action"
// 								icon="◷"
// 								color="amber"
// 							/>
// 							<StatCard
// 								label="Approved comments"
// 								value={allowedCount}
// 								detail="Passed moderation"
// 								icon="✓"
// 								color="green"
// 							/>
// 						</div>

// 						{/* Overview content */}
// 						{activeTab === "Overview" && (
// 							<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
// 								<section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
// 									<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
// 										<div>
// 											<h3 className="font-bold text-slate-900">
// 												Recent comments
// 											</h3>
// 											<p className="mt-1 text-xs text-slate-400">
// 												Review and manage incoming comments
// 											</p>
// 										</div>

// 										<button
// 											onClick={() => setActiveTab("Comments")}
// 											className="text-xs font-semibold text-red-600 hover:text-red-700">
// 											View all →
// 										</button>
// 									</div>

// 									<CommentTable
// 										comments={comments.slice(0, 4)}
// 										onUpdate={updateComment}
// 									/>
// 								</section>

// 								<section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
// 									<div className="mb-6 flex items-center justify-between">
// 										<div>
// 											<h3 className="font-bold text-slate-900">
// 												Moderation rules
// 											</h3>
// 											<p className="mt-1 text-xs text-slate-400">
// 												Configure your protection system
// 											</p>
// 										</div>
// 										<button
// 											onClick={() => setActiveTab("Rules")}
// 											className="text-xs font-semibold text-red-600">
// 											Configure →
// 										</button>
// 									</div>

// 									<div className="space-y-4">
// 										{rules.map((rule) => (
// 											<div
// 												key={rule.id}
// 												className="flex items-center justify-between gap-3">
// 												<div className="min-w-0">
// 													<p className="text-sm font-semibold text-slate-700">
// 														{rule.title}
// 													</p>
// 													<p className="mt-1 text-xs leading-5 text-slate-400">
// 														{rule.description}
// 													</p>
// 												</div>
// 												<button
// 													aria-label={`Toggle ${rule.title}`}
// 													aria-pressed={rule.enabled}
// 													onClick={() => toggleRule(rule.id)}
// 													className="switch"
// 													data-enabled={rule.enabled}
// 												/>
// 											</div>
// 										))}
// 									</div>

// 									<div className="mt-6 rounded-xl bg-slate-50 p-4">
// 										<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
// 											<span className="text-red-600">✦</span>
// 											How automation works
// 										</div>
// 										<p className="text-xs leading-5 text-slate-500">
// 											Enable rules, run a scan, and review the detected
// 											comments. The demo updates the comment statuses locally.
// 										</p>
// 									</div>
// 								</section>
// 							</div>
// 						)}

// 						{/* Comments page */}
// 						{activeTab === "Comments" && (
// 							<section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
// 								<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
// 									<div>
// 										<h3 className="font-bold text-slate-900">All comments</h3>
// 										<p className="mt-1 text-xs text-slate-400">
// 											Search, filter, and manage comments
// 										</p>
// 									</div>

// 									<input
// 										value={search}
// 										onChange={(event) => setSearch(event.target.value)}
// 										placeholder="Search comments..."
// 										className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-red-400 sm:max-w-xs"
// 									/>
// 								</div>

// 								<div className="mb-5 flex flex-wrap gap-2">
// 									{["All", "Blocked", "Pending", "Allowed"].map((filter) => (
// 										<button
// 											key={filter}
// 											onClick={() => setActiveFilter(filter)}
// 											className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
// 												activeFilter === filter
// 													? "bg-red-600 text-white"
// 													: "border border-slate-200 text-slate-500 hover:bg-slate-50"
// 											}`}>
// 											{filter}
// 										</button>
// 									))}
// 								</div>

// 								<CommentTable
// 									comments={filteredComments}
// 									onUpdate={updateComment}
// 								/>

// 								{filteredComments.length === 0 && (
// 									<p className="py-8 text-center text-sm text-slate-400">
// 										No comments found.
// 									</p>
// 								)}
// 							</section>
// 						)}

// 						{/* Rules page */}
// 						{activeTab === "Rules" && (
// 							<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
// 								<section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
// 									<div className="mb-6">
// 										<h3 className="font-bold text-slate-900">
// 											Protection settings
// 										</h3>
// 										<p className="mt-1 text-sm text-slate-400">
// 											Enable the rules you want to apply during a scan.
// 										</p>
// 									</div>

// 									<div className="space-y-5">
// 										{rules.map((rule) => (
// 											<div
// 												key={rule.id}
// 												className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
// 												<div>
// 													<p className="text-sm font-semibold text-slate-800">
// 														{rule.title}
// 													</p>
// 													<p className="mt-1 text-xs leading-5 text-slate-400">
// 														{rule.description}
// 													</p>
// 												</div>
// 												<button
// 													aria-label={`Toggle ${rule.title}`}
// 													aria-pressed={rule.enabled}
// 													onClick={() => toggleRule(rule.id)}
// 													className="switch"
// 													data-enabled={rule.enabled}
// 												/>
// 											</div>
// 										))}
// 									</div>
// 								</section>

// 								<section className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
// 									<div className="mb-5">
// 										<h3 className="font-bold text-slate-900">
// 											Blocked keywords
// 										</h3>
// 										<p className="mt-1 text-sm leading-6 text-slate-400">
// 											Comments containing these words will be blocked when the
// 											keyword rule is enabled.
// 										</p>
// 									</div>

// 									<div className="mb-4 flex flex-wrap gap-2">
// 										{keywords
// 											.split(",")
// 											.map((word) => word.trim())
// 											.filter(Boolean)
// 											.map((word) => (
// 												<span
// 													key={word}
// 													className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
// 													{word}
// 												</span>
// 											))}
// 									</div>

// 									<form
// 										onSubmit={(event) => {
// 											event.preventDefault();
// 											addKeyword();
// 										}}
// 										className="flex gap-2">
// 										<input
// 											value={keywordInput}
// 											onChange={(event) => setKeywordInput(event.target.value)}
// 											placeholder="Add keyword..."
// 											className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-red-400"
// 										/>
// 										<button
// 											type="submit"
// 											className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">
// 											Add
// 										</button>
// 									</form>

// 									<button
// 										onClick={runScan}
// 										disabled={scanning}
// 										className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60">
// 										{scanning ? "Scanning..." : "Run moderation scan"}
// 									</button>

// 									<p className="mt-3 text-xs leading-5 text-slate-400">
// 										This demo uses local sample data. No YouTube comments are
// 										modified.
// 									</p>
// 								</section>
// 							</div>
// 						)}

// 						{/* Presentation guide */}
// 						<section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
// 							<div className="mb-5 flex items-center gap-3">
// 								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg text-red-600">
// 									ⓘ
// 								</div>
// 								<div>
// 									<h3 className="font-bold text-slate-900">
// 										How to use this dashboard
// 									</h3>
// 									<p className="mt-1 text-xs text-slate-400">
// 										Quick guide for your presentation
// 									</p>
// 								</div>
// 							</div>

// 							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
// 								<GuideStep
// 									number="01"
// 									title="Configure rules"
// 									description="Open Rules and enable spam, link, or keyword detection."
// 								/>
// 								<GuideStep
// 									number="02"
// 									title="Run scan"
// 									description="Click Run scan to simulate automatic comment moderation."
// 								/>
// 								<GuideStep
// 									number="03"
// 									title="Review results"
// 									description="Open Comments and filter blocked, pending, or approved comments."
// 								/>
// 								<GuideStep
// 									number="04"
// 									title="Take action"
// 									description="Approve a comment, block it, or send it for manual review."
// 								/>
// 							</div>
// 						</section>

// 						<footer className="flex flex-col justify-between gap-2 pb-2 text-xs text-slate-400 sm:flex-row">
// 							<p>© 2026 PilotyComment · YouTube Moderation Demo</p>
// 							<p>Frontend simulation · Sample data only</p>
// 						</footer>
// 					</div>
// 				</section>
// 			</div>

// 			{/* Toast notification */}
// 			{notice && (
// 				<div
// 					role="status"
// 					className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100%-40px)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-xl">
// 					<span className="text-red-600">●</span>
// 					<span>{notice}</span>
// 					<button
// 						onClick={() => setNotice("")}
// 						aria-label="Close notification"
// 						className="ml-2 text-slate-400 hover:text-slate-700">
// 						✕
// 					</button>
// 				</div>
// 			)}
// 		</main>
// 	);
// }

// function StatCard({
// 	label,
// 	value,
// 	detail,
// 	icon,
// 	color,
// }: {
// 	label: string;
// 	value: number;
// 	detail: string;
// 	icon: string;
// 	color: "slate" | "red" | "amber" | "green";
// }) {
// 	const colors = {
// 		slate: "bg-slate-100 text-slate-600",
// 		red: "bg-red-50 text-red-600",
// 		amber: "bg-amber-50 text-amber-600",
// 		green: "bg-emerald-50 text-emerald-600",
// 	};

// 	return (
// 		<div className="soft-shadow rounded-2xl border border-slate-100 bg-white p-5">
// 			<div className="mb-5 flex items-center justify-between">
// 				<p className="text-sm font-medium text-slate-500">{label}</p>
// 				<div
// 					className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colors[color]}`}>
// 					{icon}
// 				</div>
// 			</div>

// 			<p className="text-3xl font-bold tracking-tight text-slate-900">
// 				{value.toLocaleString()}
// 			</p>
// 			<p className="mt-2 text-xs text-slate-400">{detail}</p>
// 		</div>
// 	);
// }

// function CommentTable({
// 	comments,
// 	onUpdate,
// }: {
// 	comments: Comment[];
// 	onUpdate: (id: number, status: CommentStatus) => void;
// }) {
// 	return (
// 		<div className="w-full overflow-x-auto">
// 			<table className="w-full min-w-[650px] text-left">
// 				<thead>
// 					<tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
// 						<th className="pb-4 font-semibold">User / Comment</th>
// 						<th className="pb-4 font-semibold">Reason</th>
// 						<th className="pb-4 font-semibold">Status</th>
// 						<th className="pb-4 text-right font-semibold">Action</th>
// 					</tr>
// 				</thead>

// 				<tbody>
// 					{comments.map((comment) => (
// 						<tr
// 							key={comment.id}
// 							className="border-b border-slate-50 last:border-0">
// 							<td className="py-4 pr-4">
// 								<div className="flex items-start gap-3">
// 									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
// 										{comment.avatar}
// 									</div>
// 									<div className="max-w-[300px]">
// 										<p className="text-sm font-semibold text-slate-700">
// 											{comment.name}
// 										</p>
// 										<p className="mt-1 text-xs leading-5 text-slate-400">
// 											{comment.comment}
// 										</p>
// 										<p className="mt-1 text-[10px] text-slate-300">
// 											{comment.time}
// 										</p>
// 									</div>
// 								</div>
// 							</td>

// 							<td className="py-4 pr-4">
// 								<span className="text-xs text-slate-500">{comment.reason}</span>
// 							</td>

// 							<td className="py-4 pr-4">
// 								<span
// 									className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[comment.status]}`}>
// 									{comment.status}
// 								</span>
// 							</td>

// 							<td className="py-4 text-right">
// 								<select
// 									aria-label={`Action for ${comment.name}`}
// 									value={comment.status}
// 									onChange={(event) =>
// 										onUpdate(comment.id, event.target.value as CommentStatus)
// 									}
// 									className="max-w-[125px] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600 outline-none focus:border-red-400">
// 									<option value="Blocked">Block</option>
// 									<option value="Pending">Review</option>
// 									<option value="Allowed">Approve</option>
// 								</select>
// 							</td>
// 						</tr>
// 					))}
// 				</tbody>
// 			</table>
// 		</div>
// 	);
// }

// function GuideStep({
// 	number,
// 	title,
// 	description,
// }: {
// 	number: string;
// 	title: string;
// 	description: string;
// }) {
// 	return (
// 		<div className="flex gap-3">
// 			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600">
// 				{number}
// 			</div>
// 			<div>
// 				<h4 className="text-sm font-semibold text-slate-800">{title}</h4>
// 				<p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import DemoNotice from "@/components/dashboard/DemoNotice";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentComments from "@/components/dashboard/RecentComments";
import RecentVideos from "@/components/dashboard/RecentVideos";
import ModerationRulesSummary from "@/components/dashboard/ModerationRulesSummary";
import DashboardGuide from "@/components/dashboard/DashboardGuide";
import Footer from "@/components/layout/Footer";
import { useModerationContext } from "@/components/moderation/ModerationProvider";

export default function Dashboard() {
  const { comments } = useModerationContext();

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
      <DemoNotice />
      <StatsGrid comments={comments} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <RecentComments />
        <div className="space-y-6">
          <RecentVideos />
          <ModerationRulesSummary />
        </div>
      </div>
      <DashboardGuide />
      <Footer />
    </div>
  );
}

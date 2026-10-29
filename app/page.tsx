import { getFeaturedVideos } from "@/lib/data";
import Dashboard from "@/components/dashboard/Dashboard";
import { wajibSesi } from "@/lib/scheme/session";

export default async function Page() {
  await wajibSesi();
  const featuredVideos = await getFeaturedVideos(2);

  return <Dashboard featuredVideos={featuredVideos} />;
}

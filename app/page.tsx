import { getFeaturedVideos } from "@/lib/data";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function Page() {
  const featuredVideos = await getFeaturedVideos(2);

  return <Dashboard featuredVideos={featuredVideos} />;
}

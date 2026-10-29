import { getVideos } from "@/lib/data";
import VideoPage from "@/components/video/VideoPage";
import { wajibSesi } from "@/lib/scheme/session";

export default async function Page() {
  await wajibSesi();
  const videos = await getVideos();

  return <VideoPage videos={videos} />;
}

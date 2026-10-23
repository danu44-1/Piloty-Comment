import { getVideos } from "@/lib/data";
import VideoPage from "@/components/video/VideoPage";

export default async function Page() {
  const videos = await getVideos();

  return <VideoPage videos={videos} />;
}

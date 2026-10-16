import { notFound } from "next/navigation";
import VideoDetail from "@/components/video/VideoDetail";
import { getVideoById } from "@/lib/utils/video";

type VideoDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoDetailsPage({ params }: VideoDetailsPageProps) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  return <VideoDetail video={video} />;
}

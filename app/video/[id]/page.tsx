import { notFound } from "next/navigation";
import VideoDetail from "@/components/video/VideoDetail";
import { getVideoById } from "@/lib/data";
import { wajibSesi } from "@/lib/scheme/session";

type VideoDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoDetailsPage({ params }: VideoDetailsPageProps) {
  await wajibSesi();
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  return <VideoDetail video={video} />;
}

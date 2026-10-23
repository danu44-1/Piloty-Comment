import "server-only";

import { initialVideos } from "@/lib/data/videos";
import type { Video } from "@/lib/types/video";

/**
 * Server-side data access layer for the video catalogue.
 *
 * The current product still uses demo data. These functions are async so the
 * storage can later be replaced by a database or internal API without moving
 * data access into Client Components.
 */
export async function getVideos(): Promise<Video[]> {
  return initialVideos.map((video) => ({ ...video }));
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  const videos = await getVideos();
  return videos.find((video) => video.id === id);
}

export async function getFeaturedVideos(limit = 3): Promise<Video[]> {
  const videos = await getVideos();
  return videos.slice(0, Math.max(0, limit));
}

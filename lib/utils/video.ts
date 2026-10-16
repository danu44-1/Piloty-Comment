import { initialVideos } from "@/lib/data/videos";
import type { Video } from "@/lib/types/video";

/** Returns the demo catalogue. Replace this source with a service later. */
export function getVideos(): Video[] {
  return initialVideos;
}

/** Finds a single video by its route-safe identifier. */
export function getVideoById(id: string): Video | undefined {
  return initialVideos.find((video) => video.id === id);
}

/** Returns a short list for the Overview page. */
export function getFeaturedVideos(limit = 3): Video[] {
  return initialVideos.slice(0, Math.max(0, limit));
}

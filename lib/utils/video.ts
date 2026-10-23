import "server-only";

/**
 * Compatibility exports for server callers. New code should import from
 * @/lib/data so the server-only data boundary is explicit.
 */
export {
  getFeaturedVideos,
  getVideoById,
  getVideos,
} from "@/lib/data";

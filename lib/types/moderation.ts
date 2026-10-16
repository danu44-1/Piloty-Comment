export type CommentStatus = "Blocked" | "Pending" | "Allowed";

export type Comment = {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  time: string;
  status: CommentStatus;
  reason: string;
  /** Optional video association used by the video-detail demo route. */
  videoId?: string;
};

export type RuleId = "spam" | "links" | "words" | "review";

export type ModerationRule = {
  id: RuleId;
  title: string;
  description: string;
  enabled: boolean;
};

export type CommentFilter = "All" | CommentStatus;
export type AppTab = "Overview" | "Videos" | "Comments" | "Rules";

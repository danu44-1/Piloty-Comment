export type CommentStatus = "Blocked" | "Pending" | "Allowed";

export type Comment = {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  time: string;
  status: CommentStatus;
  reason: string;
};

export type RuleId = "spam" | "links" | "words" | "review";

export type ModerationRule = {
  id: RuleId;
  title: string;
  description: string;
  enabled: boolean;
};

export type CommentFilter = "All" | CommentStatus;
export type AppTab = "Overview" | "Comments" | "Rules";

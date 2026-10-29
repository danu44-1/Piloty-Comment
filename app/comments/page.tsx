import CommentsPage from "@/components/comments/CommentsPage";
import { wajibSesi } from "@/lib/scheme/session";

export default async function Page() {
  await wajibSesi();
  return <CommentsPage />;
}

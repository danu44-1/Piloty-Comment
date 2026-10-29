import RulesPage from "@/components/rules/RulesPage";
import { wajibSesi } from "@/lib/scheme/session";

export default async function Page() {
	await wajibSesi();
	return <RulesPage />;
}

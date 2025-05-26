import { SubmissionsList } from "@/components/submissions-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Submissions() {
	const { orgId } = await auth();

	if (!orgId) return redirect("/");

	return (
		<main>
			<h1>Submissions</h1>
			<SubmissionsList />
		</main>
	);
}

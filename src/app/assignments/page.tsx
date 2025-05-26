import { AssignmentForm } from "@/components/assignment-form";
import { AssignmentsList } from "@/components/assignments-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Assignments() {
	const { orgId } = await auth();

	if (!orgId) return redirect("/");

	return (
		<main>
			<AssignmentForm />
			<h1>Assignments</h1>
			<AssignmentsList />
		</main>
	);
}
